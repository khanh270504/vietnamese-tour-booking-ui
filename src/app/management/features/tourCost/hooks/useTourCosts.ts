import { useState, useCallback } from 'react';
import { tourCostService } from '../../../../services/tourCost/tourCost.service'; 
import { TourCostResponse, TourCostRequest, TourCostStatus } from '../../../../services/tourCost/tourCost.types';

export function useTourCosts() {
  const [costs, setCosts] = useState<TourCostResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalAmount: 0, totalUnpaid: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const data = await tourCostService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  }, []);
  //Phân trang
  const fetchCosts = useCallback(async (page = 1, search = "", status = "") => {
    setIsLoading(true);
    try {
      const response = await tourCostService.getAll(page, 10, search, status);
      
      setCosts(response.data);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      fetchStats(); 
    } catch (error) {
      console.error("Lỗi khi tải danh sách chi phí:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats]); 
  const addCost = async (data: TourCostRequest) => {
    try {
      await tourCostService.create(data);
      await fetchCosts(); // Refresh lại bảng
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm phiếu chi:", error);
      return false;
    }
  };

  // Cập nhật
  const updateCost = async (id: number, data: TourCostRequest) => {
    try {
      await tourCostService.update(id, data);
      await fetchCosts();
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật phiếu chi:", error);
      return false;
    }
  };

  // Đổi trạng thái (Kế toán duyệt)
  const changeStatus = async (id: number, status: TourCostStatus, note?: string) => {
    try {
      await tourCostService.updateStatus(id, status, note);
      await fetchCosts();
      return true;
    } catch (error) {
      console.error("Lỗi khi đổi trạng thái:", error);
      return false;
    }
  };

  // Xóa
  const deleteCost = async (id: number) => {
    try {
      await tourCostService.delete(id);
      await fetchCosts();
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa phiếu chi:", error);
      return false;
    }
  };
  

 
  return {
    costs,
    isLoading,
    fetchCosts,
    addCost,
    updateCost,
    changeStatus,
    deleteCost,
    currentPage,
    totalPages,
    totalElements,
    keyword,
    setKeyword,
    stats,
  };
}