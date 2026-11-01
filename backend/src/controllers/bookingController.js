import { Booking } from '../models/Booking.js';
import { Service } from '../models/Service.js';
import { AuditLog } from '../models/AuditLog.js';
import { calculateBookingPrice } from '../services/pricingService.js';
import { getAvailabilityService, checkSlotAvailable } from '../services/availabilityService.js';
import { generateBookingId } from '../utils/generateBookingId.js';
import { sendBookingConfirmationEmail } from '../services/emailService.js';
import { sendBookingConfirmationWhatsApp } from '../services/whatsappService.js';

export const createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body;

    if (!bookingData.customer?.fullName || !bookingData.customer?.phone || !bookingData.customer?.email) {
      return res.status(400).json({
        success: false,
        message: 'Customer full name, email, and phone number are required.',
        code: 'VALIDATION_ERROR',
      });
    }

    if (!bookingData.schedule?.date || !bookingData.schedule?.timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Booking date and time slot are required.',
        code: 'VALIDATION_ERROR',
      });
    }

    // Check slot availability
    const isAvailable = await checkSlotAvailable(bookingData.schedule.date, bookingData.schedule.timeSlot);
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: `The selected time slot (${bookingData.schedule.timeSlot}) on ${bookingData.schedule.date} is fully booked. Please select another slot.`,
        code: 'SLOT_UNAVAILABLE',
      });
    }

    // Normalize selectedServices and selectedAddons from payload
    const selectedServices = bookingData.selectedServices || bookingData.services || (bookingData.service ? [bookingData.service] : []);
    const selectedAddons = bookingData.selectedAddons || bookingData.addons || [];

    // Backend authoritative pricing calculation
    const calculatedPricing = calculateBookingPrice({
      basePrice: bookingData.service?.startingPrice || selectedServices[0]?.startingPrice || 1499,
      selectedServices,
      propertyType: bookingData.property?.propertyType || 'Apartment',
      bedrooms: bookingData.property?.bedrooms || 1,
      bathrooms: bookingData.property?.bathrooms || 1,
      livingRooms: bookingData.property?.livingRooms || 1,
      selectedAddons,
    });

    // Merge authoritative pricing with incoming pricing object
    const finalPricing = {
      ...calculatedPricing,
      ...(bookingData.pricing || {}),
      adjustedServiceSubtotal: bookingData.pricing?.adjustedServiceSubtotal ?? calculatedPricing.adjustedServiceSubtotal,
      subtotal: bookingData.pricing?.subtotal ?? calculatedPricing.subtotal,
      tax: bookingData.pricing?.tax ?? calculatedPricing.tax,
      total: bookingData.pricing?.total ?? calculatedPricing.total,
    };

    const count = (await Booking.countDocuments()) + 1;
    const bookingId = bookingData.id || generateBookingId(count + 100);

    const paymentStatus = bookingData.payment?.status || 'Pending';

    const newBooking = new Booking({
      id: bookingId,
      bookingId,
      customer: bookingData.customer,
      service: bookingData.service || { id: selectedServices[0]?.id || 'deep-cleaning', name: selectedServices[0]?.name || 'Deep Home Cleaning', startingPrice: selectedServices[0]?.startingPrice || 2499 },
      selectedServices,
      property: bookingData.property || {},
      address: {
        ...bookingData.address,
        location: {
          type: 'Point',
          coordinates: [
            Number(bookingData.address?.longitude) || 85.8245,
            Number(bookingData.address?.latitude) || 20.2961,
          ],
        },
      },
      schedule: bookingData.schedule,
      selectedAddons,
      pricing: finalPricing,
      payment: {
        method: bookingData.payment?.method || 'UPI',
        gateway: 'Razorpay',
        status: paymentStatus,
        transactionId: bookingData.payment?.transactionId || null,
        paidAt: paymentStatus === 'Paid' ? new Date() : null,
      },
      status: bookingData.status || (paymentStatus === 'Paid' ? 'Confirmed' : 'Pending'),
      notes: bookingData.notes || '',
    });

    await newBooking.save();

    // Trigger non-blocking notifications
    sendBookingConfirmationEmail(newBooking).catch((error) => {
      console.error('❌ Booking confirmation email failed:', error);
    });
    sendBookingConfirmationWhatsApp(newBooking).catch((error) => {
      console.error('❌ Booking confirmation WhatsApp failed:', error);
    });

    return res.status(201).json(newBooking);
  } catch (error) {
    next(error);
  }
};

export const getAvailability = async (req, res, next) => {
  try {
    const days = Number(req.query.days) || 14;
    const availability = await getAvailabilityService(days);
    return res.status(200).json(availability);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({
      $or: [{ id }, { bookingId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking #${id} not found.`,
        code: 'NOT_FOUND',
      });
    }

    return res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getAdminBookings = async (req, res, next) => {
  try {
    const { search, status, paymentStatus, serviceId, sortBy = 'newest', page = 1, limit = 50 } = req.query;

    const query = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { id: searchRegex },
        { bookingId: searchRegex },
        { 'customer.fullName': searchRegex },
        { 'customer.email': searchRegex },
        { 'customer.phone': searchRegex },
      ];
    }

    if (status && status !== 'ALL') {
      query.status = new RegExp(`^${status}$`, 'i');
    }

    if (paymentStatus && paymentStatus !== 'ALL') {
      query['payment.status'] = new RegExp(paymentStatus, 'i');
    }

    if (serviceId && serviceId !== 'ALL') {
      query['service.id'] = serviceId;
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };
    else if (sortBy === 'highest_amount') sort = { 'pricing.total': -1 };
    else if (sortBy === 'lowest_amount') sort = { 'pricing.total': 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Return array directly to match frontend expected structure
    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid booking status. Allowed: ${validStatuses.join(', ')}`,
        code: 'VALIDATION_ERROR',
      });
    }

    const booking = await Booking.findOne({
      $or: [{ id }, { bookingId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking #${id} not found.`,
        code: 'NOT_FOUND',
      });
    }

    const previousStatus = booking.status;
    booking.status = status;
    await booking.save();

    // Audit Log
    if (req.admin) {
      await AuditLog.create({
        adminId: String(req.admin._id),
        adminEmail: req.admin.email,
        action: 'UPDATE_BOOKING_STATUS',
        resourceType: 'BOOKING',
        resourceId: booking.bookingId,
        metadata: { previousStatus, newStatus: status },
      }).catch(() => {});
    }

    return res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus, bookingStatus } = req.body;

    const booking = await Booking.findOne({
      $or: [{ id }, { bookingId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking #${id} not found.`,
        code: 'NOT_FOUND',
      });
    }

    if (paymentStatus) {
      booking.payment.status = paymentStatus;
      if (paymentStatus === 'Paid') {
        booking.payment.paidAt = new Date();
      }
    }

    if (bookingStatus) {
      booking.status = bookingStatus;
    } else if (paymentStatus === 'Paid' && booking.status === 'Pending') {
      booking.status = 'Confirmed';
    }

    await booking.save();

    return res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const addBookingNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { noteText } = req.body;

    if (!noteText) {
      return res.status(400).json({
        success: false,
        message: 'Note text cannot be empty.',
        code: 'VALIDATION_ERROR',
      });
    }

    const booking = await Booking.findOne({
      $or: [{ id }, { bookingId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking #${id} not found.`,
        code: 'NOT_FOUND',
      });
    }

    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const adminName = req.admin?.name || 'Admin';
    const formattedNote = booking.notes
      ? `${booking.notes}\n[${timestamp} by ${adminName}] ${noteText}`
      : `[${timestamp} by ${adminName}] ${noteText}`;

    booking.notes = formattedNote;
    await booking.save();

    return res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOneAndDelete({
      $or: [{ id }, { bookingId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking #${id} not found.`,
        code: 'NOT_FOUND',
      });
    }

    // Audit Log
    if (req.admin) {
      await AuditLog.create({
        adminId: String(req.admin._id),
        adminEmail: req.admin.email,
        action: 'DELETE_BOOKING',
        resourceType: 'BOOKING',
        resourceId: booking.bookingId || booking.id,
        metadata: { customerName: booking.customer?.fullName, serviceName: booking.service?.name },
      }).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      message: `Booking #${booking.bookingId || booking.id} deleted successfully.`,
      id: booking.bookingId || booking.id,
    });
  } catch (error) {
    next(error);
  }
};
