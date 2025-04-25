const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

// @route   GET api/requests/event/:eventId
// @desc    Get all requests for an event
// @access  Private
router.get('/event/:eventId', auth, requestController.getEventRequests);

// @route   GET api/requests/user
// @desc    Get all requests by the authenticated user
// @access  Private
router.get('/user', auth, requestController.getUserRequests);

// @route   GET api/requests/:id
// @desc    Get request by ID
// @access  Private
router.get('/:id', auth, requestController.getRequestById);

// @route   POST api/requests
// @desc    Create a new request
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('eventId', 'Event ID is required').not().isEmpty(),
      check('message', 'Message is required').not().isEmpty()
    ]
  ],
  requestController.createRequest
);

// @route   PUT api/requests/:id/status
// @desc    Update request status (approve/reject)
// @access  Private
router.put(
  '/:id/status',
  [
    auth,
    [
      check('status', 'Status is required').isIn(['approved', 'rejected'])
    ]
  ],
  requestController.updateRequestStatus
);

// @route   PUT api/requests/:id/cancel
// @desc    Cancel a request (by the requester)
// @access  Private
router.put('/:id/cancel', auth, requestController.cancelRequest);

module.exports = router;
