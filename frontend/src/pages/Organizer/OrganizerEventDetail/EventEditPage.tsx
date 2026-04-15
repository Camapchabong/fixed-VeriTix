import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateEvent } from '../../../services/organizer-event.service';
import { getErrorMessage } from '../../../services/api';
import type { EventDetailContext } from '../../../types/organizer.type';

/* ══════════════════════════════════════════
   EventEditPage — Trang "Chỉnh sửa"
   
   Cho phép organizer cập nhật metadata off-chain:
   - Mô tả, địa điểm, banner URL, thời gian
   
   Backend: PUT /api/events/:blockchainId
   ══════════════════════════════════════════ */

const inputCls = `
  w-full bg-[#080b14] border border-white/[0.1] rounded-xl
  px-4 py-3 text-sm text-slate-100
  placeholder:text-slate-700 outline-none
  focus:border-sky-500/40 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.1)]
  transition-all hover:border-white/[0.15]
`;

export default function EventEditPage() {
  const { event, refetchEvent } = useOutletContext<EventDetailContext>();
  const [saving, setSaving] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Init form with event data
  useEffect(() => {
    if (!event) return;
    setDescription(event.description || '');
    setLocation(event.location || '');
    setBannerUrl(event.bannerUrl || '');
    setStartTime(event.startTime ? event.startTime.slice(0, 16) : '');
    setEndTime(event.endTime ? event.endTime.slice(0, 16) : '');
  }, [event]);

  if (!event) return null;

  const handleSave = async () => {
    if (!event.blockchainId) return;
    setSaving(true);

    try {
      await updateEvent(event.blockchainId, {
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        bannerUrl: bannerUrl.trim() || undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
      });

      toast.success('Cập nhật sự kiện thành công!');
      refetchEvent();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[720px] animate-[vtx-fade_0.35s_ease]">
      <h2 className="text-lg font-bold text-white mb-5">Chỉnh sửa sự kiện</h2>

      {/* ── On-chain notice ── */}
      <div
        className="
        bg-amber-400/[0.04] border border-amber-400/[0.12] rounded-xl
        px-4 py-3 mb-6 flex items-start gap-3
      "
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-amber-400 shrink-0 mt-0.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-[12px] text-slate-500 leading-relaxed">
          <span className="font-semibold text-amber-400">Lưu ý:</span> Tên, giá vé, số lượng vé và
          phí bản quyền đã ghi trên blockchain — không thể thay đổi. Bạn chỉ có thể chỉnh sửa mô tả,
          địa điểm, ảnh và lịch trình.
        </p>
      </div>

      {/* ── Form ── */}
      <div className="flex flex-col gap-5">
        {/* Tên (readonly) */}
        <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5">
          <label className="text-[13px] font-medium text-slate-400 mb-2 block">
            Tên sự kiện
            <span className="text-[10px] text-slate-700 ml-2">(không thể chỉnh sửa)</span>
          </label>
          <div
            className="
            bg-[#080b14] border border-white/[0.06] rounded-xl
            px-4 py-3 text-sm text-slate-500 cursor-not-allowed
          "
          >
            {event.name}
          </div>
        </div>

        {/* Mô tả */}
        <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5">
          <label className="text-[13px] font-medium text-slate-400 mb-2 block">Mô tả sự kiện</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Mô tả sự kiện..."
            className={`${inputCls} resize-y min-h-[140px] leading-relaxed`}
          />
        </div>

        {/* Địa điểm */}
        <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5">
          <label className="text-[13px] font-medium text-slate-400 mb-2 block">Địa điểm</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="VD: GEM Center, TP. Hồ Chí Minh"
            className={inputCls}
          />
        </div>

        {/* Banner URL */}
        <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5">
          <label className="text-[13px] font-medium text-slate-400 mb-2 block">
            URL ảnh banner
          </label>
          <input
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://..."
            className={`${inputCls} font-mono text-[12px]`}
          />
          {bannerUrl && (
            <div className="mt-3 rounded-xl overflow-hidden border border-white/[0.06] h-32">
              <img
                src={bannerUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Thời gian */}
        <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5">
          <label className="text-[13px] font-medium text-slate-400 mb-3 block">
            Lịch trình sự kiện
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-slate-600 mb-1.5 block">Bắt đầu</span>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-600 mb-1.5 block">Kết thúc</span>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="
            flex items-center gap-2 px-6 py-3 rounded-xl
            text-[14px] font-semibold
            bg-sky-500 text-white cursor-pointer
            hover:bg-sky-400 transition-all
            shadow-[0_4px_16px_rgba(56,189,248,0.2)]
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {saving && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  );
}
