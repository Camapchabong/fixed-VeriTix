const BlockchainTrust = () => {
  return (
    <section className="blockchain-trust">
      <div className="container">
        <div className="trust-content">
          <div className="trust-text">
            <h2>
              Xây Dựng Trên Niềm Tin<br />Vận Hành Bởi Blockchain
            </h2>
            <p className="trust-desc">
              VeriTix sử dụng công nghệ blockchain phi tập trung để đảm bảo mỗi giao dịch đều minh bạch, an toàn và không thể thay đổi. Hệ thống của chúng tôi loại bỏ hoàn toàn vé giả, gian lận và đảm bảo quyền lợi tối đa cho người dùng.
            </p>
            <p className="trust-desc">
              Với mạng lưới node toàn cầu, mọi vé được xác minh trong vài giây, mang đến trải nghiệm mua vé nhanh chóng và đáng tin cậy nhất.
            </p>
          </div>
          <div className="trust-visual">
            <div className="network-node">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="white" opacity="0.2" />
                <circle cx="20" cy="20" r="8" fill="white" />
              </svg>
            </div>
            <div className="network-node">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="white" opacity="0.2" />
                <circle cx="20" cy="20" r="8" fill="white" />
              </svg>
            </div>
            <div className="network-node">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="white" opacity="0.2" />
                <circle cx="20" cy="20" r="8" fill="white" />
              </svg>
            </div>
            <div className="network-node">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="white" opacity="0.2" />
                <circle cx="20" cy="20" r="8" fill="white" />
              </svg>
            </div>
            <div className="network-node" style={{ width: '100px', height: '100px' }}>
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="white" opacity="0.2" />
                <circle cx="25" cy="25" r="10" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainTrust;
