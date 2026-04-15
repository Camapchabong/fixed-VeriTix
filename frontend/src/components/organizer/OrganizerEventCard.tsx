import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EVENT_STATUS_CONFIG, CATEGORY_EMOJI, CARD_GRADIENTS } from '../../constants/event';
import type { OrganizerEvent } from '../../types/organizer.type';

// Re-export để các file cũ import từ đây vẫn hoạt động
export type { OrganizerEvent } from '../../types/organizer.type';

/* ── Utils ── */
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

/* ── QuickAction ── */
const QAction: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({
  icon,
  label,
  onClick,
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 hover:text-sky-400 hover:bg-sky-400/[0.06] transition-all group"
  >
    <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

/* ══════════════════════════════════════════ */
type Props = { event: OrganizerEvent; index: number };

const OrganizerEventCard: React.FC<Props> = ({ event, index }) => {
  const navigate = useNavigate();
  const st = EVENT_STATUS_CONFIG[event.status];
  const progress =
    event.maxSupply > 0 ? Math.round((event.currentMinted / event.maxSupply) * 100) : 0;
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  const goDetail = () => navigate(`/organizer/events/${event._id}/summary`);
  const goEdit = () => navigate(`/organizer/events/${event._id}/edit`);
  const goMembers = () => navigate(`/organizer/events/${event._id}/members`);

  return (
    <div
      className="group bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
      style={{ animation: `fadeSlideUp 0.4s ease ${index * 60}ms both` }}
    >
      {/* Top: Thumbnail + Info */}
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="relative sm:w-52 md:w-60 h-40 sm:h-auto shrink-0 overflow-hidden">
          {event.bannerUrl ? (
            <img src={event.bannerUrl} alt={event.name} className="w-full h-full object-cover" />
          ) : (
            <div
              className={`w-full h-full min-h-[140px] bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <span className="text-4xl opacity-60">{CATEGORY_EMOJI[event.category] || '✨'}</span>
            </div>
          )}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[10px] font-semibold text-white/80 border border-white/10">
            {event.category}
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-mono text-sky-300/80 border border-sky-400/10">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
            </svg>
            #{event.blockchainId}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-base md:text-lg font-bold text-slate-100 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                {event.name}
              </h3>
              <span
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${st.bg} ${st.text} ${st.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                {st.label}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <div className="flex items-center gap-2 text-slate-400">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="text-sky-400/60 shrink-0"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {fmtTime(event.startTime)}, {fmtDate(event.startTime)}
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="text-emerald-400/50 shrink-0"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>
          {/* Progress + Price */}
          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-500 font-medium">Vé đã bán</span>
                <span className="text-[11px] text-slate-400 font-semibold font-mono">
                  {event.currentMinted.toLocaleString('vi-VN')}
                  <span className="text-slate-600">
                    {' '}
                    / {event.maxSupply.toLocaleString('vi-VN')}
                  </span>
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${progress >= 90 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : progress >= 50 ? 'bg-gradient-to-r from-sky-500 to-cyan-400' : 'bg-gradient-to-r from-blue-500 to-blue-400'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-slate-600 mb-0.5">Giá vé</p>
              <p className="text-sm font-bold text-white font-mono">
                {event.price} <span className="text-[11px] text-slate-400 font-medium">ETH</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-white/[0.04] px-2 py-1 flex items-center justify-between">
        <div className="flex items-center gap-0.5 overflow-x-auto">
          <QAction
            onClick={goDetail}
            label="Tổng quan"
            icon={
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            }
          />
          <QAction
            onClick={goMembers}
            label="Thành viên"
            icon={
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            }
          />
          <QAction
            label="Đơn hàng"
            icon={
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            }
          />
          <QAction
            onClick={goEdit}
            label="Chỉnh sửa"
            icon={
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            }
          />
        </div>
        <button
          onClick={goDetail}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold text-sky-400 hover:text-sky-300 hover:bg-sky-400/[0.08] transition-all shrink-0"
        >
          Xem chi tiết
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OrganizerEventCard;
