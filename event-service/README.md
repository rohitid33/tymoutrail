# Event Service

This microservice handles event creation, management, and related operations for the Tymout application.

## Features

- Event creation and management
- Circle creation and management
- Image upload for events
- Event search and filtering

## Deployment on Railway.app

### Prerequisites

- A Railway.app account
- Railway CLI installed (optional, for local deployment)
- AWS S3 bucket for event image storage

### Steps to Deploy

1. **Create a new project on Railway.app**
   - Go to [Railway.app](https://railway.app/)
   - Create a new project
   - Choose "Deploy from GitHub" or "Empty Project"

2. **Configure Environment Variables**
   The following environment variables need to be set in Railway.app:
   
   ```markdown
   # MongoDB Connection
   MONGO_URI=mongodb+srv://tymout:xShiTOyopWJvVYWn@tymout.2ovsdf2.mongodb.net/
   
   # Authentication
   JWT_SECRET=tymout_jwt_secret_key_change_in_production
   
   # Frontend URL (update with your actual frontend URL)
   FRONTEND_URL=https://your-frontend-url.railway.app
   
   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=AKIATG6MGVT7XAJKB7SN
   AWS_SECRET_ACCESS_KEY=5EPY0XhChmlkDS4bn0wxgCdTCorGxcN8DhnqiFGI
   AWS_REGION=ap-south-1
   BUCKET_NAME=tymouttest
   
   # Service Configuration
   NODE_ENV=production
   ```

3. **Deploy the Service**
   - If deploying from GitHub, connect your repository and select the event-service directory
   - If deploying manually, push your code to Railway using the CLI or web interface

4. **Verify Deployment**
   - Once deployed, Railway will provide a URL for your service
   - Test the service by accessing the health endpoint: `https://your-service-url.railway.app/health`

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create a new event
- `PUT /events/:id` - Update an event
- `DELETE /events/:id` - Delete an event
- `POST /events/images` - Upload an event image
- `GET /circles` - Get all circles
- `POST /circles` - Create a new circle

## Local Development

```bash
# Install dependencies
npm install

# Start the service
npm start

# Start in development mode
npm run dev
```
