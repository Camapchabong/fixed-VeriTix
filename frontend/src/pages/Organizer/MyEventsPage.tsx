import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrganizerEventCard from '../../components/organizer/OrganizerEventCard';
import type { OrganizerEvent } from '../../components/organizer/OrganizerEventCard';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FILTER_TABS, type FilterTab } from '../../constants/event';
import { getOrganizerEvents } from '../../services/organizer-event.service';

/* ══════════════════════════════════════════════════════════════
   MyEventsPage — "Sự kiện của tôi"
   Trang chủ Organizer: overview stats + danh sách events
   ══════════════════════════════════════════════════════════════ */

// ── Stat card config ──
const STAT_CARDS = [
  {
    key: 'total',
    label: 'Tổng sự kiện',
    glow: 'from-sky-400/20 to-blue-500/20',
    iconColor: 'text-sky-400',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    key: 'active',
    label: 'Đang hoạt động',
    glow: 'from-emerald-400/20 to-green-500/20',
    iconColor: 'text-emerald-400',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    key: 'sold',
    label: 'Vé đã bán',
    glow: 'from-amber-400/20 to-orange-500/20',
    iconColor: 'text-amber-400',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1 3 3 3 3 0 0 1-3 3H5a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1-3-3z" />
      </svg>
    ),
  },
  {
    key: 'supply',
    label: 'Tổng cung vé',
    glow: 'from-violet-400/20 to-purple-500/20',
    iconColor: 'text-violet-400',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <rect x="1" y="1" width="9" height="9" rx="1.5" />
        <rect x="14" y="1" width="9" height="9" rx="1.5" />
        <rect x="1" y="14" width="9" height="9" rx="1.5" />
        <rect x="14" y="14" width="9" height="9" rx="1.5" />
      </svg>
    ),
  },
];

const PER_PAGE = 4;

export default function MyEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch events an toàn
  useEffect(() => {
    let isMounted = true; // Tránh lỗi memory leak khi unmount
    setLoading(true);

    getOrganizerEvents()
      .then((data) => {
        if (!isMounted) return;
        // Đảm bảo data luôn là mảng, phòng trường hợp API trả về null/undefined
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Lỗi khi tải danh sách sự kiện Organizer:', err);
        // Tạm thời set mảng rỗng để render ra giao diện Empty State
        setEvents([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ── Stats (Tính toán an toàn, có fallback) ──
  const stats = useMemo(
    () => ({
      total: events?.length || 0,
      active: (events || []).filter((e) => e?.status === 'ACTIVE').length,
      sold: (events || []).reduce((a, e) => a + (e?.currentMinted || 0), 0),
      supply: (events || []).reduce((a, e) => a + (e?.maxSupply || 0), 0),
    }),
    [events]
  );

  // ── Filter (An toàn hóa thuộc tính string) ──
  const filtered = useMemo(() => {
    let list = [...(events || [])];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          (e?.name || '').toLowerCase().includes(q) ||
          (e?.location || '').toLowerCase().includes(q) ||
          (e?.category || '').toLowerCase().includes(q)
      );
    }
    const now = new Date();
    if (activeFilter === 'upcoming')
      list = list.filter((e) => new Date(e?.startTime || 0) > now && e?.status === 'ACTIVE');
    if (activeFilter === 'past')
      list = list.filter((e) => e?.status === 'ENDED' || e?.status === 'CANCELLED');
    if (activeFilter === 'draft') list = list.filter((e) => e?.status === 'DRAFT');
    return list;
  }, [events, search, activeFilter]);

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  if (loading) return <LoadingSpinner text="Đang tải sự kiện..." />;

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* ── Page Title ── */}
      <div className="mb-6 md:mb-8" style={{ animation: 'fadeSlideUp 0.4s ease' }}>
        <h1 className="text-2xl md:text-[28px] font-extrabold text-white tracking-tight">
          Sự kiện của tôi
        </h1>
        <p className="text-[13px] text-slate-600 mt-1.5">
          Quản lý tất cả sự kiện bạn đã tạo trên VeriTix
        </p>
      </div>

      {/* ── Overview Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {STAT_CARDS.map((card, i) => (
          <div
            key={card.key}
            className="relative overflow-hidden bg-[#0d1117] border border-white/[0.06] rounded-xl p-4 transition-all duration-200 hover:border-white/[0.1]"
            style={{ animation: `fadeSlideUp 0.4s ease ${i * 60}ms both` }}
          >
            <div
              className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${card.glow} blur-2xl opacity-40`}
            />
            <div className="relative">
              <div className={`mb-2.5 ${card.iconColor} opacity-70`}>{card.icon}</div>
              <p className="text-xl md:text-2xl font-bold text-white font-mono">
                {(stats[card.key as keyof typeof stats] ?? 0).toLocaleString('vi-VN')}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-3 md:p-4 mb-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#080b14] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-700 outline-none transition-all focus:border-sky-500/40 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.08)] hover:border-white/[0.12]"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-[#080b14] rounded-xl p-1 border border-white/[0.06] shrink-0">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-lg text-[12px] md:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                activeFilter === tab.key
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_2px_8px_rgba(16,185,129,0.25)]'
                  : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Notice ── */}
      {activeFilter === 'all' && events.some((e) => e.status === 'DRAFT') && (
        <div
          className="bg-amber-500/[0.08] border border-amber-500/20 rounded-xl px-4 py-3 mb-5 flex items-start gap-3"
          style={{ animation: 'fadeSlideUp 0.4s ease 0.1s both' }}
        >
          <svg
            width="18"
            height="18"
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
          <p className="text-[13px] text-amber-300/80 leading-relaxed">
            <span className="font-semibold text-amber-300">Lưu ý:</span> Bạn có sự kiện đang ở trạng
            thái nháp. Để đảm bảo tính bảo mật, quyền truy cập vào trang chỉ dành cho chủ sở hữu và
            quản trị viên được ủy quyền.
          </p>
        </div>
      )}

      {/* ── Event Cards ── */}
      {paginated.length > 0 ? (
        <div className="flex flex-col gap-4">
          {paginated.map((event, i) => (
            <OrganizerEventCard key={event._id} event={event} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          title="Không tìm thấy sự kiện"
          description={
            search
              ? 'Thử tìm kiếm với từ khóa khác'
              : 'Bạn chưa có sự kiện nào. Hãy tạo sự kiện đầu tiên!'
          }
          action={
            !search ? (
              <button
                onClick={() => navigate('/organizer/events/create')}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_2px_12px_rgba(16,185,129,0.25)]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Tạo sự kiện mới
              </button>
            ) : undefined
          }
        />
      )}

      {/* ── Pagination ── */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* ── Footer ── */}
      <p className="text-center text-[10px] tracking-[0.18em] uppercase text-slate-800 mt-10 pb-4">
        Powered by Ethereum · ERC-721 NFT Ticketing
      </p>
    </div>
  );
}
