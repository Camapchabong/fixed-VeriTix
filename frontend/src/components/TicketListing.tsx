type TicketItem = {
  title: string;
  info: string;
  price: string;
};

type TicketCategory = {
  name: string;
  items: TicketItem[];
};

const categories: TicketCategory[] = [
  {
    name: 'Âm Nhạc & Concert',
    items: [
      { title: 'Sơn Tùng M-TP Sky Tour 2025', info: 'Mỹ Đình Stadium • 15/03/2025', price: '1.200.000đ' },
      { title: 'Hoàng Thùy Linh - Tứ Phủ Concert', info: 'Cung Văn Hóa • 22/03/2025', price: '800.000đ' },
      { title: 'Rap Việt All Stars Live Concert', info: 'TP. Hồ Chí Minh • 01/04/2025', price: '600.000đ' },
    ],
  },
  {
    name: 'Thể Thao',
    items: [
      { title: 'V-League 2025: Hà Nội FC vs HAGL', info: 'Sân Hàng Đẫy • 10/03/2025', price: '150.000đ' },
      { title: 'Giải VBA 2025 - Chung Kết', info: 'Nhà Thi Đấu Phú Thọ • 18/04/2025', price: '200.000đ' },
      { title: 'Marathon Quốc Tế TP. Hồ Chí Minh', info: 'TP. Hồ Chí Minh • 05/05/2025', price: '50.000đ' },
    ],
  },
  {
    name: 'Nghệ Thuật & Kịch',
    items: [
      { title: 'Vở Kịch "Tôi Thấy Hoa Vàng Trên Cỏ Xanh"', info: 'Nhà Hát Lớn Hà Nội • 08/04/2025', price: '300.000đ' },
      { title: 'Triển Lãm Nghệ Thuật Đương Đại Việt Nam', info: 'Bảo Tàng Mỹ Thuật • 15/03/2025', price: '80.000đ' },
      { title: 'Stand-up Comedy - Trấn Thành Live Show', info: 'TP. Hồ Chí Minh • 22/04/2025', price: '450.000đ' },
    ],
  },
];

const TicketListing = () => {
  return (
    <section className="ticket-listing">
      <div className="container">
        {categories.map((category) => (
          <div key={category.name} className="category-section">
            <div className="category-header">
              <h2 className="category-title">{category.name}</h2>
              <a href="#" className="view-more-btn">
                Xem Thêm →
              </a>
            </div>
            <div className="ticket-list">
              {category.items.map((item) => (
                <div key={item.title} className="ticket-item">
                  <div className="ticket-image"></div>
                  <div className="ticket-details">
                    <h3 className="ticket-title">{item.title}</h3>
                    <p className="ticket-info">
                      <span className="info-icon">📍</span> {item.info}
                    </p>
                  </div>
                  <div className="ticket-price">
                    <div className="price-label">Giá từ</div>
                    <div className="price-value">{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TicketListing;
