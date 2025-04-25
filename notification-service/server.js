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
const PORT = process.env.PORT || process.env.NOTIFICATION_SERVICE_PORT || 3005;

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://tymout:xShiTOyopWJvVYWn@tymout.2ovsdf2.mongodb.net/tymout-notifications';

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
  console.log(`[Notification Service] Received ${req.method} request to ${req.url}`);
  console.log(`[Notification Service] Headers:`, req.headers);
  console.log(`[Notification Service] Body:`, req.body);
  next();
});

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB - Notification Service'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const notificationRoutes = require('./routes/notificationRoutes');

// Use routes
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'notification-service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[Notification Service:Error]`, err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
