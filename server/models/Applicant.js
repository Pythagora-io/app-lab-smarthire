const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  cv: {
    type: String,
    required: true,
  },
  cvFileName: {
    type: String,
    required: true,
  },
  additionalFile: String,
  additionalFileName: String,
  position: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Screened', 'Interview', 'Offer', 'Hired', 'Rejected'],
    default: 'Applied',
  },
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  hiringManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

module.exports = mongoose.model('Applicant', applicantSchema);