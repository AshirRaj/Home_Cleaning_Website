import crypto from 'crypto';
import Razorpay from 'razorpay';

export const logRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  console.log('[Razorpay Config Check]:');
  console.log(`  - Razorpay Key ID configured: ${Boolean(keyId)}`);
  if (keyId) {
    console.log(`  - Razorpay Key Mode: ${keyId.startsWith('rzp_test') ? 'TEST' : 'LIVE'}`);
  }
  console.log(`  - Razorpay Secret configured: ${Boolean(keySecret)}`);
  console.log(`  - Webhook Secret configured: ${Boolean(webhookSecret)}`);
};

export const createRazorpayOrder = async ({ amount, bookingId, currency = 'INR' }) => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error('[Razorpay] ❌ Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in process.env');
    throw new Error('Razorpay configuration missing on server.');
  }

  const amountInPaise = Math.round(Number(amount) * 100);

  console.log(`[Razorpay] Creating ${key_id.startsWith('rzp_test') ? 'TEST' : 'LIVE'} order:`);
  console.log(`  - Amount: ₹${amount} (${amountInPaise} paise)`);
  console.log(`  - Currency: ${currency}`);
  console.log(`  - Booking Receipt: ${bookingId || 'N/A'}`);

  const instance = new Razorpay({ key_id, key_secret });

  const orderOptions = {
    amount: amountInPaise,
    currency,
    receipt: (bookingId || `receipt_${Date.now()}`).substring(0, 40),
    notes: {
      bookingId: bookingId || '',
      service: 'Sagarika Cleaning Service',
    },
  };

  const order = await instance.orders.create(orderOptions);
  console.log(`[Razorpay] ✅ Order created successfully: ${order.id}`);

  return {
    orderId: order.id,
    amount: order.amount / 100,
    currency: order.currency,
    keyId: key_id,
  };
};

export const verifyRazorpaySignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    console.warn('[Razorpay] ⚠️ Missing order_id, payment_id, or signature for verification.');
    return false;
  }

  if (!key_secret) {
    console.error('[Razorpay] ❌ RAZORPAY_KEY_SECRET is not configured in process.env.');
    return false;
  }

  console.log(`[Razorpay] Verifying signature for Order ${razorpay_order_id} & Payment ${razorpay_payment_id}...`);

  const text = `${razorpay_order_id}|${razorpay_payment_id}`;
  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(text)
    .digest('hex');

  const isValid = generatedSignature === razorpay_signature;
  if (isValid) {
    console.log(`[Razorpay] ✅ Signature verification succeeded for Payment ${razorpay_payment_id}`);
  } else {
    console.error(`[Razorpay] ❌ Signature verification FAILED for Payment ${razorpay_payment_id}`);
  }

  return isValid;
};
