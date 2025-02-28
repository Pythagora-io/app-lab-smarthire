const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboardService');
const { requireUser } = require('./middleware/auth');

router.get('/applicant-distribution', requireUser, async (req, res) => {
  try {
    const distribution = await dashboardService.getApplicantDistribution(req.user.organization);
    res.json({ distribution });
  } catch (error) {
    console.error('Error in GET /api/dashboard/applicant-distribution:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/currently-interviewing', requireUser, async (req, res) => {
  try {
    const count = await dashboardService.getCurrentlyInterviewing(req.user.organization);
    res.json({ count });
  } catch (error) {
    console.error('Error in GET /api/dashboard/currently-interviewing:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/teams-stats', requireUser, async (req, res) => {
  try {
    const stats = await dashboardService.getTeamsStats(req.user.organization);
    res.json(stats);
  } catch (error) {
    console.error('Error in GET /api/dashboard/teams-stats:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;