const express = require('express');
const router = express.Router();
const { uploadFileToS3 } = require('../utils/s3Upload');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for S3 upload

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  console.log('Multer processing file:', file.originalname, 'mimetype:', file.mimetype);
  
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer with size limits and file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: fileFilter
});

// Custom error handling for multer
const handleMulterUpload = (req, res, next) => {
  const multerMiddleware = upload.single('momentImage');
  
  multerMiddleware(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'Error uploading file',
        details: err.code || 'Unknown error'
      });
    }
    next();
  });
};

// Add request logging middleware
router.use((req, res, next) => {
  console.log(`[Event Service:Moments] Received ${req.method} request to ${req.url}`);
  console.log(`[Event Service:Moments] Headers:`, req.headers);
  next();
});

/**
 * @route   POST /events/images/:eventId/moments
 * @desc    Upload a moment/photo for an event
 * @access  Private (event members only)
 */
router.post('/:eventId/moments', auth, handleMulterUpload, async (req, res) => {
  console.log(`[Event Service:Moments] Processing moment upload for event ${req.params.eventId}`);
  console.log(`[Event Service:Moments] User:`, req.user);
  console.log(`[Event Service:Moments] File in request:`, !!req.file);
  
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file was provided'
      });
    }
    
    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Check if user is a member of the event or the host
    const isHost = event.host.userId.toString() === userId;
    const isMember = event.attendees.some(attendee => attendee.userId.toString() === userId);
    
    if (!isHost && !isMember) {
      return res.status(403).json({
        success: false,
        error: 'You must be a member of this event to upload photos'
      });
    }
    
    // Upload file to S3
    const imageUrl = await uploadFileToS3(
      req.file.buffer,
      req.file.originalname,
      eventId,
      'moments' // Specify the directory for moments
    );
    
    // Add the photo URL to the event's photos array
    if (!event.photos) {
      event.photos = [];
    }
    
    event.photos.push(imageUrl);
    await event.save();
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'Moment uploaded successfully',
      data: {
        imageUrl
      }
    });
  } catch (error) {
    console.error(`[Event Service:Moments] Error in moment upload:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error during moment upload',
      details: error.code || 'Unknown error'
    });
  }
});

module.exports = router;
