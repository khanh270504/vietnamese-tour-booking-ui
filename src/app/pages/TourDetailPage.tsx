import { useParams } from "react-router-dom";
import { Star, MapPin, Sparkles } from "lucide-react";
import { useTourDetail } from "../features/tours/hooks/useTourDetail";
import { TourGallery } from "../features/tours/tourDetail/TourGallery";
import { TourTabs } from "../features/tours/tourDetail/TourTabs";
import { TourSidebar } from "../features/tours/tourDetail/TourSidebar";
import { TourQuickInfo } from "../features/tours/tourDetail/TourQuickInfo"; 

export function TourDetailPage() {
  const { id } = useParams();
  
  const { tour, isLoading } = useTourDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse">Đang chuẩn bị hành trình...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center p-10 bg-white rounded-3xl shadow-sm border border-red-100">
          <p className="text-red-500 font-black text-2xl mb-2">Oops! Không tìm thấy Tour.</p>
          <p className="text-gray-500">Có thể tour này đã bị ẩn hoặc không tồn tại.</p>
        </div>
      </div>
    );
  }

  const rawImages = tour.tourImages?.map((img: any) => img.imageUrl) || [];
  const galleryImages = rawImages.length > 0 ? rawImages : (tour.thumbnail ? [tour.thumbnail] : []);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10">
      <div className="max-w-7xl mx-auto px-4">
        
        <TourGallery images={galleryImages} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          
          <div className="lg:col-span-2 space-y-10">
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={12} /> Tour cao cấp
                </span>
                <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm ml-auto bg-yellow-50 px-3 py-1.5 rounded-full">
                  <Star size={16} fill="currentColor" /> 5.0 <span className="text-yellow-700/50 font-medium">(Mới)</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.2] tracking-tight mb-4">
                {tour.name}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <MapPin size={18} className="text-blue-600" />
                Khám phá <span className="font-bold text-gray-800">{tour.destinationName || "Nhiều điểm đến"}</span>
              </div>
            </div>

            <TourQuickInfo tour={tour} />

            <TourTabs tour={tour} />
          </div>

          <div className="lg:col-span-1">
            <TourSidebar tour={tour} />
          </div>

        </div>
      </div>
    </div>
  );
}