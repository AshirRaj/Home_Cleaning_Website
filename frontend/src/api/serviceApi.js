import { ENDPOINTS } from './endpoints';
import { axiosInstance } from './axiosInstance';
import { MOCK_SERVICES } from '../mock/services';

const MOCK_ENABLED = false;
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const serviceApi = {
  getServices: async () => {
    if (MOCK_ENABLED) {
      await delay(400);
      return MOCK_SERVICES;
    }
    const response = await axiosInstance.get(ENDPOINTS.SERVICES.LIST);
    return response.data;
  },

  getAdminServices: async () => {
    if (MOCK_ENABLED) {
      await delay(400);
      return MOCK_SERVICES;
    }
    const response = await axiosInstance.get(ENDPOINTS.SERVICES.ADMIN_LIST);
    return response.data;
  },

  getServiceById: async (id) => {
    if (MOCK_ENABLED) {
      await delay(300);
      const service = MOCK_SERVICES.find((s) => s.id === id || s.slug === id);
      if (!service) {
        throw new Error(`Service with ID ${id} not found.`);
      }
      return service;
    }
    const response = await axiosInstance.get(ENDPOINTS.SERVICES.DETAILS(id));
    return response.data;
  },

  createService: async (serviceData) => {
    if (MOCK_ENABLED) {
      await delay(600);
      return { ...serviceData, id: serviceData.id || `srv-${Date.now()}` };
    }
    const response = await axiosInstance.post(ENDPOINTS.SERVICES.CREATE, serviceData);
    return response.data;
  },

  updateService: async ({ id, data }) => {
    if (MOCK_ENABLED) {
      await delay(600);
      return { ...data, id };
    }
    const response = await axiosInstance.put(ENDPOINTS.SERVICES.UPDATE(id), data);
    return response.data;
  },

  deleteService: async (id) => {
    if (MOCK_ENABLED) {
      await delay(400);
      return { success: true, id };
    }
    const response = await axiosInstance.delete(ENDPOINTS.SERVICES.DELETE(id));
    return response.data;
  },
};
