import { useState, useEffect } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { tourService } from "./../../../services/tour/tour.service"; 
import { TourResponse, TourCreateRequest, DestinationResponse } from "./../../../services/tour/tour.types";

interface TourFormProps {
  tour: TourResponse | null;
  onClose: () => void;
  onSubmit: (id: number | undefined, data: TourCreateRequest) => Promise<boolean>;
}

export function TourForm({ tour, onClose, onSubmit }: TourFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<DestinationResponse[]>([]);
  
  const [formData, setFormData] = useState<TourCreateRequest>({
    name: tour?.name || "",
    tourCode: tour?.tourCode || "", 
    destinationId: 0,
    minParticipants: tour?.minParticipants || 1,
    thumbnail: tour?.thumbnail || "",
    description: tour?.description || "",
    itinerary: tour?.itinerary || [],
  });

  // 🎯 Gọi hàm getDestinations từ tourService để lấy danh sách điểm đến
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await tourService.getDestinations();
        // Ép chuẩn mảng dữ liệu trả về từ ApiResponse của sếp
        const destList: DestinationResponse[] = res.result || [];
        setDestinations(destList);

        // Map ID nếu là trạng thái EDIT (Giữ nguyên logic thông minh của sếp)
        if (tour && destList.length > 0) {
          const matchedDestination = destList.find(
            (d) => d.name === tour.destinationName
          );
          if (matchedDestination) {
            setFormData((prev) => ({ ...prev, destinationId: matchedDestination.id }));
          }
        }
      } catch (error) {
        toast.error("Không tải được danh sách điểm đến");
      }
    };
    fetchDestinations();
  }, [tour]);

  // 🎯 SỬA HÀM UPLOAD: Dùng tourService.uploadRawImage chuẩn chỉ, rũ bỏ hoàn toàn api thô
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      // Gọi qua service, nhận về chuỗi tên file từ MinIO
      const res = await tourService.uploadRawImage(file);
      const fileName = res.result; 
      
      // Nhét thẳng cái tên file này vào field thumbnail của Form
      setFormData((prev) => ({ ...prev, thumbnail: String(fileName) }));
      toast.success("Upload ảnh đại diện lên MinIO thành công!");
    } catch (error) {
      toast.error("Lỗi upload ảnh, sếp check lại tab Network nhé!");
    }
  };

  // Các hàm xử lý lịch trình (Itinerary) - Giữ nguyên logic của sếp
  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: "", content: "" }]
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => {
      const newItinerary = prev.itinerary.filter((_, i) => i !== index);
      const reindexed = newItinerary.map((item, i) => ({ ...item, day: i + 1 }));
      return { ...prev, itinerary: reindexed };
    });
  };

  const updateItineraryDay = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = { ...newItinerary[index], [field]: value };
      return { ...prev, itinerary: newItinerary };
    });
  };

  // 🎯 SỬA HÀM SUBMIT: Đảm bảo dữ liệu số (Number) chuẩn đét trước khi đẩy ra component cha onSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.destinationId === 0) {
      toast.error("Vui lòng chọn Điểm đến hợp lệ");
      return;
    }
    
    setIsSubmitting(true);

    const dataToSend: TourCreateRequest = {
      ...formData,
      destinationId: Number(formData.destinationId),
      minParticipants: Number(formData.minParticipants),
    };

    const success = await onSubmit(tour?.id, dataToSend);
    setIsSubmitting(false);
    if (success) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border space-y-4 max-w-2xl mx-auto shadow-xl animate-in fade-in zoom-in duration-200">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black">{tour ? "Sửa Tour" : "Thêm Tour Mới"}</h2>
        <button type="button" onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
          <X size={20} />
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-300">
        
        <div className="grid grid-cols-2 gap-4">
          <input required className="p-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 outline-none" placeholder="Tên Tour" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input required className="p-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 outline-none" placeholder="Mã Tour (Vd: T001)" value={formData.tourCode} onChange={(e) => setFormData({ ...formData, tourCode: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select required className="p-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 outline-none cursor-pointer" value={formData.destinationId} onChange={(e) => setFormData({ ...formData, destinationId: Number(e.target.value) })}>
            <option value={0} disabled>-- Chọn Điểm Đến --</option>
            {destinations.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <input type="number" min="1" required className="p-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 outline-none" placeholder="Số khách tối thiểu" value={formData.minParticipants} onChange={(e) => setFormData({ ...formData, minParticipants: Number(e.target.value) })} />
        </div>

        {/* KHU VỰC CHỌN ẢNH ĐẠI DIỆN (THUMBNAIL) - Luôn hiển thị chuẩn chỉ */}
        <div className="border-2 border-dashed border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-400 transition-colors bg-slate-50">
          <input type="file" onChange={handleUpload} id="fileInput" className="hidden" accept="image/*" />
          <label htmlFor="fileInput" className="cursor-pointer flex items-center gap-2 font-bold text-blue-600 w-full">
            <Upload size={18} /> 
            <span className="truncate">
              {formData.thumbnail ? `Ảnh hiện tại: ${formData.thumbnail}` : "Chọn ảnh đại diện cho tour..."}
            </span>
          </label>
        </div>

        <textarea className="w-full p-4 bg-slate-50 rounded-2xl font-bold h-24 focus:ring-2 outline-none resize-none" placeholder="Mô tả chi tiết" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

        {/* ITINERARY */}
        <div className="border-t pt-4 mt-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-700">Lịch trình chuyến đi (Itinerary)</h3>
            <button type="button" onClick={addItineraryDay} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 font-bold px-3 py-2 rounded-xl hover:bg-blue-100">
              <Plus size={16}/> Thêm Ngày
            </button>
          </div>

          {formData.itinerary.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-2">Chưa có lịch trình nào.</p>
          ) : (
            <div className="space-y-3">
              {formData.itinerary.map((item, index) => (
                <div key={index} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => removeItineraryDay(index)} className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex gap-3 mb-2 pr-12">
                    <span className="bg-slate-800 text-white font-black px-3 py-2 rounded-xl text-sm flex-shrink-0">
                      Ngày {item.day || index + 1}
                    </span>
                    <input required className="w-full p-2 bg-white rounded-xl font-bold focus:ring-2 outline-none border" placeholder="Tiêu đề ngày" value={item.title || ""} onChange={(e) => updateItineraryDay(index, 'title', e.target.value)} />
                  </div>
                  <textarea required className="w-full p-3 bg-white rounded-xl text-sm h-16 focus:ring-2 outline-none border resize-none" placeholder="Mô tả hoạt động..." value={item.content || ""} onChange={(e) => updateItineraryDay(index, 'content', e.target.value)} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <div className="pt-2">
        <button disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black mt-4 hover:bg-blue-700 disabled:opacity-50 transition-all">
          {isSubmitting ? "ĐANG LƯU..." : "LƯU DỮ LIỆU"}
        </button>
      </div>

    </form>
  );
}