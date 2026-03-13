import { useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Calendar, Users, Trash2, Plus } from "lucide-react";

export function BookingPage() {
  const { id } = useParams();
  const [passengers, setPassengers] = useState([
    { id: 1, name: "", birthDate: "", gender: "" }
  ]);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const tourPrice = 5990000;
  const numberOfPassengers = passengers.length;
  const totalPrice = tourPrice * numberOfPassengers;
  const finalPrice = totalPrice - discount;

  const addPassenger = () => {
    setPassengers([...passengers, { id: Date.now(), name: "", birthDate: "", gender: "" }]);
  };

  const removePassenger = (id: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id));
    }
  };

  const applyVoucher = () => {
    if (voucherCode === "SUMMER2026") {
      setDiscount(500000);
    } else {
      setDiscount(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Đặt tour</h1>
        <p className="text-gray-600">Vui lòng điền đầy đủ thông tin để hoàn tất đặt tour</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin người đặt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input id="fullName" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input id="phone" placeholder="0912345678" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="example@email.com" />
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Danh sách hành khách</h2>
              <Button
                onClick={addPassenger}
                variant="outline"
                size="sm"
                className="border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm hành khách
              </Button>
            </div>

            <div className="space-y-6">
              {passengers.map((passenger, index) => (
                <div key={passenger.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Hành khách {index + 1}</h3>
                    {passengers.length > 1 && (
                      <Button
                        onClick={() => removePassenger(passenger.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Họ và tên *</Label>
                      <Input placeholder="Nguyễn Văn A" />
                    </div>
                    <div>
                      <Label>Ngày sinh *</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Giới tính *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voucher */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Mã giảm giá</h2>
            <div className="flex gap-2">
              <Input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="flex-1"
              />
              <Button
                onClick={applyVoucher}
                className="bg-[#2563eb] hover:bg-[#1d4ed8]"
              >
                Áp dụng
              </Button>
            </div>
            {discount > 0 && (
              <p className="text-sm text-green-600 mt-2">
                Áp dụng thành công! Giảm {discount.toLocaleString('vi-VN')}₫
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Mẹo: Thử mã "SUMMER2026" để được giảm giá
            </p>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>

            {/* Tour Summary */}
            <div className="mb-6">
              <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1668000018482-a02acf02b22a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxvbmclMjBiYXklMjB2aWV0bmFtfGVufDF8fHx8MTc3MjUxMDc2NHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Tour"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold mb-2">Tour Vịnh Hạ Long - Đảo Cát Bà 3N2Đ</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Ngày khởi hành: 15/06/2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Số khách: {numberOfPassengers} người</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Giá tour ({numberOfPassengers} người)</span>
                <span className="font-semibold">{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giảm giá</span>
                  <span className="text-green-600 font-semibold">-{discount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold">Thành tiền</span>
                <span className="text-2xl font-bold" style={{ color: '#2563eb' }}>
                  {finalPrice.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>

            <Link to={`/payment/${id}`}>
              <Button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] py-6 text-lg mb-4">
                Tiếp tục thanh toán
              </Button>
            </Link>

            <p className="text-xs text-gray-500 text-center">
              Bằng việc tiếp tục, bạn đồng ý với{" "}
              <Link to="/terms" className="text-[#2563eb] hover:underline">
                điều khoản sử dụng
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
