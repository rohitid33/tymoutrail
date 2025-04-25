# Notification Service

This microservice handles notifications for the Tymout application, including email notifications, in-app notifications, and push notifications.

## Features

- Create and manage notifications
- Send email notifications
- Support for various notification types (event, circle, system, etc.)
- Mark notifications as read/unread
- Filter notifications by type, status, and date

## Deployment on Railway.app

### Prerequisites

- A Railway.app account
- Railway CLI installed (optional, for local deployment)
- Email service credentials (for sending email notifications)

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
   
   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   
   # Frontend URL (update with your actual frontend URL)
   FRONTEND_URL=https://your-frontend-url.railway.app
   
   # Service Configuration
   NODE_ENV=production
   ```

3. **Deploy the Service**
   - If deploying from GitHub, connect your repository and select the notification-service directory
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
- `GET /api/notifications` - Get all notifications for the authenticated user
- `GET /api/notifications/:id` - Get a specific notification
- `POST /api/notifications` - Create a new notification
- `POST /api/notifications/event` - Create an event-related notification
- `POST /api/notifications/circle` - Create a circle-related notification
- `PATCH /api/notifications/:id/read` - Mark a notification as read
- `PATCH /api/notifications/:id/unread` - Mark a notification as unread
- `DELETE /api/notifications/:id` - Delete a notification

## Local Development

```bash
# Install dependencies
npm install

# Start the service
npm start
```
