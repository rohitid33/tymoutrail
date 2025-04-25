const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  },
  responseMessage: {
    type: String,
    trim: true
  },
  responseTime: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
RequestSchema.index({ eventId: 1, userId: 1 }, { unique: true });
RequestSchema.index({ userId: 1, status: 1 });
RequestSchema.index({ eventId: 1, status: 1 });

module.exports = mongoose.model('Request', RequestSchema);
