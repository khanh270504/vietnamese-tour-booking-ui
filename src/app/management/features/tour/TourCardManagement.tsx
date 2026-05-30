import { MapPin, Edit3, Trash2, RotateCcw } from "lucide-react"; // 🎯 Thêm RotateCcw để làm nút khôi phục
import { TourResponse } from "../../../services/tour/tour.types";

interface TourCardProps {
  tour: TourResponse;
  onEdit: (tour: TourResponse) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void; // 🎯 Khai báo prop nhận từ component cha
}

const MINIO_BASE_URL = import.meta.env.VITE_MINIO_URL || "http://localhost:9000/tours";

export function TourCardManagement({ tour, onEdit, onDelete, onRestore }: TourCardProps) {
  const isInactive = String(tour.status).toUpperCase() === "INACTIVE";

  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm group transition-all hover:shadow-xl">
      <img
        src={`${MINIO_BASE_URL}/${tour.thumbnail}`}
        alt={tour.name}
        className="h-40 w-full object-cover rounded-2xl mb-4"
      />
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-black text-lg truncate pr-2">{tour.name}</h3>
        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] font-black">
          {tour.tourCode}
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
        <MapPin size={14} /> {tour.destinationName || "Chưa xác định"}
      </p>
      
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(tour)}
          className="p-3 bg-slate-100 rounded-xl hover:bg-blue-100 transition-colors text-slate-700 hover:text-blue-600"
          title="Chỉnh sửa thông tin Tour"
        >
          <Edit3 size={16} />
        </button>

        {isInactive ? (
          <button
            type="button"
            onClick={() => onRestore(tour.id)}
            className="flex items-center gap-1 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors font-black text-xs"
            title="Khôi phục lại Tour"
          >
            <RotateCcw size={16} /> Khôi phục
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onDelete(tour.id)}
            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
            title="Xóa mềm đưa vào kho lưu trữ"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}