const express = require('express');
const router = express.Router();
const applicantService = require('../services/applicantService');
const { requireUser } = require('./middleware/auth');

// Get all applicants for the organization
router.get('/', requireUser, async (req, res) => {
  try {
    const applicants = await applicantService.getApplicants(req.user.organization);
    console.log(`Retrieved ${applicants.length} applicants for organization ${req.user.organization}`);
    res.json({ applicants });
  } catch (error) {
    console.error('Error in GET /api/applicants:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update applicant status
router.put('/:id/status', requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Updating status to "${status}" for applicant ${id} in organization ${req.user.organization}`);

    if (!status) {
      console.error('Status update failed: Status is required');
      return res.status(400).json({ error: 'Status is required' });
    }

    const applicant = await applicantService.updateStatus(id, status, req.user.organization);
    console.log(`Successfully updated status for applicant ${id} to "${status}"`);
    res.json({ applicant });
  } catch (error) {
    console.error('Error in PUT /api/applicants/:id/status:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;