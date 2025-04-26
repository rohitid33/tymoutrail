const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables
require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? './.env' : path.join(__dirname, '..', '.env') });

const messageRoutes = require('./routes/messageRoutes');
const setupSocket = require('./services/socketService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'https://tymout-frontend-frontend.vercel.app',
      process.env.API_GATEWAY_URL || 'https://api-gateway-production-b713.up.railway.app',
      'http://localhost:3010',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://tymout:xShiTOyopWJvVYWn@tymout.2ovsdf2.mongodb.net/tymout-events?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'tymout-events',
})
.then(() => {
  console.log('Connected to MongoDB - Message Service');
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
app.use(express.json());
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[Message Service] Received ${req.method} request to ${req.url}`);
  console.log(`[Message Service] Request headers:`, req.headers);
  console.log(`[Message Service] Request body:`, req.body);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'message-service' });
});

app.get('/', (req, res) => {
  res.send('Message Service is running');
});

app.use('/api/messages', messageRoutes);

// Attach socket.io for real-time chat
setupSocket(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[Message Service] Error:`, err);
  console.error(`[Message Service] Error details:`, {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  res.status(500).json({ error: 'Server error', details: err.message });
});

const PORT = process.env.PORT || process.env.MESSAGE_SERVICE_PORT || 3020;
server.listen(PORT, () => {
  console.log(`[Message Service] Server running on port ${PORT}`);
  console.log(`[Message Service] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Message Service] Frontend URL: ${process.env.FRONTEND_URL || 'https://tymout-frontend-frontend.vercel.app'}`);
  console.log(`[Message Service] API Gateway URL: ${process.env.API_GATEWAY_URL || 'https://api-gateway-production-b713.up.railway.app'}`);
});
