import { useState, useEffect, useCallback } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useTours } from "../features/tour/hooks/useTours";
import { TourForm } from "../features/tour/TourForm";
import { TourCardManagement } from "../features/tour/TourCardManagement";
import { TourFilterBar } from "../features/tour/TourFilterBar";
import { tourService } from "../../services/tour/tour.service";
import { TourResponse } from "../../services/tour/tour.types";

export function TourManagerPage() {
  const { deleteTour, saveTour, restoreTour } = useTours(); 
  
  const [showForm, setShowForm] = useState(false);
  const [editingTour, setEditingTour] = useState<TourResponse | null>(null);

  // 🎯 STATES LƯU TRỮ VÀ BỘ LỌC TẬP TRUNG (ĐÃ XÓA PHẦN GIÁ)
  const [tours, setTours] = useState<TourResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States binding cho bộ lọc tách riêng
  const [searchKeyword, setSearchKeyword] = useState(""); 
  const [filterStatus, setFilterStatus] = useState<"ACTIVE" | "INACTIVE" | "">("ACTIVE"); 
  const [selectedDestination, setSelectedDestination] = useState("");
  const [destinations, setDestinations] = useState<any[]>([]); 

  // Lấy danh mục điểm đến khi load trang
  useEffect(() => {
    tourService.getDestinations()
      .then(res => { if (res.result) setDestinations(res.result); })
      .catch(() => console.log("Không tải được danh mục điểm đến"));
  }, []);

  // States Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // 🎯 LUỒNG XỬ LÝ LỌC ĐA NĂNG TẠI FRONTEND
  const loadToursWithPanels = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await tourService.getAllToursForAdmin();
      
      if (res.result && Array.isArray(res.result)) {
        let processed = res.result;

        // 1. Lọc theo từ khóa tìm kiếm
        if (searchKeyword.trim()) {
          processed = processed.filter((t: any) => 
            t.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            t.tourCode?.toLowerCase().includes(searchKeyword.toLowerCase())
          );
        }

        // 2. Lọc theo Trạng thái
        if (filterStatus !== "") {
          processed = processed.filter((t: any) => 
            String(t.status).toUpperCase() === filterStatus
          );
        }

        // 3. Lọc theo Điểm đến
        if (selectedDestination) {
          processed = processed.filter((t: any) => t.destinationName === selectedDestination);
        }

        // 4. Tính toán phân trang
        setTotalElements(processed.length);
        const calculatedTotalPages = Math.ceil(processed.length / pageSize) || 1;
        setTotalPages(calculatedTotalPages);

        const validPage = currentPage > calculatedTotalPages ? 1 : currentPage;
        if (validPage !== currentPage) {
          setCurrentPage(validPage);
        }

        // 5. Cắt mảng (Slice)
        const offset = (validPage - 1) * pageSize;
        const pageContent = processed.slice(offset, offset + pageSize);
        
        setTours(pageContent);
      } else {
        setTours([]);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách tour từ hệ thống");
    } finally {
      setIsLoading(false);
    }
  }, [searchKeyword, filterStatus, selectedDestination, currentPage, pageSize]);

  // Reset về trang 1 khi thay đổi điều kiện lọc
  useEffect(() => {
    setCurrentPage(1); 
  }, [searchKeyword, filterStatus, selectedDestination]);

  useEffect(() => {
    loadToursWithPanels();
  }, [loadToursWithPanels]);

  const handleOpenForm = (tour?: TourResponse) => {
    setEditingTour(tour || null);
    setShowForm(true);
  };

  const handleExecuteDelete = async (id: number) => {
    const success = await deleteTour(id);
    if (success) loadToursWithPanels(); 
  };

  const handleExecuteRestore = async (id: number) => {
    const success = await restoreTour(id);
    if (success) loadToursWithPanels(); 
  };

  const handleExecuteSubmit = async (id: number | undefined, data: any) => {
    const success = await saveTour(id, data);
    if (success) {
      setShowForm(false);
      loadToursWithPanels(); 
    }
    return success;
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* THANH TIÊU ĐỀ */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Kho Tour</h1>
          <p className="text-slate-500 font-bold">Hệ thống danh mục điều phối và lưu trữ Tour</p>
        </div>
        {!showForm && (
          <button
            onClick={() => handleOpenForm()}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-transform active:scale-95 shadow-lg shadow-blue-200"
          >
            <Plus size={18} /> Thêm Tour
          </button>
        )}
      </div>

      {!showForm && (
        <>
          {/* COMPONENT BỘ LỌC ĐÃ TÁCH */}
          <TourFilterBar
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            selectedDestination={selectedDestination}
            setSelectedDestination={setSelectedDestination}
            destinations={destinations}
          />

          {/* VÙNG LƯỚI DANH SÁCH */}
          {isLoading ? (
            <div className="flex justify-center py-20 font-bold text-slate-400 animate-pulse">Đang truy vấn hệ thống...</div>
          ) : tours.length === 0 ? (
            <div className="text-center p-16 border-2 border-dashed rounded-3xl text-slate-400 bg-white border-slate-200 font-bold shadow-sm">
              Không tìm thấy kết quả tour nào phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <div key={tour.id} className="relative animate-in fade-in duration-200">
                  <TourCardManagement
                    tour={tour}
                    onEdit={handleOpenForm}
                    onDelete={handleExecuteDelete}
                    onRestore={handleExecuteRestore}
                  />
                  {String(tour.status).toUpperCase() === "INACTIVE" && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md pointer-events-none">
                      Đã xóa mềm
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-6">
              <p className="text-sm font-bold text-slate-500">
                Hiển thị trang <span className="text-slate-800">{currentPage}</span> / {totalPages} (Tổng số {totalElements} tour)
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2.5 bg-white border rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-all font-bold"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                      currentPage === pageNumber ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-white border text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-2.5 bg-white border rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-all font-bold"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showForm && (
        <TourForm
          tour={editingTour}
          onClose={() => setShowForm(false)}
          onSubmit={handleExecuteSubmit}
        />
      )}
    </div>
  );
}