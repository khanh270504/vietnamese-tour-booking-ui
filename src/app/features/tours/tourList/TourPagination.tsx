import { ChevronLeft, ChevronRight } from "lucide-react";

interface TourPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TourPagination({ currentPage, totalPages, onPageChange }: TourPaginationProps) {
  // Nếu chỉ có 1 trang hoặc không có dữ liệu thì không hiện Phân trang làm gì cho chật chội
  if (totalPages <= 1) return null;

  // Tạo mảng số trang (ví dụ [1, 2, 3])
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      
      {/* Nút Lùi */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-white border-2 border-transparent hover:border-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:border-transparent disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      >
        <ChevronLeft size={20} strokeWidth={3} />
      </button>

      {/* Các nút Số Trang */}
      {pages.map(page => (
        <button 
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
            currentPage === page 
              ? 'bg-blue-600 text-white shadow-[0_8px_20px_rgb(37,99,235,0.25)] -translate-y-0.5' 
              : 'bg-white border-2 border-gray-100 text-gray-400 hover:border-blue-300 hover:text-blue-600 shadow-sm'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Nút Tiến */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-white border-2 border-transparent hover:border-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:border-transparent disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      >
        <ChevronRight size={20} strokeWidth={3} />
      </button>

    </div>
  );
}