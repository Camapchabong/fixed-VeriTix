import axios from 'axios';

/* ══════════════════════════════════════════
   Axios Instance — Shared API Client
   
   Base URL: /api (proxy từ Vite dev server)
              hoặc VITE_API_URL env variable
   
   Auth: Bearer token từ localStorage
         (set bởi AuthContext khi login thành công)
   
   Error handling:
   - 401 → clear token, redirect login
   - Các lỗi khác → reject promise để component tự xử lý
   ══════════════════════════════════════════ */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ── Request Interceptor: gắn Bearer token ── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response Interceptor: xử lý lỗi chung ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Không có response = network error / timeout
    if (!error.response) {
      console.error('[API] Network error:', error.message);
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 401 Unauthorized → token hết hạn hoặc giả mạo
    if (status === 401) {
      localStorage.removeItem('token');
      // Chỉ redirect nếu đang không ở trang login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // 403 Forbidden → không phải organizer hoặc không có quyền
    if (status === 403) {
      console.warn('[API] Forbidden:', error.response.data?.message);
    }

    return Promise.reject(error);
  }
);

/* ── Helper: extract error message từ backend response ── */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Backend trả { message: "..." }
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Đã có lỗi xảy ra';
}

export default api;
