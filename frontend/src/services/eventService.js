/**
 * Event Service
 * 
 * Following Single Responsibility Principle:
 * - This service is responsible for all event-related API calls
 * - Each function handles a specific operation related to events
 */
import axios from 'axios';

const eventService = {
  /**
   * Get event details by ID
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Event details
   */
  getEventById: async (eventId) => {
    try {
      console.log('[eventService] Fetching event by ID:', eventId);
      // Directly call event-service backend (bypassing API gateway)
      const response = await axios.get(`http://localhost:3002/events/${eventId}`);
      console.log('[eventService] Backend response:', response.data);
      
      // The backend returns { success: true, data: event }
      // Transform the response to match frontend expectations
      const event = response.data.data;
      
      if (!event) {
        throw new Error(`Event not found: ${eventId}`);
      }
      
      // Format date from MongoDB date object to string
      const startDate = event.date?.start ? new Date(event.date.start) : new Date();
      const formattedDate = startDate.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric' 
      });
      
      // Format location from object to string
      const locationStr = event.location?.city || 'Unknown Location';
      
      // Return the transformed event
      return {
        ...event,
        id: event._id, // Add id field based on MongoDB's _id
        type: event.type || 'event',
        image: event.image || null,
        location: locationStr,
        date: formattedDate,
        participants: event.attendees?.length || 0,
        maxParticipants: event.capacity || event.maxAttendees || 10,
        tags: event.tags || [],
        host: {
          id: event.host?.userId || 'unknown',
          name: event.host?.name || 'Anonymous Host',
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(event.host?.name || 'User')}&background=random&color=fff&size=128`
        }
      };
    } catch (error) {
      console.error('[eventService] Error fetching event details:', error);
      throw error;
    }
  },
  
  /**
   * Join an event
   * @param {string} eventId - Event ID
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Updated event
   */
  joinEvent: async (eventId, userData) => {
    try {
      console.log('[eventService] Joining event:', { eventId, userData });
      console.log('[eventService] Making POST request to:', `http://localhost:3002/events/${eventId}/join`);
      
      // Add authorization header if available
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('[eventService] Added authorization header');
      } else {
        console.log('[eventService] No token found, request will be unauthorized');
      }
      
      const response = await axios.post(`http://localhost:3002/events/${eventId}/join`, userData, { headers });
      console.log('[eventService] Join event response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error(`[eventService] Error joining event:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  /**
   * Leave an event
   * @param {string} eventId - Event ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated event
   */
  leaveEvent: async (eventId, userId) => {
    try {
      console.log('[eventService] Leaving event:', { eventId, userId });
      console.log('[eventService] Making POST request to:', `http://localhost:3002/events/${eventId}/leave`);
      
      // Add authorization header if available
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('[eventService] Added authorization header');
      } else {
        console.log('[eventService] No token found, request will be unauthorized');
      }
      
      const response = await axios.post(`http://localhost:3002/events/${eventId}/leave`, { userId }, { headers });
      console.log('[eventService] Leave event response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error(`[eventService] Error leaving event:`, error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  /**
   * Submit feedback for an event
   * @param {string} eventId - Event ID
   * @param {Object} feedbackData - Feedback data (hostRating, eventRating, comment)
   * @returns {Promise<Object>} Updated event
   */
  submitFeedback: async (eventId, feedbackData) => {
    try {
      console.log('[eventService] Submitting feedback for event:', { eventId, feedbackData });
      console.log('[eventService] Making POST request to:', `http://localhost:3002/events/${eventId}/feedback`);
      
      // Add authorization header if available
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('[eventService] Added authorization header');
      } else {
        console.log('[eventService] No token found, request will be unauthorized');
      }
      
      const response = await axios.post(`http://localhost:3002/events/${eventId}/feedback`, feedbackData, { headers });
      console.log('[eventService] Submit feedback response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error(`[eventService] Error submitting feedback:`, error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

export default eventService;
