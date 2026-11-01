import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, index: true },
    channel: {
      type: String,
      enum: ['EMAIL', 'WHATSAPP'],
      required: true,
    },
    type: {
      type: String,
      enum: ['BOOKING_CONFIRMATION', 'PAYMENT_RECEIPT', 'STATUS_UPDATE'],
      default: 'BOOKING_CONFIRMATION',
    },
    recipient: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'SENT', 'FAILED', 'SIMULATED'],
      default: 'PENDING',
      index: true,
    },
    providerMessageId: { type: String, default: null },
    error: { type: String, default: null },
    attempts: { type: Number, default: 0 },
    sentAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);
