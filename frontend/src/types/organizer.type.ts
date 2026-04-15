import type { EventStatus } from '../constants/event';

/* ══════════════════════════════════════════
   Organizer Types
   
   Tất cả types/interfaces phục vụ riêng cho module Organizer.
   Được map chính xác với backend models + API responses.
   ══════════════════════════════════════════ */

// ─────────────────────────────────────────
// ENTITY TYPES
// ─────────────────────────────────────────

/**
 * Event đầy đủ — map 1:1 với backend Event model (mongoose)
 *
 * Dùng khi: fetch chi tiết 1 event, edit event, trang EventDetail cấp 2
 * Backend: GET /api/events/:id
 */
export interface IEventFull {
  _id: string;
  blockchainId: number;
  organizerWallet: string;
  name: string;
  description: string;
  location: string;
  bannerUrl: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  price: string; // Lưu string tránh floating point (giống backend)
  maxSupply: number;
  currentMinted: number;
  maxResellPercentage: number; // default 110 (%)
  initialCapital: number;
  isOnChain: boolean;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Event hiển thị trong danh sách Organizer (card view)
 *
 * Dùng khi: MyEventsPage, OrganizerEventCard
 * Đây là subset của IEventFull + thêm field UI cần (category)
 *
 * LƯU Ý: Interface này trước đó nằm trong OrganizerEventCard.tsx.
 * Giờ move ra đây để các nơi khác import được mà không phụ thuộc component.
 */
export interface OrganizerEvent {
  _id: string;
  blockchainId: number;
  name: string;
  bannerUrl: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  currentMinted: number;
  maxSupply: number;
  price: string;
  category: string;
  location: string;
}

/**
 * Event summary trong dashboard API response
 *
 * Backend: GET /api/events/organizer/dashboard → events[]
 * Shape khác với OrganizerEvent vì backend chỉ trả subset fields
 */
export interface OrganizerEventSummary {
  _id: string;
  blockchainId: number;
  name: string;
  status: EventStatus;
  maxSupply: number;
  sold: number; // = currentMinted
  revenueETH: string; // dạng "0.1234"
  bannerUrl: string;
}

/**
 * Thành viên ban tổ chức (cho 1 event)
 *
 * Dùng khi: EventMembersPage, AddMemberModal
 * LƯU Ý: Backend chưa có API member → type này chuẩn bị sẵn
 */
export interface IOrganizerMember {
  _id: string;
  userId: string;
  walletAddress: string;
  name: string;
  role: 'owner' | 'admin' | 'staff';
  addedAt: string;
}

/**
 * Check-in record
 *
 * Dùng khi: EventCheckInPage, CheckInTable
 * Backend: POST /api/tickets/checkin (response đơn giản)
 * Phần list check-in cần backend bổ sung API
 */
export interface ICheckInRecord {
  ticketId: number; // blockchainTicketId
  ownerWallet: string;
  ownerName?: string;
  checkedInAt: string;
  checkedInBy: string;
}

// ─────────────────────────────────────────
// API REQUEST TYPES
// ─────────────────────────────────────────

/**
 * Payload gửi lên khi update event metadata
 * Backend: PUT /api/events/:id
 */
export interface UpdateEventPayload {
  description?: string;
  location?: string;
  bannerUrl?: string;
  startTime?: string;
  endTime?: string;
}

/**
 * Payload tạo event mới (gửi lên server sau khi blockchain confirm)
 *
 * LƯU Ý: Backend hiện chỉ có updateEventMetadata.
 * Event được tạo qua blockchain listener (blockchain.service.js).
 * Type này chuẩn bị sẵn cho khi backend thêm POST /api/events.
 */
export interface CreateEventPayload {
  blockchainId: number;
  name: string;
  description: string;
  location: string;
  bannerUrl: string;
  startTime: string;
  endTime: string;
  price: string;
  maxSupply: number;
  maxResellPercentage: number;
  category?: string;
  // Bank info (lưu off-chain)
  bankName?: string;
  bankAccount?: string;
  bankOwner?: string;
  bankBranch?: string;
}

/**
 * Payload thêm thành viên vào ban tổ chức
 * Chuẩn bị sẵn — backend chưa có API
 */
export interface AddMemberPayload {
  walletAddress: string;
  role: 'admin' | 'staff';
}

/**
 * Payload check-in vé
 * Backend: POST /api/tickets/checkin
 */
export interface CheckInPayload {
  blockchainTicketId: number;
  timestamp: number; // unix timestamp (seconds)
  signature: string; // chữ ký từ owner wallet
}

// ─────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────

/**
 * Dashboard statistics
 * Backend: GET /api/events/organizer/dashboard → summary
 */
export interface OrganizerDashboardStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenueETH: string; // dạng "0.1234"
}

/**
 * Dashboard full response
 * Backend: GET /api/events/organizer/dashboard
 */
export interface OrganizerDashboardResponse {
  summary: OrganizerDashboardStats;
  events: OrganizerEventSummary[];
}

/**
 * Update event response
 * Backend: PUT /api/events/:id
 */
export interface UpdateEventResponse {
  message: string;
  event: IEventFull;
}

/**
 * Check-in response
 * Backend: POST /api/tickets/checkin
 */
export interface CheckInResponse {
  message: string;
  ticketId: number;
}

// ─────────────────────────────────────────
// UI STATE TYPES
// ─────────────────────────────────────────

/**
 * Outlet context cho EventDetailLayout → pages con
 * Dùng trong: useOutletContext<EventDetailContext>()
 */
export interface EventDetailContext {
  event: IEventFull | null;
  loading: boolean;
  refetchEvent: () => void;
}
