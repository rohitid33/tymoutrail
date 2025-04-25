/**
 * Central API configuration file for the Tymout frontend
 * This file provides consistent API URLs across the application
 * and makes it easy to switch between environments
 */

// Base API URL - uses the API Gateway URL from environment variables
// Falls back to localhost:3000 for development if not set
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Service-specific URLs
// In production, all requests go through the API Gateway
// In development, we can use direct service URLs for testing
export const SERVICE_URLS = {
  // User Service
  users: `${API_BASE_URL}/api/users`,
  auth: `${API_BASE_URL}/api/users/auth`,
  
  // Event Service
  events: `${API_BASE_URL}/api/events`,
  circles: `${API_BASE_URL}/api/circles`,
  
  // Discovery Service
  discovery: `${API_BASE_URL}/api/discovery`,
  search: `${API_BASE_URL}/api/search`,
  recommendations: `${API_BASE_URL}/api/recommendations`,
  
  // Request Service
  requests: `${API_BASE_URL}/api/requests`,
  
  // Notification Service
  notifications: `${API_BASE_URL}/api/notifications`,
  
  // Feedback Service
  feedback: `${API_BASE_URL}/api/feedback`,
  
  // Message Service
  messages: `${API_BASE_URL}/api/messages`,
  
  // Socket.IO URL for real-time messaging
  socket: process.env.REACT_APP_SOCKET_URL || 'http://localhost:3020'
};

// Helper function to get the full URL for a specific endpoint
export const getApiUrl = (service, endpoint = '') => {
  const baseUrl = SERVICE_URLS[service];
  if (!baseUrl) {
    console.error(`Unknown service: ${service}`);
    return null;
  }
  
  return endpoint ? `${baseUrl}/${endpoint}` : baseUrl;
};

// Create API object with all exports
const api = {
  API_BASE_URL,
  SERVICE_URLS,
  getApiUrl
};

export default api;
