import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, ChevronDown, Check } from "lucide-react";

interface TourSortProps {
  currentSort: string;
  onSortChange: (sortValue: string) => void;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "duration_asc", label: "Thời gian ngắn nhất" },
];

export function TourSort({ currentSort = "newest", onSortChange }: TourSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tự động đóng Dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = SORT_OPTIONS.find(opt => opt.value === currentSort)?.label || "Mới nhất";

  return (
    <div className="relative z-20" ref={dropdownRef}>
      {/* NÚT BẤM HIỂN THỊ */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-100 rounded-2xl px-6 py-3 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center gap-3 hover:border-blue-200 hover:shadow-[0_4px_15px_rgb(0,0,0,0.05)] transition-all outline-none"
      >
        <ArrowUpDown size={16} className="text-blue-600" />
        <span className="text-sm font-black uppercase tracking-widest text-gray-400">Sắp xếp:</span>
        <span className="text-sm font-bold text-gray-900 w-36 text-left truncate">{selectedLabel}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* DANH SÁCH DROPDOWN MỞ XUỐNG */}
      <div className={`absolute right-0 mt-2 w-full min-w-[240px] bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] border border-gray-50 overflow-hidden transition-all duration-200 origin-top-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="py-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-5 py-3 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors group"
            >
              <span className={`text-sm font-semibold ${currentSort === option.value ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}`}>
                {option.label}
              </span>
              {currentSort === option.value && (
                <Check size={16} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}