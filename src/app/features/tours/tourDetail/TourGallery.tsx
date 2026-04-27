import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TourGallery({ images = [] }: { images: string[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!images || images.length === 0) return null;

  const hasMultipleImages = images.length > 1;

  const nextImage = () => setCurrentIdx((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="mb-10">
      {/* ẢNH CHÍNH */}
      <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <img 
          src={images[currentIdx]} 
          alt="Tour Gallery" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        
        {/* 🎯 Xử lý ẩn/hiện điều hướng */}
        {hasMultipleImages && (
          <>
            <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg">
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-8 right-8 bg-black/50 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-black tracking-widest">
              {currentIdx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* THUMBNAILS: Chỉ hiện khi có nhiều ảnh */}
      {hasMultipleImages && (
        <div className="flex gap-4 mt-6 overflow-x-auto pb-2 custom-scrollbar">
          {images.map((img, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIdx(i)}
              className={`relative flex-shrink-0 w-32 h-20 rounded-2xl overflow-hidden border-4 transition-all ${
                currentIdx === i ? 'border-blue-600 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}