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

// Following Single Responsibility Principle - server.js only handles server setup
const app = express();
const PORT = process.env.PORT || process.env.EVENT_SERVICE_PORT || 3002;

// MongoDB connection - using the connection string from our project
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://tymout:xShiTOyopWJvVYWn@tymout.2ovsdf2.mongodb.net/tymout-events';

// Log MongoDB connection details (without sensitive info)
console.log('MongoDB Connection URI:', MONGO_URI.replace(/:[^:]*@/, ':****@')); // Hide password in logs

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3010',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(helmet()); // Security headers
app.use(express.json());
app.use(morgan('dev')); // Logging

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB - Event Service'))
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
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Event Service running on port ${PORT}`);
});
