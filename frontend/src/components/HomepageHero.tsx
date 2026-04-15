const HomepageHero = () => {
  return (
    <section className="hero">
      <canvas className="blockchain-bg" id="blockchainCanvas"></canvas>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Bán Vé Bảo Mật<br />Trên Blockchain
          </h1>
          <p className="hero-subtitle">
            Trải nghiệm tương lai của vé sự kiện với xác thực blockchain và thanh toán số liền mạch
          </p>

          <div className="hero-ticket">
            <div className="ticket-glow"></div>
            <div className="ticket-content">
              <div className="ticket-info">
                <h3>Truy Cập Sự Kiện Đã Xác Thực</h3>
                <p className="ticket-desc">
                  Mỗi vé được bảo vệ bởi công nghệ blockchain, đảm bảo tính xác thực và không thể làm giả. Trải nghiệm an toàn tuyệt đối cho mọi sự kiện.
                </p>
              </div>
              <div className="blockchain-icon">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" />
                  <circle cx="60" cy="60" r="35" fill="none" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="2" />
                  <circle cx="60" cy="60" r="20" fill="rgba(0, 212, 255, 0.2)" stroke="#00d4ff" strokeWidth="3" />
                  <circle cx="60" cy="20" r="8" fill="#00d4ff" />
                  <circle cx="95" cy="60" r="8" fill="#00d4ff" />
                  <circle cx="60" cy="100" r="8" fill="#00d4ff" />
                  <circle cx="25" cy="60" r="8" fill="#00d4ff" />
                  <line x1="60" y1="28" x2="60" y2="52" stroke="#00d4ff" strokeWidth="2" />
                  <line x1="87" y1="60" x2="68" y2="60" stroke="#00d4ff" strokeWidth="2" />
                  <line x1="60" y1="92" x2="60" y2="68" stroke="#00d4ff" strokeWidth="2" />
                  <line x1="33" y1="60" x2="52" y2="60" stroke="#00d4ff" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageHero;
