const Request = require('../models/Request');
const { validationResult } = require('express-validator');

// Get all requests for an event
exports.getEventRequests = async (req, res) => {
  try {
    const requests = await Request.find({ eventId: req.params.eventId });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all requests by a user
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new request
exports.createRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { eventId, message } = req.body;

  try {
    // Check if request already exists
    let request = await Request.findOne({ eventId, userId: req.user.id });
    
    if (request) {
      return res.status(400).json({ msg: 'Request already exists' });
    }

    // Create new request
    request = new Request({
      eventId,
      userId: req.user.id,
      message,
      status: 'pending'
    });

    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update request status (approve/reject)
exports.updateRequestStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status, responseMessage } = req.body;

  try {
    let request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Update request
    request.status = status;
    request.responseMessage = responseMessage || '';
    request.responseTime = Date.now();
    
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Cancel a request (by the requester)
exports.cancelRequest = async (req, res) => {
  try {
    let request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Check if user owns the request
    if (request.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to cancel this request' });
    }

    // Cancel request
    request.status = 'cancelled';
    
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }
    
    res.json(request);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Request not found' });
    }
    res.status(500).send('Server Error');
  }
};
