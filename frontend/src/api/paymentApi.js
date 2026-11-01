import { ENDPOINTS } from './endpoints';
import { axiosInstance } from './axiosInstance';

const MOCK_ENABLED = false;
const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

export const paymentApi = {
  createOrder: async (paymentData) => {
    if (MOCK_ENABLED) {
      await delay(600);
      return {
        orderId: `ORD_${Date.now()}`,
        amount: paymentData.amount,
        currency: 'INR',
        keyId: 'rzp_test_sparkle123',
      };
    }
    const response = await axiosInstance.post(ENDPOINTS.PAYMENTS.CREATE_ORDER, paymentData);
    return response.data;
  },

  verifyPayment: async (paymentDetails) => {
    if (MOCK_ENABLED) {
      await delay(1200); // Simulate network & payment processing delay
      return {
        success: true,
        transactionId: `TXN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status: 'PAID',
        paidAt: new Date().toISOString(),
        message: 'Payment authorized and verified successfully',
      };
    }
    const response = await axiosInstance.post(ENDPOINTS.PAYMENTS.VERIFY, paymentDetails);
    return response.data;
  },

  getPaymentStatus: async (paymentId) => {
    if (MOCK_ENABLED) {
      await delay(300);
      return {
        paymentId,
        status: 'PAID',
        gateway: 'Razorpay / Stripe Abstraction',
      };
    }
    const response = await axiosInstance.get(ENDPOINTS.PAYMENTS.STATUS(paymentId));
    return response.data;
  },
};
