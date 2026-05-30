import { useState, useCallback, useMemo } from "react";
import { providerService } from "../../../../services/provider/provider.service";
import { ProviderResponse, ProviderRequest, ProviderStatus } from "../../../../services/provider/provider.types";

export function useProviders() {
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách
  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await providerService.getAll();
      setProviders(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhà cung cấp:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Thêm mới
  const addProvider = async (data: ProviderRequest) => {
    try {
      const newProvider = await providerService.create(data);
      setProviders(prev => [newProvider, ...prev]);
      return true;
    } catch (error) {
      console.error("Lỗi thêm đối tác:", error);
      return false;
    }
  };

  // Cập nhật
  const updateProvider = async (id: number, data: ProviderRequest) => {
    try {
      const updated = await providerService.update(id, data);
      setProviders(prev => prev.map(p => p.id === id ? updated : p));
      return true;
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      return false;
    }
  };

  // Đổi trạng thái (Active / Pending / Inactive)
  const changeStatus = async (id: number, status: ProviderStatus) => {
    try {
      const updated = await providerService.changeStatus(id, status);
      setProviders(prev => prev.map(p => p.id === id ? updated : p));
    } catch (error) {
      console.error("Lỗi đổi trạng thái:", error);
    }
  };

  // Lọc dữ liệu theo ô tìm kiếm
  const filteredProviders = useMemo(() => {
    if (!searchTerm) return providers;
    const lower = searchTerm.toLowerCase();
    return providers.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      p.providerCode.toLowerCase().includes(lower) ||
      p.phone.includes(lower)
    );
  }, [providers, searchTerm]);

  // Thống kê nhanh cho Header
  const stats = useMemo(() => {
    return {
      total: providers.length,
      active: providers.filter(s => s.status === 'ACTIVE').length,
      totalVolume: providers.reduce((sum, s) => sum + (s.totalCostVolume || 0), 0)
    };
  }, [providers]);

  return { 
    providers: filteredProviders, 
    isLoading, 
    stats, 
    searchTerm,
    setSearchTerm,
    fetchProviders,
    addProvider,
    updateProvider,
    changeStatus
  };
}