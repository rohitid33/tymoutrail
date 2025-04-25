# Discovery Service

This microservice handles discovery, search, and recommendation operations for the Tymout application.

## Features

- City-based discovery of events and circles
- Advanced search with multiple filters
- Personalized recommendations
- Trending and popular content discovery

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
   - If deploying from GitHub, connect your repository and select the discovery-service directory
   - If deploying manually, push your code to Railway using the CLI or web interface

4. **Verify Deployment**
   - Once deployed, Railway will provide a URL for your service
   - Test the service by accessing the health endpoint: `https://your-service-url.railway.app/health`

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /discovery/city` - Get events and circles in a specific city
- `GET /discovery/trending` - Get trending events and circles
- `GET /search` - Search across events and circles with advanced filtering
- `GET /recommendations/personalized` - Get personalized recommendations (requires authentication)
- `GET /recommendations/similar/:type/:id` - Get similar items to a specific event or circle

## Local Development

```bash
# Install dependencies
npm install

# Start the service
npm start

# Start in development mode
npm run dev
```
