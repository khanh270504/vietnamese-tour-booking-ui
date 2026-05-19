import { Voucher } from '../../services/voucher/voucher.types'; 
import { Tag, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

interface VoucherFormProps {
  voucherCode: string;
  setVoucherCode: (val: string) => void;
  removeVoucher: () => void;
  applyVoucher: (
    code?: string,
    tourId?: number | null
  ) => void;

  discount: number;
  isApplyingVoucher: boolean;
  availableVouchers: Voucher[];
  orderTotal: number;

  tourId?: number | null;
}


export function VoucherForm({
  voucherCode, setVoucherCode, applyVoucher, discount,
  isApplyingVoucher, availableVouchers, orderTotal, tourId, removeVoucher
}: VoucherFormProps) {
  
  return (
   <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-7">

  {/* Header */}
  <div className="flex items-center gap-3">
    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-100">
      <Tag className="text-white" size={20} />
    </div>

    <div>
      <h2 className="text-xl font-black tracking-tight text-gray-900">
        Voucher ưu đãi
      </h2>
      <p className="text-sm text-gray-500 font-medium">
        Tiết kiệm thêm cho chuyến đi của bạn
      </p>
    </div>
  </div>

  {/* Input */}
  <div className="relative">
    <input
      value={voucherCode}
      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
      placeholder="Nhập mã giảm giá..."
      className="
        w-full h-16 pl-6 pr-36
        rounded-2xl
        border-2 border-gray-100
        bg-gray-50
        focus:bg-white
        focus:border-blue-500
        outline-none
        transition-all
        font-bold
        uppercase
        text-gray-900
        placeholder:normal-case
        placeholder:text-gray-400
      "
    />

    <button
      onClick={() => applyVoucher(voucherCode, tourId)}
      
      disabled={isApplyingVoucher || !voucherCode.trim()}
      className="
        absolute right-2 top-2 bottom-2
        px-6
        rounded-xl
        bg-gradient-to-r from-blue-600 to-cyan-500
        text-white
        font-black
        shadow-lg shadow-blue-200
        hover:scale-[1.02]
        active:scale-95
        transition-all
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {isApplyingVoucher ? "Đang áp dụng..." : "Áp dụng"}
    </button>
  </div>

  {/* Voucher List */}
  {availableVouchers.length > 0 && (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <p className="text-xs font-black tracking-[0.2em] uppercase text-gray-400">
          Voucher khả dụng
        </p>

        <span className="text-xs font-bold text-blue-600">
          {availableVouchers.length} ưu đãi
        </span>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">

        {availableVouchers.map((v) => {
  const isEligible = orderTotal >= v.minOrderValue;
  // 🎯 Thêm logic này để nhận diện mã đang được chọn
  const isApplied = voucherCode.toUpperCase() === v.code.toUpperCase();

  return (
    <button
      key={v.id}
      type="button"
      // 🎯 Disable nếu không đủ điều kiện HOẶC nếu đang được áp dụng
      disabled={!isEligible || isApplied}
      onClick={() => applyVoucher(v.code, tourId)}
      className={`
        w-full text-left rounded-3xl border p-5 transition-all group relative overflow-hidden
        ${
          isApplied 
            ? "border-green-500 bg-green-50 shadow-inner" // 🎯 Style khi ĐANG ÁP DỤNG
            : isEligible 
              ? "border-blue-100 bg-gradient-to-r from-white to-blue-50/40 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1"
              : "border-gray-100 bg-gray-50 opacity-70 cursor-not-allowed"
        }
      `}
    >
      {/* Glow effect chỉ hiện nếu chưa áp dụng và hợp lệ */}
      {!isApplied && isEligible && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 blur-3xl rounded-full" />
      )}

      <div className="relative flex justify-between gap-4">
        <div className="flex gap-4">
          <div className={`
            w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
            ${isApplied ? "bg-green-500 text-white" : isEligible ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-100" : "bg-gray-200 text-gray-500"}
          `}>
            <Sparkles size={18} />
          </div>

          <div>
            <h4 className="font-black text-gray-900 text-base flex items-center gap-2">
              {v.code}
              {isApplied && <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full uppercase">Đang áp dụng</span>}
            </h4>

            <p className="text-sm text-gray-500 font-medium mt-1">{v.title}</p>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-black text-gray-700">
                Đơn tối thiểu {v.minOrderValue.toLocaleString()}₫
              </span>

              {!isApplied && !isEligible && (
                <span className="px-3 py-1 rounded-full bg-red-100 text-xs font-black text-red-500">
                  Thiếu {(v.minOrderValue - orderTotal).toLocaleString()}₫
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Discount */}
        <div className="shrink-0 text-right">
          <div className={`
            px-4 py-2 rounded-2xl font-black shadow-lg
            ${isApplied ? "bg-green-600 text-white" : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-100"}
          `}>
            {v.discountType === "FIXED" ? `-${v.discountValue.toLocaleString()}₫` : `-${v.discountValue}%`}
          </div>
        </div>
      </div>
    </button>
  );
})}
      </div>
    </div>
  )}

  {/* Success */}
  {discount > 0 && (
    <div className="
      rounded-3xl
      border border-green-100
      bg-gradient-to-r from-green-50 to-emerald-50
      p-5
      flex items-center justify-between
      shadow-sm
    ">

      <div className="flex items-center gap-4">

        <div className="
          w-12 h-12 rounded-2xl
          bg-gradient-to-br from-green-500 to-emerald-400
          flex items-center justify-center
          text-white
          shadow-lg shadow-green-100
        ">
          <CheckCircle2 size={22} />
        </div>

        <div>
          <p className="font-black text-green-900">
            Áp dụng voucher thành công
          </p>

          <p className="text-sm font-bold text-green-700 mt-1">
            Bạn đã tiết kiệm {(discount).toLocaleString()}₫
          </p>
        </div>
      </div>

      <button
        type="button" 
        onClick={() => removeVoucher()} 
        className="
          w-10 h-10 rounded-full
          hover:bg-red-50
          flex items-center justify-center
          text-gray-400 hover:text-red-500
          transition-all
        "
      >
        <X size={18} />
      </button>
    </div>
  )}
</section>
  );
}