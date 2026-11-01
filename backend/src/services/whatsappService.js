import axios from 'axios';
import { Notification } from '../models/Notification.js';

export const sendBookingConfirmationWhatsApp = async (booking) => {
  const recipient = booking.customer?.whatsApp || booking.customer?.phone;
  if (!recipient) return;

  const notification = new Notification({
    bookingId: booking.bookingId || booking.id,
    channel: 'WHATSAPP',
    type: 'BOOKING_CONFIRMATION',
    recipient,
    status: 'PENDING',
  });

  try {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (token && phoneId && token !== 'eaab_test_token_whatsapp_cloud_api') {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: recipient.replace(/[^0-9]/g, ''),
          type: 'text',
          text: {
            body: `🎉 Thank you for booking with Sagarika Odicare Services!\n\nBooking ID: ${booking.bookingId || booking.id}\n🧹 Service: ${booking.service?.name}\n📅 Date: ${booking.schedule?.date}\n⏰ Time: ${booking.schedule?.timeSlot}\n💰 Amount: ₹${booking.pricing?.total}\n\nOur team will contact you shortly to confirm the service details.`,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      notification.status = 'SENT';
      notification.providerMessageId = response.data?.messages?.[0]?.id;
      notification.sentAt = new Date();
    } else {
      // Simulation mode
      console.log(`[WhatsAppService] Simulated WhatsApp message to ${recipient} for Booking #${booking.bookingId || booking.id}`);
      notification.status = 'SENT';
      notification.providerMessageId = `SIM_WA_${Date.now()}`;
      notification.sentAt = new Date();
    }
  } catch (error) {
    console.error(`[WhatsAppService] Failed to send WhatsApp message:`, error.message);
    notification.status = 'FAILED';
    notification.error = error.message;
  } finally {
    await notification.save().catch(() => { });
  }
};
