import { useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

interface TourGalleryProps {
  // Chỉ nhận mảng string tên file từ API
  images: string[];
}

export function TourGallery({ images = [] }: TourGalleryProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const MINIO_BASE_URL =
    import.meta.env.VITE_MINIO_URL || "http://localhost:9000/tours";
  if (!images || images.length === 0) {
    return (
      <div className="h-[450px] rounded-[2.5rem] bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400 shadow-xl">
        <Images size={64} />
        <p className="mt-4 text-sm font-bold tracking-wide">
          Chưa có ảnh cho tour này
        </p>
      </div>
    );
  }

  const hasMultipleImages = images.length > 1;

  /**
   * NEXT / PREV
   */
  const nextImage = () => {
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="mb-14">
      {/* MAIN IMAGE */}
      <div className="relative overflow-hidden rounded-[2.8rem] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.25)] group">
        <img
          key={images[currentIdx]} // Dùng tên file làm key
          src={`${MINIO_BASE_URL}/${images[currentIdx]}`} // Ghép URL trực tiếp
          alt={`Tour image ${currentIdx + 1}`}
          className="w-full h-[560px] object-cover transition-all duration-700 group-hover:scale-105"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* IMAGE COUNTER */}
        <div className="absolute bottom-6 right-6 px-5 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-black tracking-widest shadow-xl">
          {currentIdx + 1} / {images.length}
        </div>

        {/* NAVIGATION */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center shadow-xl"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center shadow-xl"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </div>

      {/* THUMBNAILS */}
      {hasMultipleImages && (
        <div className="flex gap-4 mt-7 overflow-x-auto pb-2 custom-scrollbar">
          {images.map((img, i) => {
            const active = currentIdx === i;

            return (
              <button
                key={img} // Dùng tên file làm key
                onClick={() => setCurrentIdx(i)}
                className={`
                  relative flex-shrink-0 overflow-hidden rounded-2xl transition-all duration-300
                  ${
                    active
                      ? "ring-4 ring-blue-500 scale-95 shadow-2xl"
                      : "opacity-60 hover:opacity-100 hover:-translate-y-1"
                  }
                `}
              >
                <img
                  src={`${MINIO_BASE_URL}/${img}`}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-40 h-24 object-cover"
                />

                {active && (
                  <div className="absolute inset-0 border-2 border-white rounded-2xl" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}