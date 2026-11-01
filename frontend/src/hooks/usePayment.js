import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentApi } from '../api/paymentApi';

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: (data) => paymentApi.createOrder(data),
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (details) => paymentApi.verifyPayment(details),
  });
};

export const usePaymentStatus = (paymentId) => {
  return useQuery({
    queryKey: ['payment-status', paymentId],
    queryFn: () => paymentApi.getPaymentStatus(paymentId),
    enabled: Boolean(paymentId),
  });
};
