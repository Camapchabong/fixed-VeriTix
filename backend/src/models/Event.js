const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  blockchainId: { type: Number, unique: true, index: true }, // ID từ Smart Contract
  
  organizerWallet: { type: String, required: true, lowercase: true }, // Tham chiếu tới User.walletAddress

  name: { type: String, required: true },
  description: { type: String, default: "" },
  location: { type: String, default: "TBD" },
  bannerUrl: { type: String, default: "" },
  
  startTime: { type: Date, required: true },
  endTime: { type: Date },

  price: { type: String, required: true }, // Lưu chuỗi để tránh sai số floating point
  maxSupply: { type: Number, required: true },
  currentMinted: { type: Number, default: 0 },
  maxResellPercentage: { type: Number, default: 110 },
  
  initialCapital: { type: Number, default: 0 }, // Vốn ban đầu 

  isOnChain: { type: Boolean, default: false }, // Xác nhận sự kiện đã được verify trên Blockchain
  status: { type: String, enum: ['DRAFT', 'ACTIVE', 'ENDED', 'CANCELLED'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);