import { useEffect, useState, useCallback } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import EventDetailSidebar from '../components/organizer-detail-event/EventDetailSidebar';
import { getEventById } from '../services/organizer-event.service';
import { EVENT_STATUS_CONFIG } from '../constants/event';
import type { IEventFull, EventDetailContext } from '../types/organizer.type';

/* ══════════════════════════════════════════
   OrganizerEventDetailLayout — Cấp 2 (Nested)
   
   Layout này nằm BÊN TRONG OrganizerLayout.
   Khi user vào /organizer/events/:eventId/*
   
   Cấu trúc:
   ┌──────────────────────────────────────────────┐
   │  OrganizerLayout (sidebar cấp 1 + header)    │
   │  ┌────────────┬─────────────────────────────┐ │
   │  │ EventDetail │  Event Header (name, date) │ │
   │  │ Sidebar     │  ─────────────────────────── │
   │  │ (cấp 2)    │  <Outlet /> (page content)  │ │
   │  └────────────┴─────────────────────────────┘ │
   └──────────────────────────────────────────────┘
   
   Fetch event data 1 lần → share cho tất cả page con qua Outlet context.
   Page con dùng: const { event } = useOutletContext<EventDetailContext>();
   ══════════════════════════════════════════ */

/* ── Date formatter ── */
const fmtDateTime = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return (
    d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }) +
    ' - ' +
    d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
};

export default function OrganizerEventDetailLayout() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<IEventFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch event ──
  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);

    const data = await getEventById(eventId);
    if (data) {
      setEvent(data);
    } else {
      setError('Không tìm thấy sự kiện');
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  // ── Outlet context: share event data + refetch function cho page con ──
  const outletContext: EventDetailContext = {
    event,
    loading,
    refetchEvent: fetchEvent,
  };

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3">
        <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-500">Đang tải sự kiện...</span>
      </div>
    );
  }

  // ── Error State ──
  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/[0.08] border border-rose-500/20 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="text-rose-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-sm text-slate-400">{error || 'Không tìm thấy sự kiện'}</p>
        <button
          onClick={fetchEvent}
          className="
            px-4 py-2 text-[13px] font-medium text-emerald-400
            border border-emerald-500/20 rounded-lg
            hover:bg-emerald-500/[0.06] transition-colors cursor-pointer
          "
        >
          Thử lại
        </button>
      </div>
    );
  }

  // ── Status badge ──
  const statusCfg = EVENT_STATUS_CONFIG[event.status];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* ── Sidebar cấp 2 ── */}
      <EventDetailSidebar eventId={eventId!} eventName={event.name} />

      {/* ── Content Area ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* ── Event Header Bar ── */}
        <div
          className="
          px-6 py-4 border-b border-white/[0.06]
          bg-[#0a0e1a]/60 backdrop-blur-sm
        "
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left: event name + meta */}
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-lg font-bold text-white truncate">{event.name}</h1>
                {/* Status Badge */}
                <span
                  className={`
                  shrink-0 flex items-center gap-1.5 px-2.5 py-0.5
                  rounded-full text-[11px] font-semibold border
                  ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}
                `}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                  {statusCfg.label}
                </span>
              </div>

              {/* Meta row: date + blockchain ID */}
              <div className="flex items-center gap-4 text-[12px]">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    className="text-slate-600"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {fmtDateTime(event.startTime)}
                </span>

                {event.blockchainId && (
                  <span
                    className="
                    flex items-center gap-1 px-2 py-0.5
                    rounded bg-sky-400/[0.06] border border-sky-400/10
                    text-[10px] font-mono text-sky-400/70
                  "
                  >
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
                  </span>
                )}
              </div>
            </div>

            {/* Right: Quick stats */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Tickets sold mini stat */}
              <div
                className="
                hidden sm:flex flex-col items-center
                px-3.5 py-2 rounded-xl
                bg-white/[0.02] border border-white/[0.06]
              "
              >
                <span className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">
                  Vé bán
                </span>
                <span className="text-sm font-bold text-white font-mono">
                  {event.currentMinted}
                  <span className="text-slate-600 font-normal">/{event.maxSupply}</span>
                </span>
              </div>

              {/* Price mini stat */}
              <div
                className="
                hidden sm:flex flex-col items-center
                px-3.5 py-2 rounded-xl
                bg-white/[0.02] border border-white/[0.06]
              "
              >
                <span className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">
                  Giá vé
                </span>
                <span className="text-sm font-bold text-white font-mono">Ξ {event.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Page Content (Outlet) ── */}
        <div className="flex-1 px-6 py-5">
          <Outlet context={outletContext} />
        </div>
      </div>
    </div>
  );
}
