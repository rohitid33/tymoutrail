# User Service

This microservice handles user authentication, profile management, and user-related operations for the Tymout application.

## Features

- User registration and authentication
- Google OAuth integration
- JWT-based authentication
- User profile management
- Profile picture upload to AWS S3

## Deployment on Railway.app

### Prerequisites

- A Railway.app account
- Railway CLI installed (optional, for local deployment)
- AWS S3 bucket for profile picture storage

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
   COOKIE_KEY=tymout_cookie_secret_key_change_in_production
   
   # Google OAuth
   GOOGLE_CLIENT_ID=919446563884-1ak5704lr4op3m5urihhfn52bub9p53q.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   
   # Frontend URL
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
