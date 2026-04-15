import type { IEvent } from "../types/event.type";
import "../assets/styles/event.css";

const EventCard = ({ event }: { event: IEvent }) => {
  return (
    <div className="event-card">
      <img src={event.imageUrl} alt={event.title} />

      <div className="event-info">
        <h3>{event.title}</h3>
        <p>{event.location}</p>
        <p>{new Date(event.startDate).toLocaleDateString()}</p>

        <div className="event-footer">
          <span>{event.price}đ</span>
          <button>Xem chi tiết</button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;