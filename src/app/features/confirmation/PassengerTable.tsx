interface PassengerTableProps {
  passengers: Array<{ name: string; birthDate: string; gender: string }>;
}

export function PassengerTable({ passengers }: PassengerTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
      <h2 className="text-xl font-black mb-6 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#2563eb] rounded-full"></div>
          Danh sách hành khách
      </h2>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-4 text-left font-bold text-gray-600 text-sm">STT</th>
              <th className="px-4 py-4 text-left font-bold text-gray-600 text-sm">Họ và tên</th>
              <th className="px-4 py-4 text-left font-bold text-gray-600 text-sm">Ngày sinh</th>
              <th className="px-4 py-4 text-left font-bold text-gray-600 text-sm">Giới tính</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {passengers.map((passenger, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4 text-gray-500 font-medium">{index + 1}</td>
                <td className="px-4 py-4 font-bold text-gray-900">{passenger.name}</td>
                <td className="px-4 py-4 text-gray-600 font-medium">{passenger.birthDate}</td>
                <td className="px-4 py-4 text-gray-600 font-medium">{passenger.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}