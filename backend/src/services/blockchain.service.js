const { ethers } = require("ethers");
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const Transaction = require("../models/Transaction");
require("dotenv").config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.SEPOLIA_RPC_URL;

const CONTRACT_ABI = [
  "event EventCreated(uint256 indexed eventId, string name, address organizer)",
  "event TicketBought(uint256 indexed eventId, uint256 indexed ticketId, address buyer, uint256 price)",
  "event TicketResold(uint256 indexed eventId, uint256 indexed ticketId, address oldOwner, address newOwner, uint256 price)",
  "function events(uint256) view returns (uint256 id, string name, uint256 price, uint256 maxPrice, uint256 maxSupply, uint256 currentMinted, address organizer, bool isActive)"
];

const startBlockchainListener = async () => {
  try {
    if (!CONTRACT_ADDRESS || !RPC_URL) return console.error("Missing env vars");

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    provider.pollingInterval = 4000;

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    contract.on("EventCreated", async (eventId, name, organizer) => {
      try {
        const exists = await Event.findOne({ blockchainId: Number(eventId) });
        if (exists) return;

        const eventDetails = await contract.events(eventId);

        await Event.create({
          blockchainId: Number(eventId),
          name: eventDetails.name,
          organizerWallet: eventDetails.organizer,
          maxSupply: Number(eventDetails.maxSupply),
          startTime: new Date(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          price: ethers.formatEther(eventDetails.price),
          description: "Sự kiện đồng bộ từ Blockchain",
          location: "On-chain Event",
          isOnChain: true
        });

      } catch (err) {
        console.error(err.message);
      }
    });

    contract.on("TicketBought", async (eventId, ticketId, buyer, price) => {
      try {
        const dbEvent = await Event.findOne({ blockchainId: Number(eventId) });
        if (!dbEvent) return;

        const ticketExists = await Ticket.findOne({ blockchainTicketId: Number(ticketId) });
        if (ticketExists) return;

        await Ticket.create({
          blockchainTicketId: Number(ticketId),
          eventId: dbEvent._id,
          ownerWallet: buyer,
          purchasePrice: ethers.formatEther(price),
          status: 'SOLD'
        });

        await Transaction.create({
          txHash: `mint_${ticketId}_${Date.now()}`,
          type: 'MINT',
          fromWallet: dbEvent.organizerWallet,
          toWallet: buyer,
          amount: ethers.formatEther(price)
        });

        dbEvent.currentMinted += 1;
        await dbEvent.save();

      } catch (err) {
        console.error(err.message);
      }
    });

    contract.on("TicketResold", async (eventId, ticketId, oldOwner, newOwner, price) => {
      try {
        const ticket = await Ticket.findOne({ blockchainTicketId: Number(ticketId) });
        if (!ticket) return;

        ticket.ownerWallet = newOwner;
        ticket.purchasePrice = ethers.formatEther(price);
        ticket.status = 'SOLD';
        await ticket.save();

        await Transaction.create({
          txHash: `resell_${ticketId}_${Date.now()}`,
          type: 'RESELL',
          fromWallet: oldOwner,
          toWallet: newOwner,
          amount: ethers.formatEther(price)
        });

      } catch (err) {
        console.error(err.message);
      }
    });

  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { startBlockchainListener };