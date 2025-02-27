const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  personalInfo: {
    dateOfBirth: Date,
    phoneNumber: String,
    address: String,
    emergencyContact: {
      name: String,
      relationship: String,
      phoneNumber: String
    }
  },
  documents: [{
    name: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  startDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);