# Feedback Service

This microservice handles user feedback and ratings for the Tymout application, allowing users to provide reviews for events, other users, and circles.

## Features

- Create, update, and delete feedback
- View feedback for events, users, and circles
- Calculate rating statistics and distributions
- Support for anonymous feedback
- Report inappropriate feedback
- Tag-based feedback categorization

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
   - If deploying from GitHub, connect your repository and select the feedback-service directory
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
- `GET /api/feedback/target/:targetType/:targetId` - Get all feedback for a target (event, user, circle)
- `GET /api/feedback/stats/:targetType/:targetId` - Get feedback statistics for a target
- `GET /api/feedback/user` - Get all feedback by the authenticated user
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback
- `POST /api/feedback/:id/report` - Report feedback

## Local Development

```bash
# Install dependencies
npm install

# Start the service
npm start

# Start with hot reload for development
npm run dev
```
