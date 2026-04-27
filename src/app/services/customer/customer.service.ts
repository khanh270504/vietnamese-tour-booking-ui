import api from '../api';
import { CustomerProfileResponse, CustomerUpdateProfileRequest } from './customer.types';

export const customerService = {
  getMyProfile: async (): Promise<CustomerProfileResponse> => {
    const response = await api.get<CustomerProfileResponse>('/api/v1/customers/me');
    return response.data;
  },

  updateMyProfile: async (data: CustomerUpdateProfileRequest): Promise<CustomerProfileResponse> => {
    const response = await api.put<CustomerProfileResponse>('/api/v1/customers/me', data);
    return response.data;
  }
};