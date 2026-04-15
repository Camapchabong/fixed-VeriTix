import React, { useRef } from 'react';
import type { EventFormData } from './CreateEventSteps';
import { CATEGORIES, CITIES } from './CreateEventSteps';

type Props = {
  form: EventFormData;
  errors: Record<string, string>;
  set: (k: keyof EventFormData, v: string | number) => void;
  posterPreview: string;
  bannerPreview: string;
  logoPreview: string;
  onPoster: (f: File | null) => void;
  onBanner: (f: File | null) => void;
  onLogo: (f: File | null) => void;
};

/* ── Icons ── */
const CameraIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 2h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0019.07 5H21a2 2 0 012 2v13a2 2 0 01-2 2H3a2 2 0 01-2-2V7z"
    />
    <circle cx="12" cy="13" r="3" />
  </svg>
);
const ImageIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15l4-4 4 4 4-5 4 5" />
  </svg>
);

/* ── Upload Zone ── */
const UploadZone: React.FC<{
  preview: string;
  tall?: boolean;
  icon: React.ReactNode;
  label: string;
  size: string;
  onClick: () => void;
}> = ({ preview, tall, icon, label, size, onClick }) => (
  <div
    onClick={onClick}
    className={`
      border-[1.5px] border-dashed border-white/10 rounded-[14px]
      flex flex-col items-center justify-center cursor-pointer
      relative overflow-hidden gap-2 px-4 py-6 text-center
      transition-all duration-200
      hover:border-blue-500/40 hover:bg-blue-500/[0.04]
      ${tall ? 'min-h-[220px]' : 'min-h-[160px]'}
      ${preview ? 'bg-transparent' : 'bg-blue-500/[0.015]'}
    `}
  >
    {preview ? (
      <>
        <img
          src={preview}
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-[13px]"
        />
        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10">
          Đã chọn
        </div>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 z-[5]">
          <span className="bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-semibold text-white">
            Thay ảnh
          </span>
        </div>
      </>
    ) : (
      <>
        <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-blue-400">
          {icon}
        </div>
        <p className="text-[13px] font-medium text-slate-400">{label}</p>
        <small className="text-[11px] text-slate-600 font-mono">{size}</small>
      </>
    )}
  </div>
);

/* ══════════════════════════════════════════ */

const Step1EventInfo: React.FC<Props> = ({
  form,
  errors,
  set,
  posterPreview,
  bannerPreview,
  logoPreview,
  onPoster,
  onBanner,
  onLogo,
}) => {
  const posterRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const inputCls = (err?: boolean) =>
    `w-full bg-[#080b14] border rounded-[10px] px-4 py-3 text-sm text-slate-100 outline-none
     transition-all duration-200 placeholder:text-slate-700
     focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]
     ${err ? 'border-rose-500' : 'border-white/10 hover:border-white/[0.18]'}`;

  return (
    <div className="flex flex-col gap-3.5 animate-[vtx-fade_0.4s_ease]">
      {/* ── Upload ảnh ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7 transition-colors hover:border-white/[0.1]">
        <div className="flex justify-between items-center mb-5">
          <span className="text-[13px] font-medium text-slate-400 flex items-center gap-1">
            <span className="text-rose-500 text-sm">*</span> Upload hình ảnh
          </span>
          <span className="text-xs text-blue-500 cursor-pointer hover:text-blue-400 transition-colors">
            Xem vị trí hiển thị
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3.5">
          <UploadZone
            preview={posterPreview}
            tall
            icon={<CameraIcon />}
            label="Ảnh sự kiện"
            size="720 × 958"
            onClick={() => posterRef.current?.click()}
          />
          <UploadZone
            preview={bannerPreview}
            icon={<ImageIcon />}
            label="Ảnh nền sự kiện"
            size="1280 × 720"
            onClick={() => bannerRef.current?.click()}
          />
        </div>
        <input
          ref={posterRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onPoster(e.target.files?.[0] ?? null)}
        />
        <input
          ref={bannerRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onBanner(e.target.files?.[0] ?? null)}
        />
      </div>

      {/* ── Tên sự kiện ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <label className="text-[13px] font-medium text-slate-400 flex items-center gap-1 mb-2">
          <span className="text-rose-500 text-sm">*</span> Tên sự kiện
        </label>
        <div className="relative">
          <input
            type="text"
            maxLength={100}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="VD: Blockchain Summit Vietnam 2026"
            className={`${inputCls(!!errors.name)} pr-[70px]`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-700 font-mono pointer-events-none">
            {form.name.length}/100
          </span>
        </div>
        {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
      </div>

      {/* ── Thể loại ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <label className="text-[13px] font-medium text-slate-400 flex items-center gap-1 mb-2">
          <span className="text-rose-500 text-sm">*</span> Thể loại sự kiện
        </label>
        <div className="relative">
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className={`${inputCls(!!errors.category)} cursor-pointer appearance-none pr-10`}
          >
            <option value="">Vui lòng chọn</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-600" />
        </div>
        {errors.category && <p className="text-[11px] text-rose-500 mt-1">{errors.category}</p>}
      </div>

      {/* ── Địa chỉ ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 pb-3.5 border-b border-white/[0.06] mb-5">
          Địa chỉ sự kiện
        </div>
        <div className="flex gap-2 mb-5">
          {(['offline', 'online'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => set('locationType', m)}
              className={`
                px-5 py-2 rounded-[10px] text-[13px] font-medium cursor-pointer transition-all duration-200
                ${
                  form.locationType === m
                    ? 'bg-blue-500 border border-blue-500 text-white'
                    : 'bg-transparent border border-white/10 text-slate-600 hover:border-white/20 hover:text-slate-400'
                }
              `}
            >
              {m === 'offline' ? '🏢 Offline' : '🌐 Online'}
            </button>
          ))}
        </div>
        {form.locationType === 'offline' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-medium text-slate-400 flex items-center gap-1 mb-2">
                <span className="text-rose-500 text-sm">*</span> Tên địa điểm
              </label>
              <input
                type="text"
                maxLength={80}
                value={form.venueName}
                onChange={(e) => set('venueName', e.target.value)}
                placeholder="Ví dụ: Nhà hát Lớn Hà Nội"
                className={inputCls(!!errors.venueName)}
              />
              {errors.venueName && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.venueName}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[13px] font-medium text-slate-400 flex items-center gap-1 mb-2">
                  <span className="text-rose-500 text-sm">*</span> Tỉnh/Thành
                </label>
                <select
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  className={`${inputCls()} cursor-pointer appearance-none`}
                >
                  <option value="">Chọn tỉnh/thành</option>
                  {CITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-medium text-slate-400 mb-2 block">
                  Phường/Xã
                </label>
                <select
                  disabled={!form.city}
                  className={`${inputCls()} ${form.city ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'} appearance-none`}
                >
                  <option value="">Phường/Xã</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[13px] font-medium text-slate-400 flex items-center gap-1 mb-2">
                <span className="text-rose-500 text-sm">*</span> Số nhà, đường
              </label>
              <input
                type="text"
                maxLength={80}
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder="01 Tràng Tiền, Hoàn Kiếm"
                className={inputCls()}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Mô tả ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <label className="text-[13px] font-medium text-slate-400 flex items-center gap-1 mb-2">
          <span className="text-rose-500 text-sm">*</span> Thông tin sự kiện
        </label>
        <div
          className={`border rounded-[10px] overflow-hidden transition-all duration-200 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] ${errors.description ? 'border-rose-500' : 'border-white/10'}`}
        >
          <div className="flex flex-wrap gap-0.5 px-3 py-2 border-b border-white/[0.06] bg-white/[0.015]">
            {['B', 'I', 'U', '—', '≡', '⊞'].map((b) => (
              <button
                key={b}
                type="button"
                className={`w-[30px] h-[30px] rounded-md border-none bg-transparent text-slate-600 text-[13px] cursor-pointer flex items-center justify-center hover:bg-white/[0.05] hover:text-slate-300 transition-colors ${b === 'B' ? 'font-bold' : ''} ${b === 'I' ? 'italic' : ''} ${b === 'U' ? 'underline' : ''}`}
              >
                {b}
              </button>
            ))}
          </div>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={8}
            placeholder={`Giới thiệu sự kiện:\n[Tóm tắt ngắn gọn]\n\nChi tiết:\n• Chương trình chính: ...\n• Khách mời: ...\n\nĐiều khoản:\n[TnC sự kiện]`}
            className="w-full bg-[#080b14] border-none rounded-none px-4 py-3 text-sm text-slate-100 outline-none min-h-[180px] resize-y leading-relaxed placeholder:text-slate-700"
          />
        </div>
        {errors.description && (
          <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* ── Ban tổ chức ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 pb-3.5 border-b border-white/[0.06] mb-5">
          Thông tin ban tổ chức
        </div>
        <div className="flex gap-5 items-start flex-col md:flex-row">
          <div
            onClick={() => logoRef.current?.click()}
            className="w-24 h-24 min-w-[96px] border-[1.5px] border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden gap-1 transition-all hover:border-blue-500/40 hover:bg-blue-500/[0.04]"
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt=""
                className="absolute inset-0 w-full h-full object-cover rounded-[14px]"
              />
            ) : (
              <>
                <p className="text-[11px] font-medium text-slate-500">Logo</p>
                <small className="text-[10px] text-slate-700">275×275</small>
              </>
            )}
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onLogo(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="flex-1 flex flex-col gap-4 w-full">
            <div>
              <label className="text-[13px] font-medium text-slate-400 mb-2 block">
                Tên ban tổ chức
              </label>
              <input
                type="text"
                maxLength={80}
                value={form.orgName}
                onChange={(e) => set('orgName', e.target.value)}
                placeholder="Tên ban tổ chức"
                className={inputCls()}
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-slate-400 mb-2 block">
                Thông tin ban tổ chức
              </label>
              <div className="relative">
                <textarea
                  maxLength={500}
                  value={form.orgInfo}
                  onChange={(e) => set('orgInfo', e.target.value)}
                  rows={3}
                  placeholder="Mô tả ngắn..."
                  className={`${inputCls()} resize-y leading-relaxed pb-7`}
                />
                <span className="absolute right-3 bottom-2 text-[11px] text-slate-700 font-mono pointer-events-none">
                  {form.orgInfo.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1EventInfo;
