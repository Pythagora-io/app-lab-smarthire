const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');
const { requireUser } = require('./middleware/auth');

// GET /api/contracts
router.get('/', requireUser, async (req, res) => {
  try {
    console.log('Getting contracts', { user: req.user.email });
    const { teamId, search } = req.query;
    const contracts = await contractService.getContracts(
      req.user.organization,
      teamId,
      search
    );
    console.log('Retrieved contracts successfully');
    res.json({ contracts });
  } catch (error) {
    console.error('Failed to get contracts:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/contracts
router.post('/', requireUser, async (req, res) => {
  try {
    console.log('Creating new contract', {
      user: req.user.email,
      applicantId: req.body.applicantId,
      jobPostingId: req.body.jobPostingId,
      team: req.body.team
    });

    if (!req.body.applicantId || !req.body.jobPostingId || !req.body.salary || !req.body.type || !req.body.team) {
      throw new Error('Missing required contract fields');
    }

    if (isNaN(req.body.salary) || req.body.salary <= 0) {
      throw new Error('Invalid salary amount');
    }

    const validTypes = ['Full Time', 'Part Time', 'Contract'];
    if (!validTypes.includes(req.body.type)) {
      throw new Error('Invalid contract type');
    }

    const contract = await contractService.createContract({
      ...req.body,
      organization: req.user.organization
    });

    console.log('Contract created successfully', { contractId: contract._id });
    res.status(201).json({ contract });
  } catch (error) {
    console.error('Failed to create contract:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/contracts/:id
router.put('/:id', requireUser, async (req, res) => {
  try {
    console.log('Updating contract', {
      user: req.user.email,
      contractId: req.params.id,
      updates: req.body
    });

    const contract = await contractService.updateContract(
      req.params.id,
      req.user.organization,
      req.body
    );

    console.log('Contract updated successfully');
    res.json({ contract });
  } catch (error) {
    console.error('Failed to update contract:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;