# User Service

This microservice handles user authentication, profile management, and user-related operations for the Tymout application.

## Features

- User registration and authentication
- Google OAuth integration
- JWT-based authentication
- User profile management

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
   MONGO_URI=mongodb+srv://tymout:xShiTOyopWJvVYWn@tymout.2ovsdf2.mongodb.net/
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   COOKIE_KEY=your_cookie_secret
   NODE_ENV=production
   ```

3. **Deploy the Service**
   - If deploying from GitHub, connect your repository and select the user-service directory
   - If deploying manually, push your code to Railway using the CLI or web interface

4. **Verify Deployment**
   - Once deployed, Railway will provide a URL for your service
   - Test the service by accessing the health endpoint: `https://your-service-url.railway.app/health`

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user
- `GET /auth/current` - Get current user
- `GET /auth/google` - Google OAuth login
- `GET /user/:id` - Get user by ID

## Local Development

```bash
# Install dependencies
npm install

# Start the service
npm start

# Start in development mode
npm run dev
```
