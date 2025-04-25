const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['event', 'user', 'circle']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'reported', 'removed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for faster queries
FeedbackSchema.index({ targetId: 1, targetType: 1 });
FeedbackSchema.index({ userId: 1 });
FeedbackSchema.index({ rating: 1 });

module.exports = mongoose.model('Feedback', FeedbackSchema);