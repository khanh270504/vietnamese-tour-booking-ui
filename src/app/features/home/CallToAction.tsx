import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="CTA Background"
        />
        <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center text-center p-6">
          <div className="max-w-2xl text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bắt đầu hành trình của bạn ngay hôm nay
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Hàng trăm tour du lịch hấp dẫn với giá ưu đãi đang chờ đón bạn. 
              Đừng bỏ lỡ cơ hội khám phá thế giới!
            </p>
            <Link 
              to="/tours" 
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg active:scale-95 inline-block"
            >
              Khám phá tất cả Tour
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}