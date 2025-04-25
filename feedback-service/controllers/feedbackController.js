const Feedback = require('../models/feedback');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// Get all feedback for a target (event, user, circle)
exports.getTargetFeedback = async (req, res) => {
  try {
    const { targetId, targetType } = req.params;
    
    const feedback = await Feedback.find({ 
      targetId, 
      targetType,
      status: 'active'
    }).sort({ createdAt: -1 });
    
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get feedback statistics for a target
exports.getTargetStats = async (req, res) => {
  try {
    const { targetId, targetType } = req.params;
    
    const stats = await Feedback.aggregate([
      { 
        $match: { 
          targetId: mongoose.Types.ObjectId(targetId),
          targetType,
          status: 'active'
        } 
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: {
            $push: '$rating'
          }
        }
      },
      {
        $project: {
          _id: 0,
          averageRating: { $round: ['$averageRating', 1] },
          totalReviews: 1,
          ratingDistribution: {
            1: { $size: { $filter: { input: '$ratings', as: 'rating', cond: { $eq: ['$$rating', 1] } } } },
            2: { $size: { $filter: { input: '$ratings', as: 'rating', cond: { $eq: ['$$rating', 2] } } } },
            3: { $size: { $filter: { input: '$ratings', as: 'rating', cond: { $eq: ['$$rating', 3] } } } },
            4: { $size: { $filter: { input: '$ratings', as: 'rating', cond: { $eq: ['$$rating', 4] } } } },
            5: { $size: { $filter: { input: '$ratings', as: 'rating', cond: { $eq: ['$$rating', 5] } } } }
          }
        }
      }
    ]);
    
    if (stats.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
      });
    }
    
    res.json(stats[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all feedback by a user
exports.getUserFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ 
      userId: req.user.id,
      status: 'active'
    }).sort({ createdAt: -1 });
    
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create new feedback
exports.createFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { targetId, targetType, rating, comment, tags, isAnonymous } = req.body;

  try {
    // Check if user has already submitted feedback for this target
    const existingFeedback = await Feedback.findOne({ 
      userId: req.user.id,
      targetId,
      targetType
    });
    
    if (existingFeedback) {
      return res.status(400).json({ msg: 'You have already submitted feedback for this target' });
    }

    // Create new feedback
    const feedback = new Feedback({
      userId: req.user.id,
      targetId,
      targetType,
      rating,
      comment,
      tags,
      isAnonymous: isAnonymous || false
    });

    await feedback.save();
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update feedback
exports.updateFeedback = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rating, comment, tags, isAnonymous } = req.body;

  try {
    let feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ msg: 'Feedback not found' });
    }

    // Check if user owns the feedback
    if (feedback.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this feedback' });
    }

    // Update feedback
    feedback.rating = rating || feedback.rating;
    feedback.comment = comment || feedback.comment;
    feedback.tags = tags || feedback.tags;
    feedback.isAnonymous = isAnonymous !== undefined ? isAnonymous : feedback.isAnonymous;
    
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    let feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ msg: 'Feedback not found' });
    }

    // Check if user owns the feedback
    if (feedback.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this feedback' });
    }

    await feedback.remove();
    res.json({ msg: 'Feedback removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Report feedback
exports.reportFeedback = async (req, res) => {
  try {
    let feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ msg: 'Feedback not found' });
    }

    // Mark feedback as reported
    feedback.status = 'reported';
    
    await feedback.save();
    res.json({ msg: 'Feedback reported' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
