import { Trash2, Plus } from "lucide-react";

export interface PassengerFormState {
  id: number; 
  name: string;
  birthDate: string;
  gender: string;
  passengerType: "ADULT" | "CHILD"; // Thêm dòng này cho khớp với hook
}

// 2. 🎯 Sửa lại Props: id truyền vào cũng phải là number
interface PassengerListProps {
  passengers: PassengerFormState[];
  addPassenger: () => void;
  removePassenger: (id: number) => void;
  updatePassenger: (id: number, field: keyof PassengerFormState, value: string) => void;
}

export function PassengerList({ 
  passengers, 
  addPassenger,     
  removePassenger,  
  updatePassenger   
}: PassengerListProps) {
  return (
    <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Danh sách hành khách
        </h2>
        <button
          onClick={addPassenger} 
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Thêm người
        </button>
      </div>

      <div className="space-y-4">
        {passengers.map((passenger, index) => (
          <div key={passenger.id} className="relative p-6 rounded-2xl bg-gray-50/50 border-2 border-gray-100 group">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Khách hàng #{index + 1}
              </span>
              {passengers.length > 1 && (
                <button 
                  onClick={() => removePassenger(passenger.id)} 
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input 
                value={passenger.name} 
                onChange={(e) => updatePassenger(passenger.id, "name", e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white outline-none focus:border-blue-500 font-medium" 
                placeholder="Họ tên hành khách" 
              />
              <input 
                type="date"
                value={passenger.birthDate}
                onChange={(e) => updatePassenger(passenger.id, "birthDate", e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white outline-none focus:border-blue-500 font-medium" 
              />
              <select 
                value={passenger.gender}
                onChange={(e) => updatePassenger(passenger.id, "gender", e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white outline-none focus:border-blue-500 font-medium appearance-none"
              >
                <option value="">Giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
              </select>

              <select 
                value={passenger.passengerType}
                onChange={(e) => updatePassenger(passenger.id, "passengerType", e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 bg-blue-50/50 outline-none focus:border-blue-500 font-bold text-blue-700 appearance-none"
              >
                <option value="ADULT">Người lớn</option>
                <option value="CHILD">Trẻ em</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}