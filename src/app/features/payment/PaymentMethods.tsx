import { Building2, Smartphone, CreditCard } from "lucide-react";

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  orderId: string; // Truyền vào để hiển thị nội dung chuyển khoản
}

export function PaymentMethods({ paymentMethod, setPaymentMethod, orderId }: PaymentMethodsProps) {
  return (
    <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-black text-gray-900 mb-6">Chọn phương thức</h2>
      <div className="space-y-4">
        {/* Chuyển khoản */}
        <label className="relative block cursor-pointer group">
          <input 
            type="radio" name="payment" value="bank" className="peer sr-only" 
            checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")}
          />
          <div className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-50 bg-gray-50 peer-checked:border-[#2563eb] peer-checked:bg-blue-50/50 transition-all">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400 peer-checked:text-[#2563eb]">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-black text-gray-900">Chuyển khoản ngân hàng</p>
              <p className="text-sm text-gray-500 font-medium tracking-tight">Vietcombank, Techcombank, v.v.</p>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-gray-200 peer-checked:border-[#2563eb] flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full bg-[#2563eb] transition-transform ${paymentMethod === "bank" ? "scale-100" : "scale-0"}`}></div>
            </div>
          </div>
          
          {paymentMethod === "bank" && (
            <div className="mt-2 p-6 bg-white border-2 border-dashed border-blue-200 rounded-2xl animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 gap-4 text-sm font-bold uppercase tracking-tighter">
                <div><p className="text-gray-400 mb-1">Số tài khoản</p><p className="text-gray-900 text-lg">098765432343567</p></div>
                <div><p className="text-gray-400 mb-1">Ngân hàng</p><p className="text-gray-900 text-lg">Vietcombank</p></div>
                <div className="col-span-2 pt-2 border-t border-gray-50">
                  <p className="text-gray-400 mb-1">Nội dung</p><p className="text-blue-600 text-lg">{orderId}</p>
                </div>
              </div>
            </div>
          )}
        </label>

        {/* Ví điện tử */}
        <label className="relative block cursor-pointer">
          <input 
            type="radio" name="payment" value="wallet" className="peer sr-only"
            checked={paymentMethod === "wallet"} onChange={() => setPaymentMethod("wallet")}
          />
          <div className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-50 bg-gray-50 peer-checked:border-[#2563eb] peer-checked:bg-blue-50/50 transition-all">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400 peer-checked:text-[#2563eb]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-black text-gray-900">Ví điện tử</p>
              <p className="text-sm text-gray-500 font-medium">VNPay</p>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-gray-200 peer-checked:border-[#2563eb] flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full bg-[#2563eb] transition-transform ${paymentMethod === "wallet" ? "scale-100" : "scale-0"}`}></div>
            </div>
          </div>
        </label>
      </div>
    </section>
  );
}