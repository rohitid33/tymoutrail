# Tymout Frontend

This is the frontend application for the Tymout platform, built with React and designed to work with the Tymout microservices backend.

## Deployment on Vercel

### Prerequisites

- A Vercel account
- All backend microservices deployed on Railway.app
- API Gateway deployed and configured on Railway.app

### Steps to Deploy

1. **Push your code to GitHub**
   - Make sure your frontend code is in a GitHub repository

2. **Import Project on Vercel**
   - Go to [Vercel](https://vercel.com/)
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Select the frontend directory if it's in a monorepo

3. **Configure Environment Variables**
   The following environment variables need to be set in Vercel:
   
   ```bash
   # API Gateway URL (update with your actual API Gateway URL from Railway)
   REACT_APP_API_URL=https://your-api-gateway-url.up.railway.app
   # AWS Configuration for Image Uploads
   REACT_APP_AWS_ACCESS_KEY_ID=AKIATG6MGVT7XAJKB7SN
   REACT_APP_AWS_SECRET_ACCESS_KEY=5EPY0XhChmlkDS4bn0wxgCdTCorGxcN8DhnqiFGI
   REACT_APP_AWS_REGION=ap-south-1
   REACT_APP_BUCKET_NAME=tymouttest
   
   # Google Maps API Key
   REACT_APP_GOOGLE_API_KEY=AIzaSyCVdOFTlnxaMs7X6kSfSF1qZ3SYc3bklwA
   
   # Socket.IO Configuration (should point to Message Service)
   REACT_APP_SOCKET_URL=https://message-service-production-eec3.up.railway.app
   ```

4. **Deploy the Application**
   - Click "Deploy"
   - Vercel will build and deploy your application

5. **Verify Deployment**
   - Once deployed, Vercel will provide a URL for your application
   - Test the application by accessing the URL
   - Verify that it can connect to the backend services

## Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Project Structure

- `src/config`: Configuration files for API and axios
- `src/components`: Reusable UI components
- `src/services`: Service modules for API calls
- `src/pages`: Page components
- `src/hooks`: Custom React hooks
- `src/context`: React context providers
- `src/utils`: Utility functions
- `public`: Static assets

## API Configuration

The frontend uses a centralized API configuration in `src/config/api.js` that makes it easy to switch between development and production environments. All API calls should use this configuration to ensure consistency.

## Styling

The application uses Tailwind CSS for styling. Global CSS variables are defined in the global CSS files.

## Authentication

Authentication is handled through the User Service via the API Gateway. The frontend stores the authentication token in localStorage and includes it in all API requests using the axios interceptor in `src/config/axios.js`.
