const express = require('express');
const { getMyTickets, checkInTicket } = require('../controllers/ticketController'); 

const { protect, organizerOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/my-tickets', protect, getMyTickets);

router.post('/checkin', protect, organizerOnly, checkInTicket);

module.exports = router;