import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { EVENT_DETAIL_NAV } from '../../constants/sidebar';

/* ══════════════════════════════════════════
   EventDetailSidebar — Sidebar cấp 2
   
   Hiển thị khi user vào chi tiết 1 event.
   Tham khảo mockup: image2.png → image6.png
   
   Cấu trúc:
   ┌─────────────────────┐
   │ ← Quản trị sự kiện  │  ← nút back
   │─────────────────────│
   │ Báo cáo             │  ← group heading
   │   ● Tổng kết        │
   │   ○ Check-in        │
   │─────────────────────│
   │ Cài đặt sự kiện     │
   │   ○ Thành viên      │
   │   ○ Chỉnh sửa      │
   │─────────────────────│
   │ Marketing           │
   │   ○ Voucher         │
   └─────────────────────┘
   ══════════════════════════════════════════ */

/* ── Icon mapping cho từng nav item ── */
const NAV_ICONS: Record<string, React.ReactNode> = {
  summary: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  ),
  checkin: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  members: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  edit: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  vouchers: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
      <path d="M2 8h20v4H2z" />
      <path d="M12 2v6" />
      <circle cx="12" cy="14" r="2" />
    </svg>
  ),
};

/* ── Group icon mapping ── */
const GROUP_ICONS: Record<string, React.ReactNode> = {
  'Báo cáo': (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  'Cài đặt sự kiện': (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  Marketing: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
};

/* ── Props ── */
type EventDetailSidebarProps = {
  eventId: string;
  eventName?: string;
};

const EventDetailSidebar: React.FC<EventDetailSidebarProps> = ({ eventId, eventName }) => {
  const navigate = useNavigate();
  const { eventId: paramId } = useParams();
  const basePath = `/organizer/events/${eventId || paramId}`;

  return (
    <aside
      className="
      w-[240px] shrink-0 min-h-full
      bg-[#0c1120] border-r border-white/[0.06]
      flex flex-col
    "
    >
      {/* ── Back Button ── */}
      <button
        onClick={() => navigate('/organizer/events')}
        className="
          flex items-center gap-2.5 px-5 py-4
          text-slate-300 hover:text-white
          border-b border-white/[0.06]
          transition-colors duration-150
          group cursor-pointer
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
          strokeLinejoin="round"
          className="text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span className="text-[13px] font-semibold tracking-wide">Quản trị sự kiện</span>
      </button>

      {/* ── Event Name Mini Display ── */}
      {eventName && (
        <div className="px-5 py-3 border-b border-white/[0.04]">
          <p className="text-[11px] text-slate-600 uppercase tracking-[0.1em] font-medium mb-1">
            Sự kiện
          </p>
          <p className="text-[13px] text-slate-300 font-semibold leading-snug line-clamp-2">
            {eventName}
          </p>
        </div>
      )}

      {/* ── Navigation Groups ── */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {EVENT_DETAIL_NAV.map((group, groupIdx) => (
          <div key={group.group} className={groupIdx > 0 ? 'mt-1' : ''}>
            {/* Group Heading */}
            <div className="flex items-center gap-2 px-5 pt-4 pb-2">
              <span className="text-slate-600">{GROUP_ICONS[group.group]}</span>
              <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-600">
                {group.group}
              </span>
            </div>

            {/* Group Items */}
            <div className="flex flex-col gap-0.5 px-2.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.key}
                  to={`${basePath}/${item.path}`}
                  className={({ isActive }) => `
                    relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-[13px] font-medium no-underline
                    transition-all duration-150
                    ${
                      isActive
                        ? 'text-emerald-400 bg-emerald-500/[0.08] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:rounded-r-full before:bg-emerald-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <span className="shrink-0 opacity-75">
                    {NAV_ICONS[item.key] || (
                      <span className="w-[18px] h-[18px] block rounded bg-slate-700/50" />
                    )}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer: Blockchain Badge ── */}
      <div className="px-5 py-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-2 text-[10px] text-slate-700">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="tracking-[0.08em] uppercase">On-chain verified</span>
        </div>
      </div>
    </aside>
  );
};

export default EventDetailSidebar;
