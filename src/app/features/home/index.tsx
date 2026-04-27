import { Hero } from "./Hero";
import { FeaturedTours } from "./FeaturedTours";
import { PopularDestinations } from "./PopularDestinations";
import { CallToAction } from "./CallToAction";
import { PromoBanner } from "../../components/PromoBanner";

export default function HomeFeature() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Banner khuyến mãi chạy trên cùng (nếu có) */}
      <PromoBanner />

      {/* 2. Banner chính & Thanh tìm kiếm */}
      <Hero />

      {/* 3. Nội dung chính: Tour và Điểm đến */}
      <main className="space-y-12"> 
        {/* Dùng space-y để tạo khoảng cách đều giữa các section */}
        
        <FeaturedTours />
        
        <PopularDestinations />
        
        <CallToAction />
      </main>
    </div>
  );
}