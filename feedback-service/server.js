const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const feedbackRoutes = require('./routes/feedbackRoutes');

// Initialize express app
const app = express();

// Set port
const PORT = process.env.PORT || process.env.FEEDBACK_SERVICE_PORT || 3006;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
};
app.use(cors(corsOptions));

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'feedback-service'
  });
});

// Mount routes
app.use('/api/feedback', feedbackRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Feedback Service running on port ${PORT}`);
      
      // Log all registered routes
      console.log('Registered Routes:');
      app._router.stack
        .filter(r => r.route)
        .map(r => {
          Object.keys(r.route.methods).forEach(method => {
            console.log(`${method.toUpperCase()}\t${r.route.path}`);
          });
        });
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

module.exports = app;
