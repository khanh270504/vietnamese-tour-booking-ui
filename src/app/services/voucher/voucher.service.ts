import axiosClient from '../api'; // Đường dẫn tùy cấu trúc thư mục của ông giáo
import { 
    Voucher, 
    VoucherCreateRequest, 
    VoucherApplyRequest, 
    VoucherApplyResponse 
} from '../voucher/voucher.types';

const VOUCHER_API_URL = '/api/v1/vouchers';

export const VoucherService = {
    
    getAllVouchers: () => {
        return axiosClient.get<Voucher[]>(`${VOUCHER_API_URL}/admin`);
    },


    getVoucherById: (id: number) => {
        return axiosClient.get<Voucher>(`${VOUCHER_API_URL}/admin/${id}`);
    },

    
    createVoucher: (data: VoucherCreateRequest) => {
        return axiosClient.post<Voucher>(`${VOUCHER_API_URL}/admin/create`, data);
    },

    
    updateVoucher: (id: number, data: VoucherCreateRequest) => {
        return axiosClient.put<Voucher>(`${VOUCHER_API_URL}/admin/${id}`, data);
    },

    
    deleteVoucher: (id: number) => {
        return axiosClient.delete<string>(`${VOUCHER_API_URL}/admin/${id}`);
    },

    
    getVoucherByCode: (code: string) => {
        return axiosClient.get<Voucher>(`${VOUCHER_API_URL}/public/code/${code}`);
    },

    
    applyVoucher: (data: VoucherApplyRequest) => {
        // Dùng POST vì có truyền body tính toán
        return axiosClient.post<VoucherApplyResponse>(`${VOUCHER_API_URL}/public/apply`, data);
    }
};