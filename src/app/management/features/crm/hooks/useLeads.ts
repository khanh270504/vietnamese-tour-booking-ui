import { useState, useCallback } from "react";
import { toast } from "sonner";
import { crmService } from "../../../../services/crm/crm.service";
import { LeadResponse, LeadStatus, LeadCreateRequest } from "../../../../services/crm/crm.types";

export function useLeads() {
  const [leads, setLeads] = useState<LeadResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load danh sách Leads
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await crmService.getAllLeads();
      const data = res.result || (res as any).data || [];
      setLeads(data);
    } catch (error) {
      toast.error("Không thể tải danh sách Khách hàng");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Thay đổi trạng thái khi Kéo-Thả (Drag & Drop)
  const changeLeadStatus = async (id: number, newStatus: LeadStatus) => {
    try {
      // 🎯 ĐÃ SỬA: Gọi đúng hàm updateLeadStatus (dùng PATCH)
      await crmService.updateLeadStatus(id, newStatus);
      
      toast.success("Cập nhật trạng thái thành công");
      await fetchLeads(); // Load lại data mới
      return true;
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái");
      return false;
    }
  };

  // Thêm mới Lead
  const addNewLead = async (data: LeadCreateRequest) => {
    try {
      await crmService.createLead(data);
      toast.success("Thêm khách hàng thành công");
      await fetchLeads();
      return true;
    } catch (error) {
      toast.error("Lỗi khi thêm khách hàng");
      return false;
    }
  };

  return { leads, isLoading, fetchLeads, changeLeadStatus, addNewLead };
}