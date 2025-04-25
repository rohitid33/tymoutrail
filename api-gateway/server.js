const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');

// Load environment variables
dotenv.config();

// Following Single Responsibility Principle - server.js only handles server setup and routing
const app = express();
const PORT = process.env.PORT || process.env.API_GATEWAY_PORT || 3000;

// Service URLs - these will be set as environment variables in Railway
// Default to localhost for local development
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || `http://localhost:${process.env.USER_SERVICE_PORT || 3001}`;
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || `http://localhost:${process.env.EVENT_SERVICE_PORT || 3002}`;
const DISCOVERY_SERVICE_URL = process.env.DISCOVERY_SERVICE_URL || `http://localhost:${process.env.DISCOVERY_SERVICE_PORT || 3003}`;
const REQUEST_SERVICE_URL = process.env.REQUEST_SERVICE_URL || `http://localhost:${process.env.REQUEST_SERVICE_PORT || 3004}`;
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || `http://localhost:${process.env.NOTIFICATION_SERVICE_PORT || 3005}`;
const FEEDBACK_SERVICE_URL = process.env.FEEDBACK_SERVICE_URL || `http://localhost:${process.env.FEEDBACK_SERVICE_PORT || 3006}`;
const SAFETY_SERVICE_URL = process.env.SAFETY_SERVICE_URL || `http://localhost:${process.env.SAFETY_SERVICE_PORT || 3007}`;
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || `http://localhost:${process.env.PAYMENT_SERVICE_PORT || 3008}`;
const PARTNERSHIP_SERVICE_URL = process.env.PARTNERSHIP_SERVICE_URL || `http://localhost:${process.env.PARTNERSHIP_SERVICE_PORT || 3009}`;

// Log service URLs at startup
console.log('Service URLs:');
console.log(`User Service: ${USER_SERVICE_URL}`);
console.log(`Event Service: ${EVENT_SERVICE_URL}`);
console.log(`Discovery Service: ${DISCOVERY_SERVICE_URL}`);
console.log(`Request Service: ${REQUEST_SERVICE_URL}`);
console.log(`Notification Service: ${NOTIFICATION_SERVICE_URL}`);
console.log(`Feedback Service: ${FEEDBACK_SERVICE_URL}`);
console.log(`Safety Service: ${SAFETY_SERVICE_URL}`);
console.log(`Payment Service: ${PAYMENT_SERVICE_URL}`);
console.log(`Partnership Service: ${PARTNERSHIP_SERVICE_URL}`);

// Middleware
app.use(
  session({
    secret: process.env.COOKIE_KEY || 'tymout_cookie_secret_key_change_in_production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(helmet()); // Security headers
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api-gateway',
    services: {
      user: USER_SERVICE_URL,
      event: EVENT_SERVICE_URL,
      discovery: DISCOVERY_SERVICE_URL,
      request: REQUEST_SERVICE_URL,
      notification: NOTIFICATION_SERVICE_URL,
      feedback: FEEDBACK_SERVICE_URL,
      safety: SAFETY_SERVICE_URL,
      payment: PAYMENT_SERVICE_URL,
      partnership: PARTNERSHIP_SERVICE_URL
    }
  });
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[API Gateway] Received ${req.method} request to ${req.url}`);
  next();
});

// Routes to microservices
app.use('/api/users', createProxyMiddleware({ 
  target: USER_SERVICE_URL, 
  changeOrigin: true,
  pathRewrite: {'^/api/users': ''},
  // Enable cookies for Google OAuth
  cookieDomainRewrite: {
    '*': process.env.COOKIE_DOMAIN || 'localhost'
  },
  // Configure proxy options
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // Maintain keep-alive connection
    proxyReqOpts.headers['connection'] = 'keep-alive';
    // Ensure proper content-type is set
    if (srcReq.body) {
      proxyReqOpts.headers['content-type'] = 'application/json';
    }
    return proxyReqOpts;
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[API Gateway] Proxying request to User Service: ${req.method} ${req.url}`);
    
    // Ensure body is properly forwarded
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[API Gateway] Received response from User Service: ${proxyRes.statusCode}`);
    
    // Handle redirects from the user service
    if (proxyRes.headers.location) {
      // Rewrite the location header to include /api/users prefix
      const location = proxyRes.headers.location;
      if (location.startsWith('/auth')) {
        proxyRes.headers.location = `/api/users${location}`;
      } else if (location.includes('/auth/success')) {
        // Make sure the success redirect goes to the correct frontend URL
        proxyRes.headers.location = location.replace('http://localhost:3000', process.env.FRONTEND_URL || 'http://localhost:3010');
      }
    }
  },
  onError: (err, req, res) => {
    console.error(`[API Gateway] Proxy Error:`, err.message);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
}));

app.use('/api/events', createProxyMiddleware({ 
  target: EVENT_SERVICE_URL, 
  changeOrigin: true,
  pathRewrite: {'^/api/events': '/events'},
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['connection'] = 'keep-alive';
    if (srcReq.body) {
      proxyReqOpts.headers['content-type'] = 'application/json';
    }
    return proxyReqOpts;
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[API Gateway] Proxying request to Event Service: ${req.method} ${req.url}`);
    
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error(`[API Gateway] Proxy Error:`, err.message);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
}));

app.use('/api/circles', createProxyMiddleware({ 
  target: EVENT_SERVICE_URL, 
  changeOrigin: true,
  pathRewrite: {'^/api/circles': '/circles'},
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['connection'] = 'keep-alive';
    if (srcReq.body) {
      proxyReqOpts.headers['content-type'] = 'application/json';
    }
    return proxyReqOpts;
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[API Gateway] Proxying request to Event Service (Circles): ${req.method} ${req.url}`);
    
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error(`[API Gateway] Proxy Error:`, err.message);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
}));

// Discovery Service Routes
app.use(['/api/discovery', '/api/search', '/api/recommendations'], createProxyMiddleware({ 
  target: DISCOVERY_SERVICE_URL, 
  changeOrigin: true,
  pathRewrite: {
    '^/api/discovery': '/discovery',
    '^/api/search': '/search',
    '^/api/recommendations': '/recommendations'
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['connection'] = 'keep-alive';
    if (srcReq.body) {
      proxyReqOpts.headers['content-type'] = 'application/json';
    }
    return proxyReqOpts;
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[API Gateway] Proxying request to Discovery Service: ${req.method} ${req.url}`);
    
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error(`[API Gateway] Proxy Error:`, err.message);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
}));

app.use('/api/requests', createProxyMiddleware({ 
  target: REQUEST_SERVICE_URL, 
  changeOrigin: true,
  pathRewrite: {'^/api/requests': '/api/requests'},
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['connection'] = 'keep-alive';
    if (srcReq.body) {
      proxyReqOpts.headers['content-type'] = 'application/json';
    }
    return proxyReqOpts;
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[API Gateway] Proxying request to Request Service: ${req.method} ${req.url}`);
    
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error(`[API Gateway] Proxy Error:`, err.message);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
}));

app.use('/api/notifications', createProxyMiddleware({ 
  target: NOTIFICATION_SERVICE_URL, 
  changeOrigin: true,
  pathRewrite: {'^/api/notifications': '/api/notifications'},
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['connection'] = 'keep-alive';
    if (srcReq.body) {
      proxyReqOpts.headers['content-type'] = 'application/json';
    }
    return proxyReqOpts;
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[API Gateway] Proxying request to Notification Service: ${req.method} ${req.url}`);
    
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error(`[API Gateway] Proxy Error:`, err.message);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
}));

app.use('/api/feedback', createProxyMiddleware({ 
  target: FEEDBACK_SERVICE_URL, 
  changeOrigin: true,
  pathRewrite: {'^/api/feedback': '/api/feedback'},
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['connection'] = 'keep-alive';
    if (srcReq.body) {
      proxyReqOpts.headers['content-type'] = 'application/json';
    }
    return proxyReqOpts;
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[API Gateway] Proxying request to Feedback Service: ${req.method} ${req.url}`);
    
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error(`[API Gateway] Proxy Error:`, err.message);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
}));

// Catch-all route for 404s
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource does not exist' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
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

module.exports = app;
