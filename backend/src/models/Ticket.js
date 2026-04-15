const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  blockchainTicketId: { type: Number, required: true, unique: true, index: true }, // Token ID của ERC721/1155
  
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  
  ownerWallet: { type: String, required: true, lowercase: true }, // Ai đang giữ vé này
  
  purchasePrice: { type: String, required: true }, // Mua giá bao nhiêu
  
  status: { type: String, enum: ['AVAILABLE', 'SOLD', 'RESELLING', 'USED'], default: 'AVAILABLE' }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);