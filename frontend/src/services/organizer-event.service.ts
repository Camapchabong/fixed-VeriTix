import api, { getErrorMessage } from './api';
import type {
  OrganizerEvent,
  IEventFull,
  OrganizerDashboardResponse,
  UpdateEventPayload,
  UpdateEventResponse,
} from '../types/organizer.type';
import type { EventStatus } from '../constants/event';

/* ══════════════════════════════════════════
   Organizer Event Service
   
   Gọi API thật khi backend sẵn sàng.
   Fallback sang mock data khi API fail (dev mode).
   
   Backend endpoints:
   - GET  /api/events/organizer/dashboard  → OrganizerDashboardResponse
   - GET  /api/events/:id                  → IEventFull (param = blockchainId)
   - PUT  /api/events/:id                  → UpdateEventResponse
   ══════════════════════════════════════════ */

// ── Flag: bật mock khi backend chưa chạy ──
// Đổi thành false khi backend đã sẵn sàng
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// ─────────────────────────────────────────
// MOCK DATA (giữ lại cho development)
// ─────────────────────────────────────────

const MOCK_EVENTS: OrganizerEvent[] = [
  {
    _id: '1',
    blockchainId: 1001,
    name: 'Blockchain Summit Vietnam 2026',
    bannerUrl: '',
    startTime: '2026-06-15T18:00:00Z',
    endTime: '2026-06-15T22:00:00Z',
    status: 'ACTIVE',
    currentMinted: 342,
    maxSupply: 500,
    price: '0.05',
    category: 'Hội nghị / Hội thảo',
    location: 'GEM Center, TP. Hồ Chí Minh',
  },
  {
    _id: '2',
    blockchainId: 1002,
    name: 'Rap Việt All-Star Concert',
    bannerUrl: '',
    startTime: '2026-07-20T19:00:00Z',
    endTime: '2026-07-20T23:00:00Z',
    status: 'DRAFT',
    currentMinted: 0,
    maxSupply: 2000,
    price: '0.08',
    category: 'Âm nhạc / Concert',
    location: 'Phú Thọ Indoor, TP. Hồ Chí Minh',
  },
  {
    _id: '3',
    blockchainId: 1003,
    name: 'Vietnam Web3 Hackathon',
    bannerUrl: '',
    startTime: '2026-05-10T08:00:00Z',
    endTime: '2026-05-12T18:00:00Z',
    status: 'ENDED',
    currentMinted: 150,
    maxSupply: 150,
    price: '0.02',
    category: 'Gaming / E-sports',
    location: 'Online',
  },
  {
    _id: '4',
    blockchainId: 1004,
    name: 'Triển Lãm Nghệ Thuật Số - Digital Art Vietnam',
    bannerUrl: '',
    startTime: '2026-08-01T10:00:00Z',
    endTime: '2026-08-05T20:00:00Z',
    status: 'ACTIVE',
    currentMinted: 89,
    maxSupply: 300,
    price: '0.03',
    category: 'Triển lãm',
    location: 'Bảo tàng Mỹ thuật, Hà Nội',
  },
  {
    _id: '5',
    blockchainId: 1005,
    name: 'Stand-Up Comedy Night Saigon',
    bannerUrl: '',
    startTime: '2026-09-12T20:00:00Z',
    endTime: '2026-09-12T22:30:00Z',
    status: 'ACTIVE',
    currentMinted: 45,
    maxSupply: 120,
    price: '0.015',
    category: 'Nghệ thuật',
    location: 'Saigon Outcast, Quận 2',
  },
  {
    _id: '6',
    blockchainId: 1006,
    name: 'VBA Basketball Finals 2026',
    bannerUrl: '',
    startTime: '2026-04-05T18:30:00Z',
    endTime: '2026-04-05T21:00:00Z',
    status: 'ENDED',
    currentMinted: 780,
    maxSupply: 1000,
    price: '0.04',
    category: 'Thể thao',
    location: 'CIS Arena, TP. Hồ Chí Minh',
  },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─────────────────────────────────────────
// MAPPER: Backend IEventFull → OrganizerEvent
// ─────────────────────────────────────────

/**
 * Backend Event model không có field `category`.
 * Tạm map từ IEventFull → OrganizerEvent, gán category = 'Khác'.
 *
 * Khi backend thêm field category vào Event model → bỏ default.
 */
function mapFullEventToOrganizerEvent(event: IEventFull): OrganizerEvent {
  return {
    _id: event._id,
    blockchainId: event.blockchainId,
    name: event.name,
    bannerUrl: event.bannerUrl,
    startTime: event.startTime,
    endTime: event.endTime,
    status: event.status,
    currentMinted: event.currentMinted,
    maxSupply: event.maxSupply,
    price: event.price,
    category: (event as IEventFull & { category?: string }).category || 'Khác',
    location: event.location,
  };
}

// ─────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────

/**
 * Lấy danh sách events của organizer hiện tại.
 *
 * Gọi bởi: MyEventsPage
 * Return: OrganizerEvent[] — shape mà OrganizerEventCard cần
 *
 * Flow:
 * 1. Gọi GET /api/events/organizer/dashboard (cần auth token)
 * 2. Dashboard trả IEventFull[] (toàn bộ events của organizer)
 * 3. Map sang OrganizerEvent[] cho UI
 *
 * Fallback: mock data khi API fail hoặc USE_MOCK = true
 */
export async function getOrganizerEvents(): Promise<OrganizerEvent[]> {
  if (USE_MOCK) {
    await delay(400);
    return MOCK_EVENTS;
  }

  try {
    // Dashboard API trả { summary, events } nhưng events chỉ là summary shape.
    // Nên ta gọi thêm endpoint khác nếu cần full fields.
    //
    // Chiến lược: Gọi dashboard → nếu backend trả đủ fields thì dùng,
    // nếu không thì fallback gọi GET /api/events rồi filter client-side.
    const { data } = await api.get<OrganizerDashboardResponse>('/events/organizer/dashboard');

    // Dashboard trả OrganizerEventSummary[] (ít fields).
    // MyEventsPage cần OrganizerEvent (nhiều fields hơn: startTime, location, category, price).
    // → Cần fetch full events. Gọi lần 2 lấy tất cả events rồi filter.
    //
    // TODO: Khi backend thêm GET /api/events/organizer/my-events → gọi trực tiếp.
    const allEventsRes = await api.get<IEventFull[]>('/events');
    const organizerWallet = data.events.map((e) => e._id);

    // Filter: chỉ lấy events mà dashboard đã trả (đảm bảo đúng organizer)
    const dashboardIds = new Set(data.events.map((e) => e._id));
    const myEvents = allEventsRes.data.filter((e) => dashboardIds.has(e._id));

    return myEvents.map(mapFullEventToOrganizerEvent);
  } catch (error) {
    console.warn(
      '[organizer-event.service] API failed, falling back to mock:',
      getErrorMessage(error)
    );
    // Fallback mock khi backend chưa chạy
    await delay(300);
    return MOCK_EVENTS;
  }
}

/**
 * Lấy chi tiết 1 event theo _id (MongoDB ObjectId).
 *
 * Gọi bởi: EventDetailLayout (cấp 2)
 * Return: IEventFull | null
 *
 * LƯU Ý: Backend GET /api/events/:id dùng blockchainId làm param,
 * KHÔNG phải MongoDB _id. Nên khi gọi từ EventDetailLayout (dùng _id từ URL),
 * ta cần xử lý:
 *
 * - Nếu param là số → gọi thẳng /api/events/:blockchainId
 * - Nếu param là ObjectId string → cần backend thêm route, hoặc
 *   tìm trong danh sách đã cache.
 *
 * Tạm thời: thử gọi với param trực tiếp. Backend sẽ findOne({ blockchainId: id }).
 * Nếu fail → thử gọi mock.
 */
export async function getEventById(id: string): Promise<IEventFull | null> {
  if (USE_MOCK) {
    await delay(200);
    const mock = MOCK_EVENTS.find((e) => e._id === id);
    if (!mock) return null;
    // Convert OrganizerEvent mock → IEventFull shape
    return {
      _id: mock._id,
      blockchainId: mock.blockchainId,
      organizerWallet: '',
      name: mock.name,
      description: '',
      location: mock.location,
      bannerUrl: mock.bannerUrl,
      startTime: mock.startTime,
      endTime: mock.endTime,
      price: mock.price,
      maxSupply: mock.maxSupply,
      currentMinted: mock.currentMinted,
      maxResellPercentage: 110,
      initialCapital: 0,
      isOnChain: true,
      status: mock.status,
      createdAt: mock.startTime,
      updatedAt: mock.startTime,
    };
  }

  try {
    const { data } = await api.get<IEventFull>(`/events/${id}`);
    return data;
  } catch (error) {
    console.error('[organizer-event.service] getEventById failed:', getErrorMessage(error));
    return null;
  }
}

/**
 * Cập nhật metadata của event.
 *
 * Gọi bởi: EventEditPage
 * Backend: PUT /api/events/:id (blockchainId)
 *
 * Chỉ organizer sở hữu event mới được update.
 * Backend tự check organizerWallet === req.user.walletAddress.
 */
export async function updateEvent(
  blockchainId: number,
  payload: UpdateEventPayload
): Promise<UpdateEventResponse> {
  const { data } = await api.put<UpdateEventResponse>(`/events/${blockchainId}`, payload);
  return data;
}

/**
 * Lấy dashboard stats (tổng event, tổng vé bán, doanh thu).
 *
 * Gọi bởi: có thể dùng cho DashboardPage hoặc stats section trong MyEventsPage
 * Backend: GET /api/events/organizer/dashboard
 */
export async function getOrganizerDashboard(): Promise<OrganizerDashboardResponse> {
  if (USE_MOCK) {
    await delay(300);
    return {
      summary: {
        totalEvents: MOCK_EVENTS.length,
        totalTicketsSold: MOCK_EVENTS.reduce((a, e) => a + e.currentMinted, 0),
        totalRevenueETH: MOCK_EVENTS.reduce(
          (a, e) => a + e.currentMinted * parseFloat(e.price),
          0
        ).toFixed(4),
      },
      events: MOCK_EVENTS.map((e) => ({
        _id: e._id,
        blockchainId: e.blockchainId,
        name: e.name,
        status: e.status as EventStatus,
        maxSupply: e.maxSupply,
        sold: e.currentMinted,
        revenueETH: (e.currentMinted * parseFloat(e.price)).toFixed(4),
        bannerUrl: e.bannerUrl,
      })),
    };
  }

  const { data } = await api.get<OrganizerDashboardResponse>('/events/organizer/dashboard');
  return data;
}
