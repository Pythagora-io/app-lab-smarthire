const express = require('express');
const router = express.Router();
const teamService = require('../services/teamService');
const { requireUser } = require('./middleware/auth');

// Create a new team
router.post('/', requireUser, async (req, res) => {
  try {
    console.log('POST /api/teams - Request body:', req.body);
    console.log('POST /api/teams - User:', {
      id: req.user._id,
      organization: req.user.organization
    });

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const team = await teamService.createTeam({ name }, req.user.organization);
    console.log('POST /api/teams - Created team:', team);
    res.status(201).json({ team });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all teams for organization
router.get('/', requireUser, async (req, res) => {
  try {
    const teams = await teamService.getTeams(req.user.organization);
    res.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get team employees
router.get('/:id/employees', requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    const employees = await teamService.getTeamEmployees(id, req.user.organization);
    res.json({ employees });
  } catch (error) {
    console.error('Error fetching team employees:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update team manager
router.put('/:id/manager', requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { managerId } = req.body;

    if (!managerId) {
      return res.status(400).json({ error: 'Manager ID is required' });
    }

    const team = await teamService.updateTeamManager(id, managerId, req.user.organization);
    res.json({ team });
  } catch (error) {
    console.error('Error updating team manager:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;