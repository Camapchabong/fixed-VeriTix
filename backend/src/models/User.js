const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 1. Định danh chính bằng Web3 (Bắt buộc)
  walletAddress: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  // 2. Thông tin cá nhân Có thể cập nhật sau khi login ví
  email: { 
    type: String, 
    trim: true,
    lowercase: true,
    default: '' 
  },
  fullName: { 
    type: String, 
    default: 'Anonymous User' 
  },
  phone: { 
    type: String, 
    default: '' 
  },
  
  // 3. Phân quyền linh hoạt (Dùng cờ Flag thay vì Enum để dễ nâng cấp user)
  isOrganizer: { type: Boolean, default: false }, 
  isAdmin: { type: Boolean, default: false },

  // 4. Mã bảo mật cho Web3
  nonce: { 
    type: String, 
    required: true 
  }, 

}, { 
  // 5. Tự động thêm createdAt và updatedAt
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);