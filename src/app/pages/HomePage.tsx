import { useState } from "react";
import { Link } from "react-router";
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { TourCard } from "../components/TourCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { PromoBanner } from "../components/PromoBanner";

export function HomePage() {
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const featuredTours = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1668000018482-a02acf02b22a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxvbmclMjBiYXklMjB2aWV0bmFtfGVufDF8fHx8MTc3MjUxMDc2NHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ",
      duration: "3 ngày 2 đêm",
      price: 5990000,
      seatsLeft: 12,
      departureDate: "15/06/2026"
    },
    {
      id: "2",
      image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5hbmclMjB2aWV0bmFtJTIwYmVhY2h8ZW58MXx8fHwxNzcyNTEwNzY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ",
      duration: "4 ngày 3 đêm",
      price: 7490000,
      seatsLeft: 3,
      departureDate: "20/06/2026"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHUlMjBxdW9jJTIwaXNsYW5kJTIwYmVhY2h8ZW58MXx8fHwxNzcyNDIyMDA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Phú Quốc Trọn Gói 3N2Đ",
      duration: "3 ngày 2 đêm",
      price: 6990000,
      seatsLeft: 8,
      departureDate: "25/06/2026"
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1649530928914-c2df337e3007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBhJTIwdmlldG5hbSUyMG1vdW50YWluc3xlbnwxfHx8fDE3NzI1MTA3NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Sapa - Fansipan - Hà Giang 4N3Đ",
      duration: "4 ngày 3 đêm",
      price: 5490000,
      seatsLeft: 10,
      departureDate: "30/06/2026"
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2klMjBhbiUyMHZpZXRuYW0lMjBhbmNpZW50JTIwdG93bnxlbnwxfHx8fDE3NzI1MTA3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Hội An - Huế - Động Phong Nha 5N4Đ",
      duration: "5 ngày 4 đêm",
      price: 8990000,
      seatsLeft: 15,
      departureDate: "05/07/2026"
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1562004966-39bfac0faf6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWtvbmclMjBkZWx0YSUyMHZpZXRuYW0lMjByaXZlcnxlbnwxfHx8fDE3NzI1MTA3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tour Miền Tây - Cần Thơ - Châu Đốc 3N2Đ",
      duration: "3 ngày 2 đêm",
      price: 4990000,
      seatsLeft: 5,
      departureDate: "10/07/2026"
    },
  ];

  const popularDestinations = [
    {
      name: "Đà Nẵng",
      image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5hbmclMjB2aWV0bmFtJTIwYmVhY2h8ZW58MXx8fHwxNzcyNTEwNzY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tours: "24 tour"
    },
    {
      name: "Phú Quốc",
      image: "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHUlMjBxdW9jJTIwaXNsYW5kJTIwYmVhY2h8ZW58MXx8fHwxNzcyNDIyMDA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tours: "18 tour"
    },
    {
      name: "Hà Nội",
      image: "https://images.unsplash.com/photo-1677837564800-73a0bb0ef938?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5vaSUyMHZpZXRuYW0lMjBjaXR5fGVufDF8fHx8MTc3MjUxMDc2NXww&ixlib=rb-4.1.0&q=80&w=1080",
      tours: "32 tour"
    },
    {
      name: "Sapa",
      image: "https://images.unsplash.com/photo-1649530928914-c2df337e3007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBhJTIwdmlldG5hbSUyMG1vdW50YWluc3xlbnwxfHx8fDE3NzI1MTA3NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tours: "15 tour"
    },
    {
      name: "Nha Trang",
      image: "https://images.unsplash.com/photo-1643030292895-caeed7e5d4f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwdHJhdmVsJTIwYmVhY2h8ZW58MXx8fHwxNzcyNTEwNzY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tours: "22 tour"
    },
  ];

  return (
    <div className="w-full">
      {/* Promo Banner */}
      <PromoBanner />
      
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1643030292895-caeed7e5d4f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwdHJhdmVsJTIwYmVhY2h8ZW58MXx8fHwxNzcyNTEwNzY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Khám phá thế giới cùng TravelVN
            </h1>
            <p className="text-xl text-white mb-8">
              Đặt tour nhanh chóng - Giá tốt - Hỗ trợ tận tâm
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Bạn muốn đi đâu?"
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    placeholder="Ngày khởi hành"
                    className="pl-10"
                  />
                </div>
                <Link to="/tours">
                  <Button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] h-10">
                    <Search className="w-4 h-4 mr-2" />
                    Tìm kiếm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Tours Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Tour nổi bật</h2>
            <p className="text-gray-600">Khám phá những tour du lịch được yêu thích nhất</p>
          </div>
          <Link to="/tours">
            <Button variant="outline" className="border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white">
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTours.map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Điểm đến phổ biến</h2>
            <p className="text-gray-600">Những địa điểm du lịch được khách hàng lựa chọn nhiều nhất</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {popularDestinations.map((destination, index) => (
              <Link key={index} to={`/tours?destination=${destination.name}`}>
                <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow">
                  <ImageWithFallback
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                      <p className="text-sm">{destination.tours}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative h-64 rounded-2xl overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2klMjBhbiUyMHZpZXRuYW0lMjBhbmNpZW50JTIwdG93bnxlbnwxfHx8fDE3NzI1MTA3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="CTA"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Bạn đã sẵn sàng cho chuyến đi tiếp theo?
                </h2>
                <p className="text-lg mb-6">
                  Hàng ngàn tour du lịch đang chờ bạn khám phá
                </p>
                <Link to="/tours">
                  <Button size="lg" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                    Xem Tour Ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}