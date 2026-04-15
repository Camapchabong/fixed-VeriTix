const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async (req, res, next) => {
  let token;

  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = await User.findById(decoded.id).select('-nonce');

      next(); 

    } catch (error) {
      console.error(error);
      res.status(401); 
      next(new Error('Không có quyền truy cập, Token giả mạo hoặc đã hết hạn!'));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('Không có quyền truy cập, Không tìm thấy Token đăng nhập!'));
  }
};


const organizerOnly = (req, res, next) => {
  
  if (req.user && req.user.isOrganizer) {
    next();
  } else {
    res.status(403); 
    next(new Error('Truy cập bị từ chối. Tính năng này chỉ dành cho Chủ sự kiện!'));
  }
};


const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    next(new Error('Truy cập bị từ chối. Tính năng này chỉ dành cho Quản trị viên!'));
  }
};

module.exports = { protect, organizerOnly, adminOnly };