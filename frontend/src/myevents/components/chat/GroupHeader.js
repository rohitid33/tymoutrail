import React from 'react';

/**
 * GroupHeader component displays the event (group) name and photo in the chat header.
 * @param {Object} props
 * @param {Object} props.event - The event object containing title and imageUrl
 * @param {Function} props.onClick - Function to call when header is clicked
 */

const GroupHeader = ({ event, onClick }) => {
  console.log('[GroupHeader] event:', event);
  if (!event) return null;
  // Get event ID (support both _id and id formats)
  const eventId = event._id || event.id;
  // Get event title (support both title and eventName formats)
  const eventTitle = event.title || event.eventName || "Event";
  // Get event image (support multiple image field names)
  const eventImage = event.event_image || event.thumbnail || event.imageUrl || "/default-group.png";
  
  // Truncate event title to 50 characters
  const displayTitle = eventTitle.length > 21 
    ? `${eventTitle.substring(0, 21)}...` 
    : eventTitle;
  
  console.log('[GroupHeader] Using eventId:', eventId, 'title:', eventTitle);
  
  return (
    <button
      className="flex items-center gap-2 group focus:outline-none max-w-full"
      onClick={onClick}
      aria-label={`View details for ${eventTitle}`}
      type="button"
    >
      <img
        src={eventImage}
        alt={eventTitle}
        className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-gray-50 group-hover:brightness-90 group-focus:brightness-90 transition flex-shrink-0"
      />
      <span 
        className="font-semibold text-base text-primary group-hover:underline group-focus:underline overflow-hidden whitespace-nowrap max-w-[calc(100%-2.5rem)]"
        title={eventTitle} // Show full title on hover
      >
        {displayTitle}
      </span>
    </button>
  );
};

export default GroupHeader;
