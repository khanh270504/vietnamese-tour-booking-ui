import React from 'react';

export interface ContactInfoState {
  fullName: string;
  phone: string;
  email: string;
}

interface ContactFormProps {
  contactInfo: ContactInfoState;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfoState>>;
}

export function ContactForm({ contactInfo, setContactInfo }: ContactFormProps) {
  return (
    <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
        Thông tin liên hệ
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Họ và tên *</label>
          <input 
            className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" 
            placeholder="Nguyễn Văn A" 
            value={contactInfo.fullName}
            onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Số điện thoại *</label>
          <input 
            className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" 
            placeholder="0912345678" 
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700">Email nhận vé *</label>
          <input 
            className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium" 
            type="email" 
            placeholder="example@email.com" 
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
          />
        </div>
      </div>
    </section>
  );
}