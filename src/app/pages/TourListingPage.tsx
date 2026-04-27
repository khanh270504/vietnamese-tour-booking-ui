import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; 
import { TourFilter } from "../features/tours/tourList/TourFilter";
import { TourSort } from "../features/tours/tourList/TourSort";
import { TourCard } from "../features/tours/tourList/TourCard";
import { TourPagination } from "../features/tours/tourList/TourPagination";
import { useTours } from "../features/tours/hooks/useTours";

export function TourListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const keywordFromUrl = searchParams.get("keyword") || "";

  const [filters, setFilters] = useState<any>({
    keyword: keywordFromUrl,
  });

  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setFilters((prev: any) => ({ ...prev, keyword: keywordFromUrl }));
    setPage(1); 
  }, [keywordFromUrl]);

  const { tours, destinations, totalPages, isLoading } = useTours(filters, sortBy, page);

  const handleClearFilters = () => {
    setFilters({});
    setSearchParams({}); 
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* --- HEADER DANH SÁCH --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">
              {keywordFromUrl ? `Kết quả tìm kiếm: "${keywordFromUrl}"` : "Danh sách tour du lịch"}
            </h1>
            <p className="text-gray-500 font-medium">Khám phá những hành trình tuyệt vời cùng chúng tôi</p>
          </div>
          <TourSort currentSort={sortBy} onSortChange={setSortBy} /> 
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* --- BỘ LỌC BÊN TRÁI --- */}
          <div className="lg:col-span-1">
             <TourFilter 
               currentFilters={filters} 
               onFilterChange={(newFilters) => {
                 // 🎯 Giữ lại keyword khi bấm "Áp dụng bộ lọc"
                 setFilters({ ...newFilters, keyword: keywordFromUrl }); 
                 setPage(1); // Lọc phát là phải nhảy về trang 1
               }} 
               destinations={destinations} 
             />
          </div>

          {/* --- DANH SÁCH TOUR BÊN PHẢI --- */}
          <div className="lg:col-span-3 flex flex-col h-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-400 font-bold mb-4 text-lg">Không tìm thấy tour phù hợp 😢</p>
                <button 
                  onClick={handleClearFilters} 
                  className="bg-blue-50 text-blue-600 font-bold px-6 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 flex-grow">
                 {tours.map((item) => (
                   <TourCard 
                      key={item.id} 
                      tour={item} // 🎯 CHỈ CẦN TRUYỀN DUY NHẤT TOUR VÀO ĐÂY LÀ ĐỦ, MỌI THỨ ĐÃ CÓ BÊN TRONG
                   />
                 ))}
              </div>
            )}

            {/* --- PHÂN TRANG --- */}
            {!isLoading && tours.length > 0 && (
              <div className="mt-12">
                <TourPagination 
                  currentPage={page} 
                  totalPages={totalPages} 
                  onPageChange={setPage} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}