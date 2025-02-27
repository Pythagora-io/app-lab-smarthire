const express = require('express');
const router = express.Router();
const employeeService = require('../services/employeeService');
const { requireUser } = require('./middleware/auth');

// GET /api/contracts/employee/:id
router.get('/:id', requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Getting employee details for ${id}`);

    const employee = await employeeService.getEmployeeById(id, req.user.organization);

    res.json({ employee });
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;