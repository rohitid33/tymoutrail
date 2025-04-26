const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: process.env.NODE_ENV === 'production' ? './.env' : path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || process.env.DISCOVERY_SERVICE_PORT || 3003;

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://tymout:xShiTOyopWJvVYWn@tymout.2ovsdf2.mongodb.net/tymout-discovery';

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
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[Discovery Service:Step 1] Received ${req.method} request to ${req.url}`);
  console.log(`[Discovery Service:Step 2] Headers:`, req.headers);
  console.log(`[Discovery Service:Step 3] Body:`, req.body);
  next();
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB - Discovery Service');
    console.log('MongoDB Connection URI:', MONGO_URI.replace(/:[^:]*@/, ':****@')); // Hide password in logs
    
    // List all collections in the database
    mongoose.connection.db.listCollections().toArray((err, collections) => {
      if (err) {
        console.error('Error listing collections:', err);
      } else {
        console.log('Available collections:', collections.map(c => c.name));
      }
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const discoveryRoutes = require('./routes/discovery');
const searchRoutes = require('./routes/search');
const recommendationRoutes = require('./routes/recommendations');

// Use routes
app.use('/discovery', discoveryRoutes);
app.use('/search', searchRoutes);
app.use('/recommendations', recommendationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'discovery-service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[Discovery Service:Error]`, err);
  console.error(`[Discovery Service:Error Details]`, {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  res.status(500).json({ error: 'Server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`[Discovery Service] Server running on port ${PORT}`);
  console.log(`[Discovery Service] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Discovery Service] Frontend URL: ${process.env.FRONTEND_URL || 'https://tymout-frontend-frontend.vercel.app'}`);
  console.log(`[Discovery Service] API Gateway URL: ${process.env.API_GATEWAY_URL || 'https://api-gateway-production-b713.up.railway.app'}`);
});
