import { useState, useEffect } from "react";
import { 
  User, ShoppingBag, Heart, Settings, LogOut, 
  Calendar, CreditCard, MapPin, Phone, Mail, 
  Globe, Save, Edit3, X, Loader2, Shield, Star 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth/auth.service";
import { customerService } from "../services/customer/customer.service";
import { CustomerProfileResponse } from "../services/customer/customer.types";
import { toast } from "react-hot-toast";

export function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<CustomerProfileResponse | null>(null);

  // 1. 🚀 Khởi tạo: Lấy dữ liệu từ Backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await customerService.getMyProfile();
        setProfile(data);
      } catch (error) {
        toast.error("Không thể tải thông tin hồ sơ");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. 💾 Lưu thông tin (Chỉ gửi các trường được phép sửa)
  const handleSave = async () => {
    if (!profile) return;
    try {
      setLoading(true);
      const updateData = {
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address,
        nationality: profile.nationality,
        identityType: profile.identityType,
        identityNumber: profile.identityNumber
      };
      const updated = await customerService.updateMyProfile(updateData);
      setProfile(updated);
      setIsEditing(false);
      toast.success("Cập nhật thành công!");
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-bold">Đang tải hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* --- SIDEBAR --- */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-8 text-center border-b border-gray-50 bg-gradient-to-b from-blue-50/30 to-white">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl text-white">
                    <User size={36} />
                  </div>
                  {/* 🎯 Hiển thị Điểm thành viên (Loyalty Points) */}
                  <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-lg border-2 border-white shadow-sm flex items-center gap-1">
                    <Star size={10} fill="white" /> {profile?.loyaltyPoints || 0}
                  </div>
                </div>
                <h2 className="font-black text-gray-900 leading-tight">{profile?.fullName || "Khách hàng"}</h2>
                <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest uppercase">{profile?.email}</p>
              </div>

              <nav className="p-4 space-y-2">
                {[
                  { id: "info", icon: User, label: "Hồ sơ cá nhân" },
                  { id: "bookings", icon: ShoppingBag, label: "Đơn của tôi" },
                  { id: "wishlist", icon: Heart, label: "Tour yêu thích" },
                  { id: "settings", icon: Settings, label: "Cài đặt" },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsEditing(false); }}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                      activeTab === item.id 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                      : "text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-50">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm">
                    <LogOut size={18} /> Đăng xuất
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* 1. TAB: HỒ SƠ CÁ NHÂN */}
            {activeTab === "info" && profile && (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">Hồ sơ cá nhân</h2>
                    <p className="text-gray-400 font-medium text-sm mt-1 italic">Quản lý các thông tin định danh và liên hệ</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      isEditing ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {isEditing ? <><X size={14}/> Hủy</> : <><Edit3 size={14}/> Sửa hồ sơ</>}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Các trường input map với profile state */}
                  {[
                    { label: "Họ và tên", key: "fullName", icon: User },
                    { label: "Số điện thoại", key: "phone", icon: Phone },
                    { label: "Quốc tịch", key: "nationality", icon: Globe },
                    { label: "Số định danh", key: "identityNumber", icon: Shield },
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">{field.label}</label>
                      <div className="relative">
                        <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <input 
                          disabled={!isEditing}
                          value={(profile as any)[field.key] || ""}
                          onChange={e => setProfile({...profile, [field.key]: e.target.value})}
                          className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 font-bold text-gray-700 focus:bg-white focus:border-blue-200 outline-none transition-all disabled:opacity-70"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Loại giấy tờ (Select) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Loại giấy tờ</label>
                    <div className="relative">
                      <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <select 
                        disabled={!isEditing}
                        value={profile.identityType}
                        onChange={e => setProfile({...profile, identityType: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 font-bold text-gray-700 outline-none disabled:opacity-70 appearance-none"
                      >
                        <option value="CCCD">Căn cước công dân (CCCD)</option>
                        <option value="PASSPORT">Hộ chiếu (Passport)</option>
                      </select>
                    </div>
                  </div>

                  {/* Địa chỉ (Full width) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Địa chỉ thường trú</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input 
                        disabled={!isEditing}
                        value={profile.address}
                        onChange={e => setProfile({...profile, address: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 font-bold text-gray-700 focus:bg-white focus:border-blue-200 outline-none transition-all disabled:opacity-70"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="mt-12 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    LƯU THÔNG TIN CÁ NHÂN
                  </button>
                )}
              </div>
            )}

            {/* 2. TAB: ĐƠN HÀNG (Giữ nguyên giao diện đẹp của ông giáo) */}
            {activeTab === "bookings" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                <div className="bg-white py-20 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                  <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Lịch sử đơn hàng đang được cập nhật...</p>
                </div>
              </div>
            )}

            {/* 3. TAB: YÊU THÍCH */}
            {activeTab === "wishlist" && (
              <div className="bg-white py-20 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center animate-in fade-in slide-in-from-right-4 duration-500">
                <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Chưa có tour yêu thích nào.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}