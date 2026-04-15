import React, { useMemo } from 'react';
import type { EventFormData } from './CreateEventSteps';
import { BANKS } from './CreateEventSteps';

type Props = {
  form: EventFormData;
  errors: Record<string, string>;
  set: (k: keyof EventFormData, v: string | number) => void;
  bannerFile: File | null;
  loading: boolean;
  statusMsg: string;
  onSubmit: () => void;
};

const inputCls = (err?: boolean) =>
  `w-full bg-[#080b14] border rounded-[10px] px-4 py-3 text-sm text-slate-100 outline-none
   transition-all duration-200 placeholder:text-slate-700
   focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]
   ${err ? 'border-rose-500' : 'border-white/10 hover:border-white/[0.18]'}`;

const Step3PaymentPublish: React.FC<Props> = ({
  form,
  errors,
  set,
  bannerFile,
  loading,
  statusMsg,
  onSubmit,
}) => {
  /* ── QR URL (VietQR standard) ── */
  const qrUrl = useMemo(() => {
    if (!form.bankName || !form.bankAccount) return '';
    const bankCode: Record<string, string> = {
      Vietcombank: 'VCB',
      Techcombank: 'TCB',
      'MB Bank': 'MB',
      VPBank: 'VPB',
      BIDV: 'BIDV',
      Agribank: 'VBA',
      ACB: 'ACB',
      Sacombank: 'STB',
      TPBank: 'TPB',
      VIB: 'VIB',
      HDBank: 'HDB',
      OCB: 'OCB',
    };
    const code = bankCode[form.bankName] || 'VCB';
    const desc = encodeURIComponent(form.paymentNote || `Thanh toan ve ${form.name}`);
    return `https://img.vietqr.io/image/${code}-${form.bankAccount}-compact2.png?addInfo=${desc}&accountName=${encodeURIComponent(form.bankOwner)}`;
  }, [form.bankName, form.bankAccount, form.bankOwner, form.paymentNote, form.name]);

  return (
    <div className="flex flex-col gap-3.5 animate-[vtx-fade_0.4s_ease]">
      {/* ═══ Thông tin thanh toán ═══ */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 pb-3.5 border-b border-white/[0.06] mb-5">
          🏦 Thông tin thanh toán ngân hàng
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: Form fields */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium text-slate-400 flex items-center gap-1 mb-2">
                  <span className="text-rose-500 text-sm">*</span> Ngân hàng
                </label>
                <div className="relative">
                  <select
                    value={form.bankName}
                    onChange={(e) => set('bankName', e.target.value)}
                    className={`${inputCls(!!errors.bankName)} cursor-pointer appearance-none pr-10`}
                  >
                    <option value="">Chọn ngân hàng</option>
                    {BANKS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-600" />
                </div>
                {errors.bankName && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.bankName}</p>
                )}
              </div>
              <div>
                <label className="text-[13px] font-medium text-slate-400 flex items-center gap-1 mb-2">
                  <span className="text-rose-500 text-sm">*</span> Số tài khoản
                </label>
                <input
                  type="text"
                  value={form.bankAccount}
                  onChange={(e) => set('bankAccount', e.target.value.replace(/\D/g, ''))}
                  placeholder="0123456789"
                  className={inputCls(!!errors.bankAccount)}
                />
                {errors.bankAccount && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.bankAccount}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium text-slate-400 flex items-center gap-1 mb-2">
                  <span className="text-rose-500 text-sm">*</span> Chủ tài khoản
                </label>
                <input
                  type="text"
                  value={form.bankOwner}
                  onChange={(e) => set('bankOwner', e.target.value.toUpperCase())}
                  placeholder="NGUYEN VAN A"
                  className={inputCls(!!errors.bankOwner)}
                />
                {errors.bankOwner && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.bankOwner}</p>
                )}
              </div>
              <div>
                <label className="text-[13px] font-medium text-slate-400 mb-2 block">
                  Chi nhánh
                </label>
                <input
                  type="text"
                  value={form.bankBranch}
                  onChange={(e) => set('bankBranch', e.target.value)}
                  placeholder="VD: Hội sở"
                  className={inputCls()}
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-medium text-slate-400 mb-2 block">
                Nội dung chuyển khoản mặc định
              </label>
              <input
                type="text"
                value={form.paymentNote}
                onChange={(e) => set('paymentNote', e.target.value)}
                placeholder={`Thanh toan ve ${form.name || 'su kien'}`}
                className={inputCls()}
              />
              <p className="text-[11px] text-slate-600 mt-1.5">
                Nội dung sẽ tự động điền khi người mua quét QR
              </p>
            </div>
          </div>

          {/* Right: QR Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full bg-gradient-to-b from-blue-500/[0.06] to-transparent border border-blue-500/[0.12] rounded-2xl p-5 flex flex-col items-center gap-3">
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-blue-400">
                Xem trước QR thanh toán
              </p>

              {qrUrl ? (
                <div className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-xl overflow-hidden bg-white p-2 shadow-[0_0_40px_rgba(59,130,246,0.12)]">
                  <img
                    src={qrUrl}
                    alt="QR Payment"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-center">
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#475569"
                    strokeWidth="1.2"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="3" height="3" />
                    <rect x="18" y="14" width="3" height="3" />
                    <rect x="14" y="18" width="3" height="3" />
                    <rect x="18" y="18" width="3" height="3" />
                  </svg>
                  <p className="text-xs text-slate-600">
                    Nhập thông tin ngân hàng
                    <br />
                    để xem QR
                  </p>
                </div>
              )}

              {form.bankName && form.bankAccount && (
                <div className="w-full text-center">
                  <p className="text-[13px] font-semibold text-slate-200">
                    {form.bankOwner || '---'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {form.bankName} · {form.bankAccount}
                  </p>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-600 text-center leading-relaxed px-2">
              Mã QR được tạo theo chuẩn VietQR.
              <br />
              Người mua vé quét để chuyển khoản trực tiếp.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Tóm tắt cấu hình ═══ */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 pb-3.5 border-b border-white/[0.06] mb-5">
          📊 Tóm tắt cấu hình
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { l: 'Giá vé', v: form.price ? `Ξ ${parseFloat(form.price).toFixed(4)}` : 'Miễn phí' },
            { l: 'Số vé', v: form.maxSupply ? parseInt(form.maxSupply).toLocaleString() : '—' },
            { l: 'Royalty', v: `${form.resaleRoyalty}%` },
            { l: 'Thể loại', v: form.category || '—' },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-white/[0.02] border border-white/[0.06] rounded-[10px] py-3.5 px-3 text-center"
            >
              <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-1.5">
                {s.l}
              </div>
              <div className="text-[15px] font-bold text-slate-100 truncate">{s.v}</div>
            </div>
          ))}
        </div>

        {/* Detail rows */}
        <div className="flex flex-col">
          {[
            ['Tên sự kiện', form.name || '—'],
            ['Địa điểm', form.locationType === 'online' ? 'Online' : form.venueName || '—'],
            [
              'Bán vé',
              `${form.saleStartDate || '—'} ${form.saleStartTime} → ${form.saleEndDate || '—'} ${form.saleEndTime}`,
            ],
            [
              'Sự kiện',
              `${form.eventStartDate || '—'} ${form.eventStartTime} → ${form.eventEndDate || '—'} ${form.eventEndTime}`,
            ],
            ['Ảnh nền', bannerFile ? bannerFile.name : 'Chưa upload'],
            ['Ngân hàng', form.bankName ? `${form.bankName} · ${form.bankAccount}` : 'Chưa nhập'],
            ['Ban tổ chức', form.orgName || '—'],
          ].map(([l, v]) => (
            <div
              key={l}
              className="flex justify-between items-center py-2.5 border-b border-white/[0.04] last:border-b-0"
            >
              <span className="text-[13px] text-slate-600">{l}</span>
              <span className="text-[13px] font-medium text-slate-400 text-right max-w-[60%] break-words">
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Status ═══ */}
      {statusMsg && (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-blue-500/20 bg-blue-500/[0.05] text-[13px] text-blue-300 animate-[vtx-fade_0.3s_ease]">
          {loading ? (
            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-current shrink-0" />
          )}
          <span>{statusMsg}</span>
        </div>
      )}

      {/* ═══ Warning ═══ */}
      <div className="bg-amber-400/[0.04] border border-amber-400/[0.12] rounded-xl px-4 py-3.5">
        <p className="text-xs font-semibold text-amber-400 mb-1">⚠ Lưu ý quan trọng</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          MetaMask sẽ yêu cầu xác nhận giao dịch on-chain. Sau khi blockchain xác nhận, ảnh, mô tả
          và thông tin thanh toán sẽ được đồng bộ lên server. Phí gas phụ thuộc vào mạng Ethereum.
        </p>
      </div>

      {/* ═══ Submit ═══ */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className={`
          w-full py-4 rounded-[14px] border-none text-[15px] font-bold tracking-wide
          transition-all duration-200 relative overflow-hidden
          ${
            loading
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-pointer shadow-[0_8px_32px_rgba(59,130,246,0.2)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:translate-y-0'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
            Đang xử lý trên Blockchain...
          </span>
        ) : (
          '🚀 Xác nhận phát hành sự kiện'
        )}
      </button>
      <p className="text-center text-[10px] text-slate-800 tracking-wider mt-1">
        Giao dịch yêu cầu xác nhận MetaMask · Gas fee theo mạng Ethereum
      </p>
    </div>
  );
};

export default Step3PaymentPublish;
