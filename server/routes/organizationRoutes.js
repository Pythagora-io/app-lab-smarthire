const express = require('express');
const { requireUser } = require('./middleware/auth');
const OrganizationService = require('../services/organizationService');

const router = express.Router();

// Get organization details
router.get('/', requireUser, async (req, res) => {
  try {
    const organizationId = req.user.organization;
    console.log(`Getting organization details for organization ID: ${organizationId}`);

    const organization = await OrganizationService.getOrganizationWithUsers(organizationId);
    console.log('Organization details retrieved:', {
      name: organization.name,
      hasGoogleRefreshToken: !!organization.googleRefreshToken,
      userCount: organization.users?.length
    });

    res.json({ organization });
  } catch (error) {
    console.error('Error getting organization:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update organization
router.put('/', requireUser, async (req, res) => {
  try {
    const organizationId = req.user.organization;
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Organization name is required' });
    }

    const organization = await OrganizationService.updateOrganization(organizationId, { name });
    res.json({ organization });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new user in organization
router.post('/users', requireUser, async (req, res) => {
  try {
    // Only admin can create users
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admin can create users' });
    }

    const organizationId = req.user.organization;
    const { email, password, name, role } = req.body;

    // Validate required fields
    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: 'Email, password, name and role are required' });
    }

    // Validate role
    const validRoles = ['Admin', 'HR Admin', 'Hiring Manager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await OrganizationService.createUser(organizationId, {
      email,
      password,
      name,
      role
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user role
router.put('/users/:id', requireUser, async (req, res) => {
  try {
    // Only admin can update user roles
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admin can update user roles' });
    }

    const organizationId = req.user.organization;
    const userId = req.params.id;
    const { role } = req.body;

    // Validate role
    const validRoles = ['Admin', 'HR Admin', 'Hiring Manager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await OrganizationService.updateUserRole(organizationId, userId, role);
    res.json({ user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;