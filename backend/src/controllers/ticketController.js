const Ticket = require('../models/Ticket');
const { ethers } = require('ethers');

const getMyTickets = async (req, res, next) => {
  try {    
    const walletAddress = req.user.walletAddress.toLowerCase();       
    const tickets = await Ticket.find({ ownerWallet: walletAddress })
      .populate('eventId', 'name bannerUrl startTime location')
      .sort({ createdAt: -1 }); 

    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

const checkInTicket = async (req, res, next) => {
  try {
    const { blockchainTicketId, timestamp, signature } = req.body;
    
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - timestamp > 300) {
      return res.status(400).json({ message: "Mã QR đã hết hạn, vui lòng yêu cầu khách tạo lại mã mới!" });    }

    
    const ticket = await Ticket.findOne({ blockchainTicketId }).populate('eventId');
    if (!ticket) {
      return res.status(404).json({ message: "Vé không tồn tại trên hệ thống!" });    }

    
    if (ticket.eventId.organizerWallet.toLowerCase() !== req.user.walletAddress.toLowerCase()) {
      return res.status(403).json({ message: "Cảnh báo: Bạn không có quyền soát vé cho sự kiện này!" });
    }
    
    if (ticket.status === 'USED') {
      return res.status(400).json({ message: "VÉ NÀY ĐÃ ĐƯỢC SỬ DỤNG TRƯỚC ĐÓ!" });
    }
    if (ticket.status !== 'SOLD') {
      return res.status(400).json({ message: `Vé không hợp lệ (Trạng thái hiện tại: ${ticket.status})` });
    }    
    
    const message = `Check-in VeriTix\nTicket ID: ${blockchainTicketId}\nTimestamp: ${timestamp}`;    
    
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== ticket.ownerWallet.toLowerCase()) {
      return res.status(401).json({ message: "MÃ QR GIẢ MẠO! Chữ ký không khớp với chủ sở hữu vé." });
    }
    
    ticket.status = 'USED';
    await ticket.save();

    res.status(200).json({ 
      message: "CHECK-IN THÀNH CÔNG!", 
      ticketId: blockchainTicketId 
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getMyTickets, checkInTicket };