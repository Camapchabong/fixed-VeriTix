import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import type { IEvent } from "../types/event.type";
import "../assets/styles/event.css";

const EventGrid = () => {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    const mockData: IEvent[] = [
      {
        _id: "1",
        onChainId: 1,
        title: "Blockchain Concert",
        description: "Test event",
        imageUrl: "https://via.placeholder.com/400",
        location: "Hà Nội",
        startDate: "2026-12-12",
        price: 500000,
        maxSupply: 100,
        soldCount: 10,
        organizerWallet: "0x123",
      },
    ];

    setEvents(mockData);
  }, []);

  return (
    <div className="event-section">
      <h2>Sự kiện nổi bật</h2>

      <div className="event-grid">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventGrid;