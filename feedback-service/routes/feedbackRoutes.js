const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');

// @route   GET api/feedback/target/:targetType/:targetId
// @desc    Get all feedback for a target (event, user, circle)
// @access  Public
router.get('/target/:targetType/:targetId', feedbackController.getTargetFeedback);

// @route   GET api/feedback/stats/:targetType/:targetId
// @desc    Get feedback statistics for a target
// @access  Public
router.get('/stats/:targetType/:targetId', feedbackController.getTargetStats);

// @route   GET api/feedback/user
// @desc    Get all feedback by the authenticated user
// @access  Private
router.get('/user', auth, feedbackController.getUserFeedback);

// @route   POST api/feedback
// @desc    Create new feedback
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('targetId', 'Target ID is required').not().isEmpty(),
      check('targetType', 'Target type is required').isIn(['event', 'user', 'circle']),
      check('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 })
    ]
  ],
  feedbackController.createFeedback
);

// @route   PUT api/feedback/:id
// @desc    Update feedback
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('rating', 'Rating must be between 1 and 5').optional().isInt({ min: 1, max: 5 })
    ]
  ],
  feedbackController.updateFeedback
);

// @route   DELETE api/feedback/:id
// @desc    Delete feedback
// @access  Private
router.delete('/:id', auth, feedbackController.deleteFeedback);

// @route   POST api/feedback/:id/report
// @desc    Report feedback
// @access  Private
router.post('/:id/report', auth, feedbackController.reportFeedback);

module.exports = router;
