# VeriTix Backend Tracking

Tài liệu này dùng để theo dõi tiến độ xây dựng API và logic cho Backend của hệ thống bán vé VeriTix.

## Cấu trúc dự án hiện tại
- src/config: Cấu hình Database và Web3 Provider.
- src/controllers: Xử lý logic của các Request/Response từ người dùng.
- src/middlewares: Kiểm soát bảo mật (JWT), phân quyền (Organizer, Admin), và xử lý lỗi tập trung.
- src/models: Mongoose Schemas (User, Event, Ticket, Transaction).
- src/routes: Định nghĩa các Endpoint API (authRoutes, eventRoutes, ticketRoutes).
- src/services: Chức năng chạy ngầm (Blockchain Listener để bắt sự kiện từ mạng Sepolia).
- src/utils: Các hàm tiện ích dùng chung.

---

## Tiến độ công việc (Roadmap)

### Giai đoạn 1: Database và nền tảng (Đã hoàn thành)
- [x] Khởi tạo dự án và kết nối thành công với MongoDB.
- [x] Thiết lập Blockchain Listener ban đầu (lắng nghe sự kiện EventCreated).
- [x] Xây dựng và tối ưu Models (User, Event, Ticket, Transaction) theo đặc tả Hybrid (Web2 + Web3).
- [x] Thiết lập Global Error Handler (Middleware xử lý lỗi tập trung, bắt các lỗi đặc thù như CastError).

### Giai đoạn 2: Xác thực và phân quyền - Auth (Đã hoàn thành)
- [x] API cấp mã nonce ngẫu nhiên để chuẩn bị ký tin nhắn.
- [x] API đăng nhập/đăng ký một chạm bằng chữ ký MetaMask (Verify Signature).
- [x] Middleware kiểm tra và giải mã JWT Token (protect).
- [x] Middleware kiểm tra quyền truy cập đặc thù (organizerOnly, adminOnly).

### Giai đoạn 3: Quản lý sự kiện - Events (Đã hoàn thành)
- [x] API lấy danh sách các sự kiện đang mở bán (cho trang chủ).
- [x] API lấy chi tiết một sự kiện kèm thông tin on-chain và off-chain.
- [x] API cập nhật metadata off-chain (cho phép chủ sự kiện bổ sung ảnh banner, mô tả, địa điểm, thời gian).
- [x] API dashboard thống kê (tính toán doanh thu ETH và số lượng vé đã bán cho từng chủ sự kiện).

### Giai đoạn 4: Quản lý vé và giao dịch (Đã hoàn thành)
- [x] Cập nhật Listener: lắng nghe sự kiện TicketBought từ Smart Contract và ghi nhận vé mới vào database.
- [x] Cập nhật Listener: lắng nghe sự kiện TicketResold từ Smart Contract và cập nhật chủ sở hữu mới.
- [x] API lấy danh sách "Vé của tôi" (hiển thị toàn bộ NFT ticket mà user đang sở hữu).

### Giai đoạn 5: Check-in và bảo mật (Đã hoàn thành)
- [x] API quét mã QR để check-in (dành riêng cho chủ sự kiện kiểm soát).
- [x] Logic chống vé giả bằng cách kiểm tra và xác thực chữ ký số (Signature) của người dùng.
- [x] Logic chống chụp màn hình vé (mã QR chứa Timestamp và bị vô hiệu hóa sau 5 phút).

## API Endpoints (VeriTix)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| **Auth** | | | |
| GET | `/api/auth/nonce/:walletAddress` | Xin mã nonce ngẫu nhiên trước khi ký | - |
| POST | `/api/auth/verify` | Gửi chữ ký (Signature) để đăng nhập → JWT token | - |
| **Events** | | | |
| GET | `/api/events` | Lấy danh sách tất cả sự kiện đang mở bán | - |
| GET | `/api/events/:id` | Xem chi tiết sự kiện (theo Blockchain ID) | - |
| PUT | `/api/events/:id` | Cập nhật thông tin Off-chain (Ảnh, Mô tả, Địa điểm) | Organizer |
| GET | `/api/events/organizer/dashboard`| Xem thống kê doanh thu, số vé đã bán | Organizer |
| **Tickets & Check-in** | | | |
| GET | `/api/tickets/my-tickets` | Lấy danh sách vé đã mua của tôi (kèm Event info) | Login |
| POST | `/api/tickets/checkin` | Quét mã QR xác thực Check-in chống vé giả | Organizer |