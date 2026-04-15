import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { EventDetailContext } from '../../../types/organizer.type';
import type { IVoucher, IVoucherHistory, VoucherFormData, DiscountType, VoucherStatus } from '../../../types/voucher.type';

/* ══════════════════════════════════════════
   EventVouchersPage — Trang "Voucher"
   
   Mockup ref: image6, image7, image8, image9
   - Table: tên, mã, mức giảm, thời gian, trạng thái, actions
   - Nút "Tạo voucher" → inline form
   - 3 actions: sửa, xem lịch sử (popup), xoá (confirm)
   ══════════════════════════════════════════ */

/* ── Mock data ── */
const MOCK_VOUCHERS: IVoucher[] = [
  {
    _id: 'v1',
    eventId: '1',
    code: 'EARLY20',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxUsage: 100,
    usedCount: 12,
    startDate: '2026-04-17T00:00:00Z',
    endDate: '2026-06-15T00:00:00Z',
    status: 'ACTIVE',
    createdAt: '2026-04-14T09:12:00Z',
    updatedAt: '2026-04-14T17:20:00Z',
  },
];

const MOCK_HISTORY: IVoucherHistory[] = [
  { _id: 'h1', voucherId: 'v1', action: 'CREATE', changes: {}, updatedBy: 'organizer@veritix.io', updatedAt: '2026-04-14T09:12:00Z' },
  { _id: 'h2', voucherId: 'v1', action: 'UPDATE', changes: { status: { old: 'DISABLED', new: 'ACTIVE' } }, updatedBy: 'organizer@veritix.io', updatedAt: '2026-04-14T17:20:00Z' },
];

/* ── Status config ── */
const STATUS_CFG: Record<VoucherStatus, { label: string; cls: string }> = {
  ACTIVE: { label: 'Hoạt động', cls: 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20' },
  EXPIRED: { label: 'Hết hạn', cls: 'text-slate-400 bg-slate-500/[0.08] border-slate-500/20' },
  DISABLED: { label: 'Vô hiệu', cls: 'text-rose-400 bg-rose-500/[0.08] border-rose-500/20' },
};

const inputCls = `
  w-full bg-[#080b14] border border-white/[0.1] rounded-xl
  px-4 py-3 text-sm text-slate-100
  placeholder:text-slate-700 outline-none
  focus:border-emerald-500/40 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)]
  transition-all hover:border-white/[0.15]
`;

/* ── History Modal ── */
const HistoryModal: React.FC<{
  open: boolean;
  onClose: () => void;
  history: IVoucherHistory[];
}> = ({ open, onClose, history }) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="
          bg-[#111827] border border-white/[0.08] rounded-2xl
          w-full max-w-lg shadow-[0_24px_64px_rgba(0,0,0,0.5)]
          animate-[vtx-fade_0.2s_ease]
        " onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-full bg-sky-500/[0.1] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" className="text-sky-400">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-white">Lịch sử cập nhật</h3>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[400px] overflow-y-auto">
            <div className="flex flex-col gap-5">
              {history.map((h, i) => (
                <div key={h._id} className="flex items-start gap-3">
                  <span className="
                    shrink-0 px-2.5 py-1 rounded-md
                    bg-slate-700/50 text-[11px] font-bold text-slate-400 font-mono
                  ">
                    v{history.length - i}.0
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-200">
                      {h.action === 'CREATE' ? 'Created voucher' : 'Updated status'}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {h.updatedBy} - {new Date(h.updatedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center px-6 py-4 border-t border-white/[0.06]">
            <button
              onClick={onClose}
              className="
                px-6 py-2.5 rounded-xl text-[13px] font-semibold
                bg-emerald-500 text-white hover:bg-emerald-400
                transition-all cursor-pointer
              "
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ── Delete Confirm Modal ── */
const DeleteConfirm: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voucherCode: string;
}> = ({ open, onClose, onConfirm, voucherCode }) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="
          bg-[#111827] border border-white/[0.08] rounded-2xl
          w-full max-w-sm shadow-[0_24px_64px_rgba(0,0,0,0.5)]
          animate-[vtx-fade_0.2s_ease] text-center
        " onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/[0.1] border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" className="text-rose-400">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-white mb-2">Xoá voucher?</h3>
            <p className="text-[13px] text-slate-500">
              Bạn có chắc muốn xoá voucher <span className="font-mono text-slate-300">{voucherCode}</span>?
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex gap-3 px-6 pb-6">
            <button onClick={onClose} className="
              flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium
              text-slate-400 border border-white/[0.08]
              hover:bg-white/[0.04] transition-colors cursor-pointer
            ">Hủy</button>
            <button onClick={onConfirm} className="
              flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold
              bg-rose-500 text-white hover:bg-rose-400
              transition-all cursor-pointer
            ">Xoá</button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════ */

export default function EventVouchersPage() {
  const { event } = useOutletContext<EventDetailContext>();
  const [vouchers, setVouchers] = useState<IVoucher[]>(MOCK_VOUCHERS);
  const [showForm, setShowForm] = useState(false);
  const [historyModal, setHistoryModal] = useState<{ open: boolean; data: IVoucherHistory[] }>({ open: false, data: [] });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; voucher: IVoucher | null }>({ open: false, voucher: null });

  // Form state
  const [form, setForm] = useState<VoucherFormData>({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    maxUsage: '',
    startDate: '',
    endDate: '',
  });

  if (!event) return null;

  const handleCreateVoucher = () => {
    // TODO: call API
    const newVoucher: IVoucher = {
      _id: Date.now().toString(),
      eventId: event._id,
      code: (form.code || '').toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue) || 0,
      maxUsage: Number(form.maxUsage) || 0,
      usedCount: 0,
      startDate: form.startDate,
      endDate: form.endDate,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setVouchers((prev) => [...prev, newVoucher]);
    setForm({ code: '', discountType: 'PERCENTAGE', discountValue: '', maxUsage: '', startDate: '', endDate: '' });
    setShowForm(false);
  };

  const handleDelete = () => {
    if (!deleteModal.voucher) return;
    setVouchers((prev) => prev.filter((v) => v._id !== deleteModal.voucher!._id));
    setDeleteModal({ open: false, voucher: null });
  };

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('vi-VN');

  return (
    <div className="max-w-[960px] animate-[vtx-fade_0.35s_ease]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Voucher</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-slate-500">
            {vouchers.length} / 5000
          </span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="
            flex items-center gap-2 px-4 py-2.5
            bg-emerald-500 hover:bg-emerald-400 text-white
            text-[13px] font-semibold rounded-xl transition-all cursor-pointer
            shadow-[0_2px_12px_rgba(16,185,129,0.25)]
          "
        >
          {showForm ? 'Đóng form' : 'Tạo voucher'}
        </button>
      </div>

      {/* ── Create Form (collapsible) ── */}
      {showForm && (
        <div className="
          bg-[#0d1117] border border-emerald-500/20 rounded-2xl p-5 mb-5
          animate-[vtx-fade_0.25s_ease]
        ">
          <h3 className="text-[14px] font-bold text-white mb-4">Tạo voucher mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">Mã voucher</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                placeholder="VD: EARLY20"
                maxLength={12}
                className={`${inputCls} font-mono uppercase`}
              />
              <p className="text-[10px] text-slate-700 mt-1">A-Z, 0-9, tối đa 12 ký tự</p>
            </div>
            <div>
              <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">Loại giảm giá</label>
              <div className="flex gap-2">
                {([['PERCENTAGE', '% Phần trăm'], ['FIXED', 'Ξ Cố định']] as const).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, discountType: type as DiscountType })}
                    className={`
                      flex-1 px-3 py-2.5 rounded-xl text-[12px] font-medium
                      border cursor-pointer transition-all
                      ${form.discountType === type
                        ? 'bg-emerald-500/[0.1] border-emerald-500/30 text-emerald-400'
                        : 'border-white/[0.08] text-slate-500 hover:text-slate-300'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">Mức giảm</label>
              <input
                type="number"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                placeholder={form.discountType === 'PERCENTAGE' ? '20' : '0.01'}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">Số lượt sử dụng tối đa</label>
              <input
                type="number"
                value={form.maxUsage}
                onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
                placeholder="100"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">Ngày bắt đầu</label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">Ngày kết thúc</label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleCreateVoucher}
              disabled={!form.code.trim()}
              className="
                px-5 py-2.5 rounded-xl text-[13px] font-semibold
                bg-emerald-500 text-white hover:bg-emerald-400
                transition-all cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Lưu voucher
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Mã voucher', 'Mức giảm', 'Đã dùng', 'Thời gian áp dụng', 'Trạng thái', ''].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => {
              const sCfg = STATUS_CFG[v.status];
              return (
                <tr key={v._id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-mono font-semibold text-slate-200">{v.code}</span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">
                    {v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : `Ξ ${v.discountValue}`}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">
                    {v.usedCount}/{v.maxUsage}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[12px] text-slate-500">
                      {fmtDate(v.startDate)} - {fmtDate(v.endDate)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold border ${sCfg.cls}`}>
                      {sCfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      {/* Edit */}
                      <button className="p-2 rounded-lg text-slate-600 hover:text-sky-400 hover:bg-sky-400/[0.06] transition-all cursor-pointer"
                        title="Sửa">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {/* History */}
                      <button
                        onClick={() => setHistoryModal({ open: true, data: MOCK_HISTORY })}
                        className="p-2 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-400/[0.06] transition-all cursor-pointer"
                        title="Lịch sử"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => setDeleteModal({ open: true, voucher: v })}
                        className="p-2 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-400/[0.06] transition-all cursor-pointer"
                        title="Xoá"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {vouchers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-slate-600">Chưa có voucher nào</p>
            <p className="text-[11px] text-slate-700 mt-1">Nhấn "Tạo voucher" để bắt đầu</p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <HistoryModal
        open={historyModal.open}
        onClose={() => setHistoryModal({ open: false, data: [] })}
        history={historyModal.data}
      />
      <DeleteConfirm
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, voucher: null })}
        onConfirm={handleDelete}
        voucherCode={deleteModal.voucher?.code || ''}
      />
    </div>
  );
}