# API Gateway

This API Gateway serves as the central entry point for the Tymout application, routing requests to the appropriate microservices.

## Features

- Centralized routing to all microservices
- Authentication and session management
- CORS configuration
- Request logging
- Error handling
- Health check endpoint

## Deployment on Railway.app

### Prerequisites

- A Railway.app account
- All microservices deployed on Railway.app with public URLs

### Steps to Deploy

1. **Create a new project on Railway.app**
   - Go to [Railway.app](https://railway.app/)
   - Create a new project
   - Choose "Deploy from GitHub" or "Empty Project"

2. **Configure Environment Variables**
   The following environment variables need to be set in Railway.app:
   
   ```bash
   # API Gateway Configuration
   PORT=3000
   NODE_ENV=production
   COOKIE_KEY=tymout_cookie_secret_key_change_in_production
   COOKIE_DOMAIN=railway.app
   
   # Frontend URL
   FRONTEND_URL=https://your-frontend-url.railway.app
   
   # Microservice URLs (Railway deployed services)
   USER_SERVICE_URL=https://user-service-production.up.railway.app
   EVENT_SERVICE_URL=https://event-service-production.up.railway.app
   DISCOVERY_SERVICE_URL=https://discovery-service-production.up.railway.app
   REQUEST_SERVICE_URL=https://request-service-production.up.railway.app
   NOTIFICATION_SERVICE_URL=https://notification-service-production.up.railway.app
   FEEDBACK_SERVICE_URL=https://feedback-service-production.up.railway.app
   ```

   Replace the service URLs with the actual URLs of your deployed microservices on Railway.app.

3. **Deploy the Service**
   - If deploying from GitHub, connect your repository and select the api-gateway directory
   - If deploying manually, push your code to Railway using the CLI or web interface

4. **Verify Deployment**
   - Once deployed, Railway will provide a URL for your service
   - Test the service by accessing the health endpoint: `https://your-service-url.railway.app/health`

5. **Enable Public Networking**
   - After deployment, go to the Settings tab in Railway
   - Look for "Public Networking" or "Networking" section
   - Enable public networking for your service
   - This will generate a public URL for your service

## API Routes

The API Gateway routes requests to the following microservices:

- **User Service**: `/api/users/*`
- **Event Service**: `/api/events/*` and `/api/circles/*`
- **Discovery Service**: `/api/discovery/*`, `/api/search/*`, and `/api/recommendations/*`
- **Request Service**: `/api/requests/*`
- **Notification Service**: `/api/notifications/*`
- **Feedback Service**: `/api/feedback/*`

## Health Check

The API Gateway provides a health check endpoint at `/health` that returns the status of the gateway and the URLs of all connected microservices.

## Local Development

```bash
# Install dependencies
npm install

# Start the service
npm start

# Start with hot reload for development
npm run dev
```

For local development, you'll need to set up the environment variables in a `.env` file based on the `.env.example` template.
