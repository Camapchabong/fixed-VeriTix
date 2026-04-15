import React from 'react';

/* ══════════════════════════════════════════
   Types & Config cho Create Event Wizard
   ══════════════════════════════════════════ */

export type EventFormData = {
  name: string;
  category: string;
  locationType: 'offline' | 'online';
  venueName: string;
  city: string;
  ward: string;
  address: string;
  description: string;
  orgName: string;
  orgInfo: string;
  price: string;
  maxSupply: string;
  resaleRoyalty: number;
  saleStartDate: string;
  saleStartTime: string;
  saleEndDate: string;
  saleEndTime: string;
  eventStartDate: string;
  eventStartTime: string;
  eventEndDate: string;
  eventEndTime: string;
  earlyBirdPrice: string;
  earlyBirdQty: string;
  vipPrice: string;
  vipQty: string;
  bankName: string;
  bankAccount: string;
  bankOwner: string;
  bankBranch: string;
  paymentNote: string;
};

export const STEPS = [
  { id: 1, label: 'Thông tin sự kiện' },
  { id: 2, label: 'Cấu hình vé & Lịch trình' },
  { id: 3, label: 'Thanh toán & Phát hành' },
];

export const CATEGORIES = [
  'Âm nhạc / Concert',
  'Thể thao',
  'Hội nghị / Hội thảo',
  'Triển lãm',
  'Gaming / E-sports',
  'Nghệ thuật',
  'Giáo dục / Workshop',
  'Cộng đồng / Meetup',
  'Khác',
];

export const CITIES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Cần Thơ',
  'Đà Lạt',
  'Nha Trang',
  'Huế',
  'Hải Phòng',
  'Đắk Lắk',
];

export const BANKS = [
  'Vietcombank',
  'Techcombank',
  'MB Bank',
  'VPBank',
  'BIDV',
  'Agribank',
  'ACB',
  'Sacombank',
  'TPBank',
  'VIB',
  'HDBank',
  'OCB',
  'Khác',
];

/* ══════════════════════════════════════════
   StepIndicator
   ══════════════════════════════════════════ */

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

type StepIndicatorProps = {
  currentStep: number;
  onStepClick: (step: number) => void;
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => (
  <div className="flex items-center gap-0 bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-4 py-3.5 md:px-7 md:py-4 overflow-x-auto mb-5 md:mb-8">
    {STEPS.map((s, i) => {
      const done = currentStep > s.id;
      const active = currentStep === s.id;
      return (
        <div key={s.id} className="contents">
          <div
            onClick={() => done && onStepClick(s.id)}
            className={`flex items-center gap-1.5 md:gap-2.5 shrink-0 py-1 ${done ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                transition-all duration-300
                ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                      ? 'bg-blue-500 text-white border-2 border-blue-400/40 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                      : 'bg-white/[0.05] text-slate-600 border-2 border-transparent'
                }
              `}
            >
              {done ? <CheckIcon /> : s.id}
            </div>
            <span
              className={`
                text-[11px] md:text-[13px] whitespace-nowrap
                ${active ? 'font-semibold text-slate-100' : done ? 'font-normal text-emerald-500' : 'font-normal text-slate-600'}
              `}
            >
              <span className="hidden md:inline">{s.label}</span>
              <span className="md:hidden">Bước {s.id}</span>
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`
                flex-1 h-px min-w-3 md:min-w-8 mx-2 md:mx-2.5 transition-colors duration-300
                ${done ? 'bg-emerald-500' : 'bg-white/[0.06]'}
              `}
            />
          )}
        </div>
      );
    })}
  </div>
);

export default StepIndicator;
