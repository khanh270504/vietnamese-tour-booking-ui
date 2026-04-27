import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, TrendingUp, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { tourService } from "../../services/tour/tour.service"; 
import { DestinationResponse } from "../../services/tour/tour.types"; 

export function Hero() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [destinations, setDestinations] = useState<DestinationResponse[]>([]); 
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    tourService.getDestinations().then((res) => {
      if (res.result) {
        setDestinations(res.result);
      }
    });
  }, []);

  const filteredDestinations = keyword.trim() === "" 
    ? destinations.slice(0, 4) 
    : destinations.filter(d => 
        d.name.toLowerCase().includes(keyword.toLowerCase())
      );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🎯 CẬP NHẬT: Xử lý tìm kiếm an toàn & sạch sẽ
  const handleSearch = (selectedKwd?: string) => {
    const finalKwd = selectedKwd !== undefined ? selectedKwd : keyword;
    setIsDropdownOpen(false);

    if (finalKwd.trim()) {
      navigate(`/tours?keyword=${encodeURIComponent(finalKwd.trim())}`);
    } else {
      navigate(`/tours`);
    }
  };

  return (
    <div className="relative h-[550px] bg-slate-900 flex items-center justify-center overflow-visible">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8df9?q=80&w=2021" 
          className="w-full h-full object-cover opacity-50" 
          alt="hero"
        />
      </div>

      <div className="text-center z-10 px-4 w-full max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl italic tracking-tight uppercase">
          Hành trình tiếp theo?
        </h1>

        <div className="bg-[#febb02] p-1 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-1 items-stretch relative">
          
          {/* Ô NHẬP ĐỊA ĐIỂM */}
          <div className="relative flex-[2] bg-white rounded-xl flex items-center px-4 py-4" ref={dropdownRef}>
            <MapPin className="text-blue-600 mr-3 shrink-0" size={22} />
            <input 
              placeholder="Bạn muốn đi đâu?" 
              className="w-full outline-none text-gray-800 font-bold text-lg placeholder:text-gray-400 placeholder:font-medium"
              value={keyword}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            {/* --- DROPDOWN DỮ LIỆU THẬT --- */}
            {isDropdownOpen && filteredDestinations.length > 0 && (
              <div className="absolute top-[115%] left-0 w-full md:w-[120%] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                
                <div className="p-4 bg-gray-50/50 flex items-center gap-2 border-b border-gray-100">
                  <TrendingUp size={16} className="text-orange-500" />
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                    {keyword ? "Kết quả tìm kiếm" : "Điểm đến gợi ý"}
                  </span>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-2">
                  {filteredDestinations.map((dest) => (
                    <div 
                      key={dest.id}
                      onClick={() => {
                        setKeyword(dest.name);
                        handleSearch(dest.name);
                      }}
                      className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl transition-all cursor-pointer group/item"
                    >
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <MapPin size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-grow text-left">
                        <div className="font-black text-gray-800">{dest.name}</div>
                        <div className="text-xs text-gray-500 font-medium line-clamp-1">{dest.description}</div>
                      </div>
                      <Search size={16} className="text-gray-300 group-hover/item:text-blue-600 transition-colors" />
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-blue-600 text-center">
                   <p className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                     <Star size={10} className="fill-white" /> Khám phá điểm đến cùng BookingTour
                   </p>
                </div>
              </div>
            )}
          </div>

          {/* Ô NGÀY THÁNG */}
          <div className="flex-1 bg-white rounded-xl flex items-center px-4 py-4 cursor-pointer hover:bg-gray-50">
            <Calendar className="text-gray-400 mr-3 shrink-0" size={20} />
            <div className="text-left">
              <div className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Thời gian</div>
              <div className="text-gray-800 font-bold text-sm whitespace-nowrap">Chọn ngày khởi hành</div>
            </div>
          </div>

          {/* NÚT TÌM KIẾM */}
          <button 
            onClick={() => handleSearch()}
            className="bg-[#006ce4] text-white px-10 py-4 rounded-xl hover:bg-blue-700 flex items-center justify-center font-black text-lg transition-all active:scale-95 shadow-lg"
          >
            TÌM KIẾM
          </button>
        </div>
      </div>
    </div>
  );
}