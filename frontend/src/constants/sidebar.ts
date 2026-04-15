import { ROUTES } from './routes';

// Cấp 1 — Sidebar chính Organizer
export const ORGANIZER_NAV_ITEMS = [
  {
    key: 'events',
    label: 'Sự kiện của tôi',
    icon: '◈', // hoặc dùng react-icons
    path: ROUTES.ORGANIZER_EVENTS,
  },
  {
    key: 'reports',
    label: 'Quản lý báo cáo',
    icon: '⊞',
    path: ROUTES.ORGANIZER_REPORTS,
  },
  {
    key: 'team',
    label: 'Điều hành ban tổ chức',
    icon: '≡',
    path: ROUTES.ORGANIZER_TEAM,
  },
] as const;

// Cấp 2 — Sidebar chi tiết sự kiện
export const EVENT_DETAIL_NAV = [
  {
    group: 'Báo cáo',
    items: [
      { key: 'summary', label: 'Tổng kết', path: 'summary' },
      { key: 'checkin', label: 'Check-in', path: 'checkin' },
    ],
  },
  {
    group: 'Cài đặt sự kiện',
    items: [
      { key: 'members', label: 'Thành viên', path: 'members' },
      { key: 'edit', label: 'Chỉnh sửa', path: 'edit' },
    ],
  },
  {
    group: 'Marketing',
    items: [{ key: 'vouchers', label: 'Voucher', path: 'vouchers' }],
  },
] as const;
