# Tymout API Gateway

This is the API Gateway service for the Tymout microservices architecture. It routes requests to the appropriate microservices.

## Deployment on Railway

### Prerequisites

- A Railway account
- Railway CLI installed locally (optional)

### Environment Variables

The following environment variables need to be set in your Railway project:

```
NODE_ENV=production
PORT=<automatically set by Railway>
MONGO_URI=mongodb+srv://tymout:xShiTOyopWJvVYWn@tymout.2ovsdf2.mongodb.net/
JWT_SECRET=<your-jwt-secret>
COOKIE_KEY=<your-cookie-key>
FRONTEND_URL=<your-frontend-url>

# Service URLs (set these to your deployed microservice URLs)
USER_SERVICE_URL=<deployed-user-service-url>
EVENT_SERVICE_URL=<deployed-event-service-url>
DISCOVERY_SERVICE_URL=<deployed-discovery-service-url>
REQUEST_SERVICE_URL=<deployed-request-service-url>
NOTIFICATION_SERVICE_URL=<deployed-notification-service-url>
FEEDBACK_SERVICE_URL=<deployed-feedback-service-url>
SAFETY_SERVICE_URL=<deployed-safety-service-url>
PAYMENT_SERVICE_URL=<deployed-payment-service-url>
PARTNERSHIP_SERVICE_URL=<deployed-partnership-service-url>
```

### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Connect your repository to Railway:
   - Create a new project in Railway
   - Select "Deploy from GitHub"
   - Choose your repository and the api-gateway directory
   - Railway will automatically detect the configuration

3. Set up environment variables:
   - Go to your project settings in Railway
   - Add all required environment variables

4. Deploy:
   - Railway will automatically deploy your API Gateway
   - You can monitor the deployment in the Railway dashboard

### Monitoring

- The API Gateway includes a health check endpoint at `/health`
- Railway will use this endpoint to monitor the service health

## Local Development

```bash
npm install
npm run dev
```

## Notes

- The API Gateway is configured to use the PORT environment variable provided by Railway
- In production, make sure all microservice URLs are correctly set in the environment variables
