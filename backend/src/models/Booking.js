import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      fullName: { type: String, required: true, index: true },
      email: { type: String, required: true, lowercase: true, index: true },
      phone: { type: String, required: true, index: true },
      whatsApp: { type: String, default: '' },
      alternatePhone: { type: String, default: '' },
      specialInstructions: { type: String, default: '' },
    },
    service: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      startingPrice: { type: Number, default: 0 },
    },
    selectedServices: [
      {
        id: { type: String },
        name: { type: String },
        startingPrice: { type: Number },
      },
    ],
    property: {
      propertyType: {
        type: String,
        enum: ['Apartment', 'House', 'Villa', 'Office', 'Other'],
        default: 'Apartment',
      },
      bedrooms: { type: Number, default: 1 },
      bathrooms: { type: Number, default: 1 },
      livingRooms: { type: Number, default: 1 },
      propertySize: { type: String, default: '1000 sq ft' },
      specialRequirements: { type: String, default: '' },
    },
    address: {
      fullName: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      addressLine: { type: String, required: true },
      apartmentUnit: { type: String, default: '' },
      landmark: { type: String, default: '' },
      city: { type: String, default: 'Bhubaneswar' },
      state: { type: String, default: 'Odisha' },
      postalCode: { type: String, default: '751013' },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [85.8245, 20.2961], // Bhubaneswar default
        },
      },
    },
    schedule: {
      date: { type: String, required: true, index: true },
      timeSlot: { type: String, required: true },
    },
    selectedAddons: [
      {
        id: { type: String },
        name: { type: String },
        price: { type: Number },
      },
    ],
    pricing: {
      basePrice: { type: Number, required: true },
      extraBedroomCost: { type: Number, default: 0 },
      extraBathroomCost: { type: Number, default: 0 },
      extraLivingRoomCost: { type: Number, default: 0 },
      propertyMultiplier: { type: Number, default: 1.0 },
      adjustedServiceSubtotal: { type: Number, default: 0 },
      addonsTotal: { type: Number, default: 0 },
      subtotal: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      tax: { type: Number, required: true },
      taxRatePercentage: { type: Number, default: 18 },
      total: { type: Number, required: true, index: true },
    },
    payment: {
      method: { type: String, default: 'UPI' },
      gateway: { type: String, default: 'Razorpay' },
      orderId: { type: String, default: null },
      transactionId: { type: String, default: null },
      status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded', 'Pending (Pay After Work)'],
        default: 'Pending',
        index: true,
      },
      paidAt: { type: Date, default: null },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// GeoJSON index for geospatial query support
bookingSchema.index({ 'address.location': '2dsphere' });

export const Booking = mongoose.model('Booking', bookingSchema);
