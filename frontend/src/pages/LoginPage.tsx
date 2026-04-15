import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import '../assets/styles/auth.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ identifier: false, password: false });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, identifier: value });

    if (fieldErrors.identifier) setFieldErrors({ ...fieldErrors, identifier: false });
    if (loginError) setLoginError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });

    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: false });
    if (loginError) setLoginError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({ identifier: false, password: false });
    setLoginError('');
    const isIdEmpty = !formData.identifier.trim();
    const isPassEmpty = !formData.password.trim();

    if (isIdEmpty || isPassEmpty) {
      setFieldErrors({
        identifier: isIdEmpty,
        password: isPassEmpty,
      });
      return;
    }

    if (!isCaptchaChecked) {
      alert('Vui lòng xác minh Captcha!');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        identifier: formData.identifier,
        password: formData.password,
      });

      console.log('Login success:', response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert('Đăng nhập thành công!');
      navigate('/');
    } catch (err: any) {
      console.error('Lỗi đăng nhập:', err);
      const msg = err.response?.data?.message || 'Không thể kết nối đến server!';
      setLoginError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Đăng Nhập</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Số điện thoại hoặc Email</label>
            <input
              type="text"
              className={`auth-input ${fieldErrors.identifier ? 'error' : ''}`}
              placeholder="Nhập email hoặc SĐT..."
              value={formData.identifier}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              className={`auth-input ${fieldErrors.password ? 'error' : ''}`}
              placeholder="Nhập mật khẩu..."
              value={formData.password}
              onChange={handlePasswordChange}
              disabled={loading}
            />
          </div>

          <div className="captcha-box">
            <input
              type="checkbox"
              id="captcha"
              checked={isCaptchaChecked}
              onChange={(e) => setIsCaptchaChecked(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="captcha" style={{ marginBottom: 0, cursor: 'pointer' }}>
              I'm not a robot
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>

          {loginError && <div className="login-error-msg"> {loginError}</div>}

          <div className="auth-actions">
            <Link to="/forgot-password" className="auth-link">
              Quên mật khẩu?
            </Link>
            <Link to="/register" className="auth-link">
              Tạo tài khoản mới
            </Link>
          </div>
        </form>

        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        <button className="social-btn google-btn">
          <FaGoogle className="social-icon" /> Sign in with Google
        </button>
        <button className="social-btn facebook-btn">
          <FaFacebook className="social-icon" /> Sign in with Facebook
        </button>

        <p className="auth-footer-text">
          Bằng việc tiếp tục, bạn đã đọc và đồng ý với{' '}
          <Link to="/terms" className="auth-link">
            Điều khoản sử dụng
          </Link>{' '}
          và{' '}
          <Link to="/privacy" className="auth-link">
            Chính sách bảo mật thông tin cá nhân
          </Link>{' '}
          của VeriTix.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
