# Message Service

This microservice handles real-time messaging and chat functionality for the Tymout application.

## Features

- Real-time messaging using Socket.IO
- Message storage and retrieval
- Event-specific chat rooms
- Message deletion functionality

## Deployment on Railway.app

### Prerequisites

- A Railway.app account
- Railway CLI installed (optional, for local deployment)

### Steps to Deploy

1. **Create a new project on Railway.app**
   - Go to [Railway.app](https://railway.app/)
   - Create a new project
   - Choose "Deploy from GitHub" or "Empty Project"

2. **Configure Environment Variables**
   The following environment variables need to be set in Railway.app:
   
   ```
   # MongoDB Connection
   MONGO_URI=mongodb+srv://tymout:xShiTOyopWJvVYWn@tymout.2ovsdf2.mongodb.net/
   
   # Authentication
   JWT_SECRET=tymout_jwt_secret_key_change_in_production
   
   # Frontend URL (update with your actual frontend URL)
   FRONTEND_URL=https://your-frontend-url.railway.app
   
   # Service Configuration
   NODE_ENV=production
   ```

3. **Deploy the Service**
   - If deploying from GitHub, connect your repository and select the message-service directory
   - If deploying manually, push your code to Railway using the CLI or web interface

4. **Verify Deployment**
   - Once deployed, Railway will provide a URL for your service
   - Test the service by accessing the health endpoint: `https://your-service-url.railway.app/health`

5. **Enable Public Networking**
   - After deployment, go to the Settings tab in Railway
   - Look for "Public Networking" or "Networking" section
   - Enable public networking for your service
   - This will generate a public URL for your service

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/messages/:eventId` - Get messages for a specific event
- `POST /api/messages` - Create a new message
- `PATCH /api/messages/:eventId/:messageId/delete` - Delete a message (soft delete)

## Socket.IO Events

- `connection` - Client connects to the server
- `joinEvent` - Client joins an event's chat room
- `sendMessage` - Client sends a message to an event's chat room
- `messageReceived` - Server broadcasts a message to all clients in an event's chat room

## Local Development

```bash
# Install dependencies
npm install

# Start the service
npm start

# Start in development mode
npm run dev
```
