import crypto from 'crypto';
import { Payment } from '../models/Payment.js';
import { Booking } from '../models/Booking.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/paymentService.js';
import { sendBookingConfirmationEmail } from '../services/emailService.js';
import { sendBookingConfirmationWhatsApp } from '../services/whatsappService.js';

export const createOrder = async (req, res, next) => {
  try {
    const { amount, bookingId, currency = 'INR' } = req.body;
    console.log('[PaymentController] Order creation requested:', { amount, bookingId, currency });

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid positive amount is required to create a payment order.',
        code: 'VALIDATION_ERROR',
      });
    }

    const orderData = await createRazorpayOrder({ amount, bookingId, currency });

    // Store pending payment in DB
    if (orderData.orderId && bookingId) {
      const paymentRecord = new Payment({
        paymentId: `PAY_${Date.now()}`,
        bookingId: bookingId || 'PENDING',
        amount,
        currency,
        orderId: orderData.orderId,
        status: 'Pending',
      });
      await paymentRecord.save().catch(() => {});
    }

    return res.status(200).json({
      success: true,
      order: {
        id: orderData.orderId,
        amount: Math.round(Number(amount) * 100),
        currency,
      },
      orderId: orderData.orderId,
      amount,
      currency,
      keyId: orderData.keyId,
    });
  } catch (error) {
    console.error('[PaymentController] ❌ Create order error:');
    console.error('  - Message:', error.message);
    if (error.statusCode) console.error('  - StatusCode:', error.statusCode);
    if (error.error) console.error('  - Razorpay Error:', JSON.stringify(error.error));
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    console.log('[PaymentController] Verification requested:', {
      razorpay_order_id,
      razorpay_payment_id,
      hasSignature: Boolean(razorpay_signature),
      bookingId,
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('[PaymentController] ❌ Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature in request payload.');
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay payment parameters (razorpay_order_id, razorpay_payment_id, razorpay_signature).',
        code: 'VALIDATION_ERROR',
      });
    }

    const isValid = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      console.error('[PaymentController] ❌ Razorpay signature verification failed.');
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature verification failed.',
        code: 'PAYMENT_VERIFICATION_FAILED',
      });
    }

    const transactionId = razorpay_payment_id;
    const paidAt = new Date();

    // Update Booking status if booking exists
    if (bookingId) {
      const booking = await Booking.findOne({
        $or: [{ id: bookingId }, { bookingId }],
      });

      if (booking) {
        booking.payment.status = 'Paid';
        booking.payment.transactionId = transactionId;
        booking.payment.orderId = razorpay_order_id;
        booking.payment.paidAt = paidAt;

        if (booking.status === 'Pending') {
          booking.status = 'Confirmed';
        }

        await booking.save();

        sendBookingConfirmationEmail(booking).catch((error) => {
          console.error('❌ Booking confirmation email failed:', error);
        });
        sendBookingConfirmationWhatsApp(booking).catch((error) => {
          console.error('❌ Booking confirmation WhatsApp failed:', error);
        });
      }
    }

    // Update Payment record
    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        transactionId,
        signature: razorpay_signature,
        status: 'Paid',
        paidAt,
      },
      { upsert: false }
    ).catch(() => {});

    return res.status(200).json({
      success: true,
      transactionId,
      orderId: razorpay_order_id,
      status: 'Paid',
      paidAt: paidAt.toISOString(),
      message: 'Payment authorized and verified successfully',
    });
  } catch (error) {
    console.error('[PaymentController] ❌ Verify payment error:', error.message);
    next(error);
  }
};

export const getPaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({
      $or: [{ paymentId: id }, { orderId: id }, { transactionId: id }],
    });

    if (!payment) {
      return res.status(200).json({
        paymentId: id,
        status: 'Paid',
        gateway: 'Razorpay',
      });
    }

    return res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    console.log('[Payment Webhook Received]: Event:', req.body?.event);

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('[Payment Webhook] ❌ Invalid webhook signature verification failed.');
        return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
      }
    }

    const event = req.body;
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const booking = await Booking.findOne({ 'payment.orderId': orderId });
        if (booking && booking.payment.status !== 'Paid') {
          booking.payment.status = 'Paid';
          booking.payment.transactionId = paymentId;
          booking.payment.paidAt = new Date();
          if (booking.status === 'Pending') booking.status = 'Confirmed';
          await booking.save();

          sendBookingConfirmationEmail(booking).catch((error) => {
            console.error('❌ Booking confirmation email failed:', error);
          });
          sendBookingConfirmationWhatsApp(booking).catch((error) => {
            console.error('❌ Booking confirmation WhatsApp failed:', error);
          });
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Payment Webhook Error]:', error.message);
    next(error);
  }
};
