import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../api/serviceApi';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => serviceApi.getServices(),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

export const useAdminServices = () => {
  return useQuery({
    queryKey: ['admin-services'],
    queryFn: () => serviceApi.getAdminServices(),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
};

export const useService = (serviceId) => {
  return useQuery({
    queryKey: ['services', serviceId],
    queryFn: () => serviceApi.getServiceById(serviceId),
    enabled: Boolean(serviceId),
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceData) => serviceApi.createService(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => serviceApi.updateService({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services', variables.id] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => serviceApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
  });
};
