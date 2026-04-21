import { useState } from "react";
import { Filter, Search, Calendar, ChevronDown, ArrowUpDown, MapPin, Clock } from "lucide-react";
import { Link } from "react-router";

// Mock Data
const tours = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1668000018482-a02acf02b22a?q=80&w=1080",
    title: "Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ",
    duration: "3 ngày 2 đêm",
    price: 5990000,
    seatsLeft: 12,
    departureDate: "15/06/2026"
  },
  {
    id: "2",
    image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?q=80&w=1080",
    title: "Tour Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ",
    duration: "4 ngày 3 đêm",
    price: 7490000,
    seatsLeft: 3,
    departureDate: "20/06/2026"
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?q=80&w=1080",
    title: "Tour Phú Quốc Trọn Gói 3N2Đ",
    duration: "3 ngày 2 đêm",
    price: 6990000,
    seatsLeft: 8,
    departureDate: "25/06/2026"
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1649530928914-c2df337e3007?q=80&w=1080",
    title: "Tour Sapa - Fansipan - Hà Giang 4N3Đ",
    duration: "4 ngày 3 đêm",
    price: 5490000,
    seatsLeft: 10,
    departureDate: "30/06/2026"
  },
];

export function TourListingPage() {
  const [priceRange, setPriceRange] = useState(10000000); // Đơn giản hóa Slider thành 1 thanh kéo
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">
              Danh sách tour du lịch
            </h1>
            <p className="text-gray-500 font-medium">Tìm thấy <span className="text-blue-600 font-bold">{tours.length}</span> hành trình trải nghiệm</p>
          </div>
          
          {/* SORT DROPDOWN (Custom) */}
          <div className="relative group">
            <div className="bg-white border border-gray-100 rounded-2xl px-6 py-3 shadow-sm flex items-center gap-3 cursor-pointer hover:border-blue-200 transition-all">
              <ArrowUpDown size={16} className="text-blue-600" />
              <span className="text-sm font-black uppercase tracking-widest text-gray-400">Sắp xếp:</span>
              <span className="text-sm font-bold text-gray-900">Mới nhất</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* SIDEBAR FILTER */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <Filter className="text-blue-600" size={20} />
                <h2 className="text-lg font-black uppercase tracking-widest">Bộ lọc</h2>
              </div>

              {/* Destination */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 ml-1">Điểm đến</label>
                <select className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none appearance-none">
                  <option>Tất cả điểm đến</option>
                  <option>Hạ Long</option>
                  <option>Đà Nẵng</option>
                  <option>Phú Quốc</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 ml-1">
                  Giá tối đa: <span className="text-blue-600">{(priceRange).toLocaleString()}₫</span>
                </label>
                <input 
                  type="range" 
                  min="1000000" 
                  max="20000000" 
                  step="500000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Departure Date */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 ml-1">Ngày khởi hành</label>
                <div className="relative">
                  <input type="date" className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none" />
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                Áp dụng bộ lọc
              </button>
            </div>
          </aside>

          {/* TOUR GRID */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {tours.map((tour) => (
                <Link to={`/tours/${tour.id}`} key={tour.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={tour.image} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={tour.title} 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                        <MapPin size={10} /> Khám phá
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 mb-3 text-gray-400">
                      <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter">
                        <Clock size={14} className="text-blue-600" /> {tour.duration}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter">
                        <Calendar size={14} className="text-blue-600" /> {tour.departureDate}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                      {tour.title}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chỉ từ</p>
                        <p className="text-xl font-black text-blue-600">{(tour.price / 1000000).toFixed(1)} triệu</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${tour.seatsLeft > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {tour.seatsLeft > 0 ? `Còn ${tour.seatsLeft} chỗ` : 'Hết chỗ'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="mt-12 flex justify-center items-center gap-2">
              <button className="w-12 h-12 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all font-black">1</button>
              <button className="w-12 h-12 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all font-black">2</button>
              <button className="w-12 h-12 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all font-black">3</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}