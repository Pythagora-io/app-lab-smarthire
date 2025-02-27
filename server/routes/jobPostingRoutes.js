const express = require('express');
const router = express.Router();
const jobPostingService = require('../services/jobPostingService');
const { requireUser, requireRole } = require('./middleware/auth');

// Read-only access for all authenticated users
router.get('/', requireUser, async (req, res) => {
  try {
    const jobPostings = await jobPostingService.getJobPostings(req.user.organization);
    res.json({ jobPostings });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/active', requireUser, async (req, res) => {
  try {
    console.log('Fetching active job postings for organization:', req.user.organization);
    const jobPostings = await jobPostingService.getJobPostings(req.user.organization, { status: 'Active' });
    console.log('Found active job postings:', jobPostings.length);
    res.json({ jobPostings });
  } catch (error) {
    console.error('Error fetching active job postings:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', requireUser, async (req, res) => {
  try {
    const jobPosting = await jobPostingService.getJobPostingById(
      req.user.organization,
      req.params.id
    );
    res.json({ jobPosting });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Only Admin and HR Admin can create/archive
router.post('/', requireUser, requireRole(['Admin', 'HR Admin']), async (req, res) => {
  try {
    console.log('Received job posting creation request:', {
      body: req.body,
      user: req.user,
      organization: req.user.organization
    });
    const jobPosting = await jobPostingService.createJobPosting(
      req.user.organization,
      req.body
    );
    console.log('Job posting created successfully:', jobPosting);
    res.status(201).json({ jobPosting });
  } catch (error) {
    console.error('Error creating job posting:', error);
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/archive', requireUser, requireRole(['Admin', 'HR Admin']), async (req, res) => {
  try {
    console.log('Archiving job posting:', req.params.id);
    const jobPosting = await jobPostingService.archiveJobPosting(
      req.user.organization,
      req.params.id
    );
    console.log('Job posting archived successfully:', jobPosting);
    res.json({ jobPosting });
  } catch (error) {
    console.error('Error archiving job posting:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;