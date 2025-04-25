const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });
// Also load local .env file if it exists
dotenv.config({ path: path.join(__dirname, '.env') });

const messageRoutes = require('./routes/messageRoutes');
const setupSocket = require('./services/socketService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3010',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://tymout:xShiTOyopWJvVYWn@tymout.2ovsdf2.mongodb.net/tymout-events?retryWrites=true&w=majority';

// Log MongoDB connection details (without sensitive info)
console.log('MongoDB Connection URI:', MONGO_URI.replace(/:[^:]*@/, ':****@')); // Hide password in logs

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'tymout-events',
});

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3010',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[Message Service] Received ${req.method} request to ${req.url}`);
  console.log(`[Message Service] Headers:`, req.headers);
  console.log(`[Message Service] Body:`, req.body);
  next();
});

app.get('/', (req, res) => {
  res.send('Message Service is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'message-service' });
});

app.use('/api/messages', messageRoutes);

// Attach socket.io for real-time chat
setupSocket(io);

const PORT = process.env.PORT || process.env.MESSAGE_SERVICE_PORT || 3020;
server.listen(PORT, () => {
  console.log(`Message Service running on port ${PORT}`);
});
