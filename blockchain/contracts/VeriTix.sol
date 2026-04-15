
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract VeriTix is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;
    uint256 private _eventIds;

    struct Event {
        uint256 id;
        string name;
        uint256 price;          
        uint256 maxPrice;       
        uint256 maxSupply;      
        uint256 currentMinted;  
        address organizer;      
        bool isActive;
    }

    struct Ticket {
        uint256 id;
        uint256 eventId;
        bool isUsed;            
        uint256 resalePrice;    
        address seller;         
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;

    
    event EventCreated(uint256 indexed eventId, string name, address organizer);
    event TicketMinted(uint256 indexed ticketId, uint256 indexed eventId, address buyer);
    event TicketListed(uint256 indexed ticketId, uint256 price, address seller);
    event TicketSold(uint256 indexed ticketId, address from, address to, uint256 price);
    event TicketCheckedIn(uint256 indexed ticketId, address owner);

    constructor() ERC721("VeriTix NFT", "VTX") Ownable(msg.sender) {}

    
    function createEvent(string memory name, uint256 price, uint256 maxSupply, uint256 maxResellPercentage) public returns (uint256) {
        _eventIds++;
        uint256 newEventId = _eventIds;

        
        uint256 calculatedMaxPrice = (price * maxResellPercentage) / 100;

        events[newEventId] = Event({
            id: newEventId,
            name: name,
            price: price,
            maxPrice: calculatedMaxPrice,
            maxSupply: maxSupply,
            currentMinted: 0,
            organizer: msg.sender,
            isActive: true
        });

        emit EventCreated(newEventId, name, msg.sender);
        return newEventId;
    }

    
    function buyTicket(uint256 eventId, string memory tokenURI) public payable nonReentrant returns (uint256) {
        Event storage myEvent = events[eventId];
        require(myEvent.isActive, "Su kien da dong");
        require(myEvent.currentMinted < myEvent.maxSupply, "Het ve");
        require(msg.value >= myEvent.price, "Khong du tien");

        
        payable(myEvent.organizer).transfer(msg.value);

        _tokenIds++;
        uint256 newTicketId = _tokenIds;

        tickets[newTicketId] = Ticket({
            id: newTicketId,
            eventId: eventId,
            isUsed: false,
            resalePrice: 0,
            seller: address(0)
        });

        myEvent.currentMinted++;
        _mint(msg.sender, newTicketId);
        _setTokenURI(newTicketId, tokenURI);

        emit TicketMinted(newTicketId, eventId, msg.sender);
        return newTicketId;
    }

    
    function listTicket(uint256 ticketId, uint256 price) public {
        require(ownerOf(ticketId) == msg.sender, "Khong phai chu so huu");
        Ticket storage ticket = tickets[ticketId];
        Event storage myEvent = events[ticket.eventId];

        require(!ticket.isUsed, "Ve da su dung, khong the ban");
        
        
        require(price <= myEvent.maxPrice, "Gia ban cao hon quy dinh cua BTC!");

        ticket.resalePrice = price;
        ticket.seller = msg.sender;

        
        _transfer(msg.sender, address(this), ticketId);

        emit TicketListed(ticketId, price, msg.sender);
    }

    
    function buyResellTicket(uint256 ticketId) public payable nonReentrant {
        Ticket storage ticket = tickets[ticketId];
        require(ticket.resalePrice > 0, "Ve nay khong ban");
        require(msg.value >= ticket.resalePrice, "Khong du tien");

        address seller = ticket.seller;
        uint256 price = ticket.resalePrice;
        
        
        Event storage myEvent = events[ticket.eventId];
        uint256 royaltyFee = (price * 5) / 100; 
        uint256 sellerReceive = price - royaltyFee;

        
        ticket.resalePrice = 0;
        ticket.seller = address(0);

        
        payable(myEvent.organizer).transfer(royaltyFee); 
        payable(seller).transfer(sellerReceive);         

        
        _transfer(address(this), msg.sender, ticketId);

        emit TicketSold(ticketId, seller, msg.sender, price);
    }

    
    function checkIn(uint256 ticketId) public {
        
        Ticket storage ticket = tickets[ticketId];
        require(!ticket.isUsed, "Ve da su dung!");
        
        ticket.isUsed = true;
        emit TicketCheckedIn(ticketId, ownerOf(ticketId));
    }
}