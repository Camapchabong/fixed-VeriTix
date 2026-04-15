/* ══════════════════════════════════════════
   Event Constants — Organizer Module
   ══════════════════════════════════════════ */

// ── Event Status ──

export type EventStatus = 'DRAFT' | 'ACTIVE' | 'ENDED' | 'CANCELLED';

export interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export const EVENT_STATUS_CONFIG: Record<EventStatus, StatusConfig> = {
  DRAFT: {
    label: 'Nháp',
    bg: 'bg-slate-500/[0.08]',
    text: 'text-slate-400',
    border: 'border-slate-500/20',
    dot: 'bg-slate-400',
  },
  ACTIVE: {
    label: 'Đang diễn ra',
    bg: 'bg-emerald-500/[0.08]',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400 animate-pulse',
  },
  ENDED: {
    label: 'Đã kết thúc',
    bg: 'bg-sky-500/[0.08]',
    text: 'text-sky-400',
    border: 'border-sky-500/20',
    dot: 'bg-sky-400',
  },
  CANCELLED: {
    label: 'Đã hủy',
    bg: 'bg-rose-500/[0.08]',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    dot: 'bg-rose-400',
  },
};

// ── Filter Tabs (MyEventsPage) ──

export type FilterTab = 'all' | 'upcoming' | 'past' | 'draft';

export interface FilterTabConfig {
  key: FilterTab;
  label: string;
}

export const FILTER_TABS: FilterTabConfig[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'upcoming', label: 'Sắp tới' },
  { key: 'past', label: 'Đã qua' },
  { key: 'draft', label: 'Nháp' },
];

// ── Category Emoji (OrganizerEventCard thumbnail fallback) ──

export const CATEGORY_EMOJI: Record<string, string> = {
  'Âm nhạc / Concert': '🎵',
  'Thể thao': '⚽',
  'Hội nghị / Hội thảo': '🎤',
  'Triển lãm': '🎨',
  'Gaming / E-sports': '🎮',
  'Nghệ thuật': '🎭',
  'Giáo dục / Workshop': '📚',
  'Cộng đồng / Meetup': '🤝',
  Khác: '✨',
};

// ── Card Gradients (OrganizerEventCard placeholder khi chưa có banner) ──

export const CARD_GRADIENTS: string[] = [
  'from-sky-600/40 to-blue-900/60',
  'from-emerald-600/40 to-teal-900/60',
  'from-violet-600/40 to-purple-900/60',
  'from-amber-600/40 to-orange-900/60',
  'from-rose-600/40 to-pink-900/60',
  'from-cyan-600/40 to-indigo-900/60',
];
