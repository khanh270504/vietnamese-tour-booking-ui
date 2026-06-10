import api from '../api';
import { ApiResponse } from '../auth/auth.types';
import { CustomerProfileResponse, CustomerUpdateProfileRequest } from './customer.types';

export const customerService = {
    getMyProfile: () => 
        api.get<ApiResponse<CustomerProfileResponse>>('/api/v1/customers/me').then(res => res.data),
    
    updateMyProfile: (data: CustomerUpdateProfileRequest) => 
        api.put<ApiResponse<CustomerProfileResponse>>('/api/v1/customers/me', data).then(res => res.data),

    getAllCustomers: (page: number, size: number, keyword: string) => 
    api.get<ApiResponse<any>>(`/api/v1/customers/admin/list?page=${page}&size=${size}&keyword=${encodeURIComponent(keyword)}`)
       .then(res => res.data),
    getAdminCustomerDetail: (id: number) => 
        api.get<ApiResponse<CustomerProfileResponse>>(`/api/v1/customers/admin/${id}`).then(res => res.data),
    
    updateAdminCustomerProfile: (id: number, data: CustomerUpdateProfileRequest) => 
        api.put<ApiResponse<CustomerProfileResponse>>(`/api/v1/customers/admin/${id}`, data).then(res => res.data),
};