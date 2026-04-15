
const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy đường dẫn - ${req.originalUrl}`);
  res.status(404);
  next(error); 
};

const errorHandler = (err, req, res, next) => {
  
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Không tìm thấy dữ liệu (Sai định dạng ID)';
  }

  res.status(statusCode).json({
    message: message,
    
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };