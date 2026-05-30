import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // 🎯 ĐÃ THÊM
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, Loader2, Search, Users, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner"; 

import { LEAD_COLUMNS } from "../features/crm/crm.constants";
import { LeadColumn } from "../features/crm/LeadColumn";
import { AddLeadModal } from "../features/crm/AddLeadModal";
import { LeadDetailPanel } from "../features/crm/LeadDetailPanel";
import { EditLeadModal } from "../features/crm/EditLeadModal"; 

import { useLeads } from "./../features/crm/hooks/useLeads";
import { LeadStatus, LeadUpdateRequest } from "./../../services/crm/crm.types";
import { crmService } from "./../../services/crm/crm.service";

export function CRMLeadsPage() {
  const navigate = useNavigate(); // 🎯 ĐÃ THÊM

  const { leads, isLoading, fetchLeads, changeLeadStatus, addNewLead } = useLeads();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    if (!searchTerm.trim()) return leads;
    const lowerQuery = searchTerm.toLowerCase();
    return leads.filter(l => 
      l.fullName?.toLowerCase().includes(lowerQuery) || 
      l.phone?.includes(searchTerm)
    );
  }, [leads, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      won: leads.filter(l => l.status === "WON").length,
      processing: leads.filter(l => l.status !== "WON" && l.status !== "LOST").length,
    };
  }, [leads]);

 const handleDrop = async (leadId: number, newStatus: LeadStatus) => {
    await changeLeadStatus(leadId, newStatus);
    
    if (newStatus === "WON") {
      toast.success("🎉 Chốt đơn! Đang chuyển sang trang Đặt tour...");
      
      setTimeout(() => {
        // 🎯 NHẢY ĐÚNG VÀO PATH "/admin/bookings" VÀ KÈM TÍN HIỆU MỞ MODAL
        navigate(`/admin/bookings?autoCreate=true&leadId=${leadId}`); 
      }, 1500);
    }
  };

  const handleSaveNewLead = async (data: any) => {
    const payload = {
      ...data, 
      email: data.email?.trim() === "" ? null : data.email,
      source: data.source?.trim() === "" ? null : data.source, 
      notes: data.notes?.trim() === "" ? null : data.notes,     
    };

    const success = await addNewLead(payload);
    if (success) setIsAddLeadOpen(false);
  };

  const handleUpdateLead = async (id: number, data: LeadUpdateRequest) => {
    try {
      await crmService.updateLead(id, data);
      await fetchLeads(); 
      setIsEditModalOpen(false); 
      setSelectedLead({ ...selectedLead, ...data }); 
      toast.success("Cập nhật thông tin khách hàng thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin khách hàng.");
    }
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-[#f8fafc]"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col space-y-6 bg-[#f8fafc] p-6 overflow-hidden">
        
        <div className="shrink-0 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">CRM Pipeline</h1>
              <p className="text-slate-500 font-medium mt-1">Quản lý và chăm sóc khách hàng</p>
            </div>
            <button onClick={() => setIsAddLeadOpen(true)} className="px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm tracking-wide shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] hover:bg-blue-700 transition-all flex items-center gap-2">
              <Plus size={18} strokeWidth={3} /> TẠO KHÁCH HÀNG
            </button>
          </div>

          <div className="flex flex-col xl:flex-row gap-4 px-2 items-center justify-between">
            <div className="flex gap-4 w-full xl:w-auto overflow-x-auto custom-scrollbar-horizontal pb-2 xl:pb-0">
              <div className="bg-white px-5 py-3.5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 min-w-[160px]">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Tổng Lead</p>
                  <p className="text-xl font-black text-slate-800">{stats.total}</p>
                </div>
              </div>
              <div className="bg-white px-5 py-3.5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 min-w-[160px]">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><TrendingUp size={20} /></div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Đang theo đuổi</p>
                  <p className="text-xl font-black text-slate-800">{stats.processing}</p>
                </div>
              </div>
              <div className="bg-white px-5 py-3.5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 min-w-[160px]">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={20} /></div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Đã chốt (WON)</p>
                  <p className="text-xl font-black text-slate-800">{stats.won}</p>
                </div>
              </div>
            </div>

            <div className="relative w-full xl:w-80 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm tên, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200/80 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto custom-scrollbar-horizontal pb-4">
          <div className="flex gap-6 h-full min-w-max px-2 items-start">
            {LEAD_COLUMNS.map((column) => (
              <LeadColumn 
                key={column.id} 
                column={column} 
                leads={filteredLeads.filter((l) => l.status === column.id)} 
                onDrop={handleDrop} 
                onLeadClick={setSelectedLead}
              />
            ))}
          </div>
        </div>
      </div>

      <AddLeadModal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} onSave={handleSaveNewLead} />
      
      <EditLeadModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        lead={selectedLead} 
        onUpdate={handleUpdateLead} 
      />

      <LeadDetailPanel 
        lead={selectedLead} 
        onClose={() => setSelectedLead(null)} 
        onEdit={() => setIsEditModalOpen(true)} 
      />
    </DndProvider>
  );
}