import React from 'react';
import { parseDateTime, FIFTEEN_MIN_HEIGHT } from "../utils/dateUtils"
import { DisplayEvent } from "../types/event"

interface EventDragOverlayProps {
  event: DisplayEvent;
}

const EventDragOverlay: React.FC<EventDragOverlayProps> = ({ event }) => {
  const startTime = parseDateTime(event.startDateTime);
  const endTime = parseDateTime(event.endDateTime);
  const duration = (endTime.getTime() - startTime.getTime()) / 60000;
  const height = (duration / 15) * FIFTEEN_MIN_HEIGHT;

  return (
    <div
      style={{
        position: 'absolute',
        top: `${event.top}px`,
        height: `${height}px`,
        width: '100%',
        backgroundColor: event.color,
        opacity: 0.8,
        borderRadius: '4px',
        padding: '4px',
        boxSizing: 'border-box',
        cursor: 'move',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontSize: '12px', color: '#fff' }}>
        {event.subject}
      </div>
      <div style={{ fontSize: '10px', color: '#fff' }}>
        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
        {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default EventDragOverlay;
