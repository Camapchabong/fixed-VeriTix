const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/db');
const { startBlockchainListener } = require('./src/services/blockchain.service');
const { notFound, errorHandler } = require('./src/middlewares/errorMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
startBlockchainListener();

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes); 
app.use('/api/tickets', ticketRoutes);

app.get('/', (req, res) => {
  res.send('VeriTix API đang chạy ngon lành! 🚀');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng ${PORT}`);
});