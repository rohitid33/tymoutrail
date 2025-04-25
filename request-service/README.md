# Request Service

This microservice handles event join requests for the Tymout application, allowing users to request to join events and event hosts to approve or reject these requests.

## Features

- Create join requests for events
- Approve or reject requests by event hosts
- Cancel requests by requesters
- View requests by event or by user
- Status tracking (pending, approved, rejected, cancelled)

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
   - If deploying from GitHub, connect your repository and select the request-service directory
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
- `GET /api/requests/event/:eventId` - Get all requests for an event
- `GET /api/requests/user` - Get all requests by the authenticated user
- `GET /api/requests/:id` - Get a specific request by ID
- `POST /api/requests` - Create a new request to join an event
- `PUT /api/requests/:id/status` - Update request status (approve/reject)
- `PUT /api/requests/:id/cancel` - Cancel a request (by the requester)

## Local Development

```bash
# Install dependencies
npm install

# Start the service
npm start

# Start with hot reload for development
npm run dev
```
