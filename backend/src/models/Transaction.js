const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  txHash: { type: String, required: true, unique: true }, // Mã giao dịch trên Etherscan
  
  type: { type: String, enum: ['MINT', 'RESELL', 'CHECKIN'], required: true },
  
  fromWallet: { type: String, required: true, lowercase: true },
  toWallet: { type: String, required: true, lowercase: true },
  
  amount: { type: String, default: "0" }, // Số ETH giao dịch
  
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);