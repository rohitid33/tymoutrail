const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: process.env.NODE_ENV === 'production' ? './.env' : path.join(__dirname, '..', '.env') });

// Following Single Responsibility Principle - server.js only handles server setup
const app = express();
const PORT = process.env.PORT || process.env.EVENT_SERVICE_PORT || 3002;

// MongoDB connection - using the connection string from our project
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://tymout:xShiTOyopWJvVYWn@tymout.2ovsdf2.mongodb.net/tymout-events';

// Middleware
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'https://tymout-frontend-frontend.vercel.app',
    process.env.API_GATEWAY_URL || 'https://api-gateway-production-b713.up.railway.app',
    'http://localhost:3010',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(helmet()); // Security headers
app.use(express.json());
app.use(morgan('dev')); // Logging

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[Event Service] Received ${req.method} request to ${req.url}`);
  console.log(`[Event Service] Request headers:`, req.headers);
  console.log(`[Event Service] Request body:`, req.body);
  next();
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB - Event Service');
    console.log('MongoDB Connection URI:', MONGO_URI.replace(/:[^:]*@/, ':****@')); // Hide password in logs
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes - following SRP by separating route handling
const eventRoutes = require('./routes/events');
const circleRoutes = require('./routes/circles');
const imageRoutes = require('./routes/images');

// Use routes
app.use('/events', eventRoutes);
app.use('/circles', circleRoutes);
app.use('/events/images', imageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'event-service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[Event Service] Error:`, err);
  console.error(`[Event Service] Error details:`, {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  res.status(500).json({ error: 'Server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`[Event Service] Server running on port ${PORT}`);
  console.log(`[Event Service] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Event Service] Frontend URL: ${process.env.FRONTEND_URL || 'https://tymout-frontend-frontend.vercel.app'}`);
  console.log(`[Event Service] API Gateway URL: ${process.env.API_GATEWAY_URL || 'https://api-gateway-production-b713.up.railway.app'}`);
});
