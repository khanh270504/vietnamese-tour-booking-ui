import { useState, useEffect, useCallback } from 'react';
import { VoucherService } from '../../../../services/voucher/voucher.service'; 
import { Voucher, VoucherCreateRequest } from '../../../../services/voucher/voucher.types';

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. LẤY DANH SÁCH (READ)
  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await VoucherService.getAllVouchers();
      // Tùy cấu hình axiosClient, có thể là response hoặc response.data
      const data = (response as any).data || response;
      setVouchers(Array.isArray(data) ? data : []); 
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lỗi khi tải danh sách Voucher');
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi lần đầu khi component mount
  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  // 2. THÊM MỚI (CREATE)
  const createVoucher = async (data: VoucherCreateRequest) => {
    try {
      await VoucherService.createVoucher(data);
      await fetchVouchers(); // Tạo xong tự động load lại danh sách
      return true; // Trả về true để UI biết đường đóng Modal/Form
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Lỗi khi tạo chiến dịch';
      throw new Error(errorMsg); // Ném lỗi ra để component dùng Toast/Alert hiển thị
    }
  };

  // 3. CẬP NHẬT (UPDATE)
  const updateVoucher = async (id: number, data: VoucherCreateRequest) => {
    try {
      await VoucherService.updateVoucher(id, data);
      await fetchVouchers(); // Sửa xong load lại danh sách
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Lỗi khi cập nhật chiến dịch';
      throw new Error(errorMsg);
    }
  };

  // 4. XÓA (DELETE)
  const deleteVoucher = async (id: number) => {
    try {
      await VoucherService.deleteVoucher(id);
      // Xóa ở local cho UI giật nhanh luôn, đỡ phải chờ API get lại (Optimistic Update)
      setVouchers((prev) => prev.filter((v) => v.id !== id));
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Lỗi khi xóa chiến dịch';
      throw new Error(errorMsg);
    }
  };

  // 5. LẤY CHI TIẾT (GET BY ID - Dùng khi mở Modal Edit)
  const getVoucherById = async (id: number) => {
    try {
      const response = await VoucherService.getVoucherById(id);
      return (response as any).data || response;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Lỗi khi tải thông tin chi tiết';
      throw new Error(errorMsg);
    }
  };

  // Ném hết đồ chơi ra ngoài để Component dùng
  return { 
    vouchers, 
    loading, 
    error, 
    refetch: fetchVouchers, // Dùng cho nút "Tải lại" trên UI
    createVoucher,
    updateVoucher,
    deleteVoucher,
    getVoucherById
  };
};