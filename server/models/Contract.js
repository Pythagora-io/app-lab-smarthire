const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Full Time', 'Part Time', 'Contract'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'On Hold', 'Terminated'],
    default: 'Active'
  },
  startDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contract', contractSchema);