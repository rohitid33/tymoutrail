const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });
// Also load local .env file if it exists
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || process.env.DISCOVERY_SERVICE_PORT || 3003;

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://tymout:xShiTOyopWJvVYWn@tymout.2ovsdf2.mongodb.net/tymout-discovery';

// Log MongoDB connection details (without sensitive info)
console.log('MongoDB Connection URI:', MONGO_URI.replace(/:[^:]*@/, ':****@')); // Hide password in logs

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3010',
  credentials: true,
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
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB - Discovery Service'))
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
  console.error(`[Discovery Service:Error]`, err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Discovery Service running on port ${PORT}`);
});
