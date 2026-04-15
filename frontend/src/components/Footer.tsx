import React from 'react';
import '../assets/styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Sản Phẩm</h4>
            <a href="#" className="footer-link">Tìm Kiếm Vé</a>
            <a href="#" className="footer-link">Danh Mục Sự Kiện</a>
            <a href="#" className="footer-link">Ví Blockchain</a>
            <a href="#" className="footer-link">Ứng Dụng Mobile</a>
          </div>
          <div className="footer-section">
            <h4>Công Ty</h4>
            <a href="#" className="footer-link">Về VeriTix</a>
            <a href="#" className="footer-link">Đội Ngũ</a>
            <a href="#" className="footer-link">Tin Tức</a>
            <a href="#" className="footer-link">Liên Hệ</a>
          </div>
          <div className="footer-section">
            <h4>Tài Nguyên</h4>
            <a href="#" className="footer-link">Trung Tâm Trợ Giúp</a>
            <a href="#" className="footer-link">Hướng Dẫn Sử Dụng</a>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">FAQ</a>
          </div>
          <div className="footer-section">
            <h4>Pháp Lý</h4>
            <a href="#" className="footer-link">Điều Khoản Dịch Vụ</a>
            <a href="#" className="footer-link">Chính Sách Bảo Mật</a>
            <a href="#" className="footer-link">Chính Sách Hoàn Tiền</a>
            <a href="#" className="footer-link">Quy Định Sử Dụng</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2024 VeriTix. Bảo lưu mọi quyền. Nền tảng bán vé trên blockchain.
        </div>
      </div>
    </footer>
  );
};

export default Footer;