interface PaymentDetailsProps {
  method: string;
  statusText: string;
  amount: number;
  statusCode: string;
}

export function PaymentDetails({ method, statusText, amount, statusCode }: PaymentDetailsProps) {
  const isPaid = statusCode === 'CONFIRMED' || statusCode === 'COMPLETED';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-black mb-6 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#2563eb] rounded-full"></div>
          Thông tin thanh toán
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
          <span className="text-gray-500 font-bold">Phương thức:</span>
          <span className="font-bold text-gray-900">{method}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
          <span className="text-gray-500 font-bold">Trạng thái:</span>
          <span className={`font-black ${isPaid ? 'text-green-600' : 'text-orange-500'}`}>
            {statusText}
          </span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="font-black text-gray-900 text-lg">Tổng tiền:</span>
          <span className="text-3xl font-black" style={{ color: '#2563eb' }}>
            {amount.toLocaleString('vi-VN')}₫
          </span>
        </div>
      </div>
    </div>
  );
}