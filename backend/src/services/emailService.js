import nodemailer from 'nodemailer';
import { Notification } from '../models/Notification.js';

// HTML escaping helper utility to prevent HTML injection in emails
const escapeHtml = (str) => {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

let cachedTransporter = null;

const getTransporter = () => {
  if (!cachedTransporter) {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }
  return cachedTransporter;
};

export const verifySmtpConfig = async () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || smtpPass === 'app_password_here' || smtpPass === 'password') {
    console.warn('[EmailService] ⚠️ SMTP configuration is incomplete or using placeholder credentials.');
    console.warn('[EmailService] ⚠️ Required in .env: SMTP_HOST, SMTP_PORT, SMTP_USER, and valid SMTP_PASS (e.g. Gmail App Password).');
    return false;
  }

  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log(`[EmailService] ✅ SMTP Transporter verified successfully (${smtpHost}:${smtpPort} as ${smtpUser})`);
    return true;
  } catch (err) {
    console.error('[EmailService] ❌ SMTP Transporter verification failed:', err.message);
    if (err.code) console.error(`  - Code: ${err.code}`);
    if (err.response) console.error(`  - Response: ${err.response}`);
    return false;
  }
};

export const sendBookingConfirmationEmail = async (booking) => {
  const bookingIdStr = booking.bookingId || booking.id || 'N/A';
  console.log(`[EmailService] 📧 Email service called for Booking #${bookingIdStr}`);

  const recipient = booking.customer?.email?.trim();

  // Validate recipient email
  if (!recipient) {
    console.warn(`[EmailService] ⚠️ No recipient email address found for Booking #${bookingIdStr}`);
    const notification = new Notification({
      bookingId: bookingIdStr,
      channel: 'EMAIL',
      type: 'BOOKING_CONFIRMATION',
      recipient: 'UNSPECIFIED',
      status: 'FAILED',
      error: 'Missing recipient email address in booking record',
    });
    await notification.save().catch((err) => {
      console.error('[NotificationService] ❌ Failed to save Notification DB record:', err.message);
    });
    console.log('[NotificationService] Notification DB record saved for EMAIL (Status: FAILED)');
    return;
  }

  console.log(`[EmailService] 📧 Recipient: ${recipient}`);

  const notification = new Notification({
    bookingId: bookingIdStr,
    channel: 'EMAIL',
    type: 'BOOKING_CONFIRMATION',
    recipient,
    status: 'PENDING',
  });

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM || 'SAGARIKA Cleaning <no-reply@sagarika.com>';

  console.log(`[EmailService] 📧 SMTP host: ${smtpHost}:${smtpPort}`);
  console.log(`[EmailService] 📧 SMTP user: ${smtpUser || '(not configured)'}`);

  // Configuration check before attempting SMTP call
  if (!smtpUser || !smtpPass || smtpPass === 'app_password_here' || smtpPass === 'password') {
    const errorMsg = 'SMTP configuration is incomplete. Required: SMTP_USER and valid SMTP_PASS (e.g. Gmail App Password).';
    console.error(`[EmailService] ❌ ${errorMsg}`);

    notification.status = 'FAILED';
    notification.error = errorMsg;
    await notification.save().catch((err) => {
      console.error('[NotificationService] ❌ Failed to save Notification DB record:', err.message);
    });
    console.log('[NotificationService] Notification DB record saved for EMAIL (Status: FAILED)');
    return;
  }

  try {
    const transporter = getTransporter();

    const customerName = escapeHtml(booking.customer?.fullName || 'Valued Customer');
    const serviceName = escapeHtml(booking.service?.name || 'Home Cleaning Service');
    const dateStr = escapeHtml(booking.schedule?.date || 'N/A');
    const timeSlotStr = escapeHtml(booking.schedule?.timeSlot || 'N/A');
    const addressLineStr = escapeHtml(booking.address?.addressLine || '');
    const cityStr = escapeHtml(booking.address?.city || '');
    const fullAddressStr = [addressLineStr, cityStr].filter(Boolean).join(', ');
    const totalStr = escapeHtml(booking.pricing?.total ?? 0);
    const paymentStatusStr = escapeHtml(booking.payment?.status || 'Pending');

    const mailOptions = {
      from: emailFrom,
      to: recipient,
      subject: `Sagarika Cleaning Booking Confirmation – ${bookingIdStr}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; rounded: 16px;">
          <div style="background-color: #0d9488; padding: 16px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">SAGARIKA ODICARE SERVICES</h1>
          </div>
          <h2 style="color: #0d9488; font-size: 18px;">🎉 Booking Confirmed!</h2>
          <p>Dear <strong>${customerName}</strong>,</p>
          <p>Thank you for choosing Sagarika Odicare Services. Here are your booking details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Booking ID:</td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${escapeHtml(bookingIdStr)}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Service:</td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${serviceName}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Cleaning Date:</td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${dateStr}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Time Slot:</td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${timeSlotStr}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Service Address:</td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${fullAddressStr}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Total Amount:</td><td style="padding: 8px 0; font-weight: bold; color: #0d9488;">₹${totalStr}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Payment Status:</td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${paymentStatusStr}</td></tr>
          </table>
          <p style="font-size: 13px; color: #475569;">Our cleaning team will contact you shortly before arrival at your scheduled slot.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">SAGARIKA ODICARE SERVICES • Professional Home Cleaning</p>
        </div>
      `,
    };

    console.log('[EmailService] 📧 Sending booking confirmation email...');
    const info = await transporter.sendMail(mailOptions);

    console.log(`[EmailService] ✅ Booking confirmation email sent: ${info.messageId}`);
    notification.status = 'SENT';
    notification.providerMessageId = info.messageId;
    notification.sentAt = new Date();
  } catch (error) {
    console.error(`[EmailService] ❌ Booking confirmation email failed for ${recipient}:`);
    console.error(`  - Message: ${error.message}`);
    if (error.code) console.error(`  - Code: ${error.code}`);
    if (error.response) console.error(`  - Response: ${error.response}`);
    if (error.command) console.error(`  - Command: ${error.command}`);

    notification.status = 'FAILED';
    notification.error = error.message;
  } finally {
    await notification.save().catch((err) => {
      console.error('[NotificationService] ❌ Failed to save Notification DB record:', err.message);
    });
    console.log(`[NotificationService] Notification DB record saved for EMAIL (Status: ${notification.status})`);
  }
};
