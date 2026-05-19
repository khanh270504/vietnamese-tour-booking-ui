interface PaymentSummaryProps {
  orderInfo: {
    orderId: string;
    tourName: string;
    totalAmount: number;
  };
}

export function PaymentSummary({ orderInfo }: PaymentSummaryProps) {
  return (
    <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-2 h-8 bg-[#2563eb] rounded-full"></div>
        Thông tin chuyến đi
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 font-bold">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Mã tour</p>
          <p className="text-gray-900">{orderInfo.orderId}</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest pt-2">Tên tour</p>
          <p className="text-gray-900 leading-tight">{orderInfo.tourName}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-6 flex flex-col justify-between border border-blue-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-blue-600">Tổng cộng</span>
            <span className="text-2xl font-black text-[#2563eb]">
              {orderInfo.totalAmount.toLocaleString('vi-VN')}₫
            </span>
          </div>
          <div className="text-xs text-blue-400 font-bold mt-4 italic">
            * Giá đã bao gồm thuế và phí dịch vụ
          </div>
        </div>
      </div>
    </section>
  );
}