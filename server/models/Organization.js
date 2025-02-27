const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'My Organization',
  },
  googleRefreshToken: {
    type: String,
    default: null,
  },
  googleSheetUrl: {
    type: String,
    default: null,
  },
  googleColumnMapping: {
    type: Map,
    of: String,
    default: new Map()
  },
  isPollingEnabled: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
}, {
  versionKey: false,
});

const Organization = mongoose.model('Organization', schema);

module.exports = Organization;