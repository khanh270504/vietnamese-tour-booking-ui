import { Image as ImageIcon, Upload, Search, Trash2, CheckCircle2, Filter } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
const photos = [
  { id: 1, url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b", name: "Ha-Long-Bay.jpg", size: "2.4 MB" },
  { id: 2, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", name: "Phu-Quoc-Sunset.jpg", size: "1.8 MB" },
  { id: 3, url: "https://images.unsplash.com/photo-1528127269322-539801943592", name: "Sapa-Hill.jpg", size: "3.1 MB" },
  { id: 4, url: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0", name: "Da-Nang-Bridge.jpg", size: "1.2 MB" },
  { id: 5, url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4", name: "Bali-Vibe.jpg", size: "2.1 MB" },
  { id: 6, url: "https://images.unsplash.com/photo-1512100356956-c1227c341f58", name: "Loi-Gia-Resort.jpg", size: "4.5 MB" },
];

export function MediaLibraryPage() {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Thư viện Ảnh</h1>
          <p className="text-slate-500 font-medium">Lưu trữ hình ảnh MinIO Object Storage</p>
        </div>
        <div className="flex gap-3">
          {selected.length > 0 && (
            <button className="px-6 py-3.5 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm flex items-center gap-2 border border-rose-100">
              <Trash2 size={18} /> XÓA {selected.length} ẢNH
            </button>
          )}
          <button className="px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            <Upload size={18} /> TẢI ẢNH MỚI
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input placeholder="Tìm tên ảnh..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-transparent border focus:border-blue-200 transition-all outline-none" />
          </div>
          <button className="px-6 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-100"><Filter size={18}/> Bộ lọc</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              onClick={() => toggleSelect(photo.id)}
              className={cn(
                "group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer border-4 transition-all duration-300",
                selected.includes(photo.id) ? "border-blue-500 scale-95 shadow-lg" : "border-transparent hover:border-slate-100"
              )}
            >
              <img src={photo.url} alt={photo.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <p className="text-white text-[10px] font-black truncate">{photo.name}</p>
                <p className="text-blue-200 text-[9px] font-bold">{photo.size}</p>
              </div>
              {selected.includes(photo.id) && (
                <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                  <CheckCircle2 size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}