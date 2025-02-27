const express = require('express');
const { requireUser } = require('./middleware/auth');
const GoogleAuthService = require('../services/googleAuthService');
const Organization = require('../models/Organization');
const GoogleSheetService = require('../services/googleSheetService');

const router = express.Router();

// Get Google OAuth URL
router.get('/auth-url', requireUser, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admins can access this endpoint' });
    }

    const url = GoogleAuthService.getAuthUrl();
    res.json({ url });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle OAuth callback - GET request from Google
router.get('/callback', (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('No code provided');
  }

  // Serve an HTML page that will post the code back to the parent window
  res.send(`
    <html>
      <body>
        <script>
          window.opener.postMessage(
            { type: 'GOOGLE_CALLBACK', code: '${code}' },
            'http://localhost:5173'
          );
        </script>
      </body>
    </html>
  `);
});

// Handle OAuth callback - POST request from frontend
router.post('/callback', requireUser, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admins can access this endpoint' });
    }

    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const tokens = await GoogleAuthService.getTokens(code);
    if (!tokens.refresh_token) {
      throw new Error('No refresh token received');
    }

    const organization = await GoogleAuthService.saveRefreshToken(
      req.user.organization,
      tokens.refresh_token
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).json({ error: error.message });
  }
});

// Revoke Google access
router.post('/revoke', requireUser, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admins can access this endpoint' });
    }

    await GoogleAuthService.revokeAccess(req.user.organization);
    res.json({ success: true });
  } catch (error) {
    console.error('Error revoking access:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update Google Sheet URL
router.post('/sheet-url', requireUser, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admins can access this endpoint' });
    }

    const { sheetUrl } = req.body;
    if (!sheetUrl) {
      return res.status(400).json({ error: 'Sheet URL is required' });
    }

    const organization = await GoogleAuthService.validateAndUpdateSheetUrl(
      req.user.organization,
      sheetUrl
    );

    res.json({ success: true, organization });
  } catch (error) {
    console.error('Error updating sheet URL:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get sheet headers
router.get('/sheet-headers', requireUser, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admin can access sheet headers' });
    }

    const organization = await Organization.findById(req.user.organization);
    if (!organization || !organization.googleSheetUrl) {
      return res.status(400).json({ error: 'Google Sheet URL not configured' });
    }

    const headers = await GoogleSheetService.getSheetHeaders(organization);
    console.log('Successfully fetched sheet headers for organization:', req.user.organization);
    res.json({ headers });
  } catch (error) {
    console.error('Error getting sheet headers:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Update column mapping
router.post('/column-mapping', requireUser, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admin can update column mapping' });
    }

    const { mapping } = req.body;
    if (!mapping || typeof mapping !== 'object') {
      return res.status(400).json({ error: 'Invalid mapping data' });
    }

    const organization = await Organization.findById(req.user.organization);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    organization.googleColumnMapping = new Map(Object.entries(mapping));
    await organization.save();

    console.log('Successfully updated column mapping for organization:', req.user.organization);
    res.json({ organization });
  } catch (error) {
    console.error('Error updating column mapping:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Start polling responses
router.post('/start-polling', requireUser, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admin can control polling' });
    }

    const organization = await Organization.findById(req.user.organization);

    // Check if all required columns are mapped
    const requiredFields = ['email', 'name', 'location', 'cv', 'additionalFile', 'position'];
    const mapping = organization.googleColumnMapping;

    const unmappedFields = requiredFields.filter(field => !mapping.get(field));
    if (unmappedFields.length > 0) {
      return res.status(400).json({
        error: `Please map all required columns first. Missing mappings: ${unmappedFields.join(', ')}`
      });
    }

    organization.isPollingEnabled = true;
    await organization.save();

    res.json({ success: true, message: 'Polling started successfully' });
  } catch (error) {
    console.error('Error starting polling:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stop polling
router.post('/stop-polling', requireUser, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admin can control polling' });
    }

    const organization = await Organization.findById(req.user.organization);

    // Check if polling is in progress
    if (GoogleSheetService.isPollingInProgress(organization._id)) {
      return res.status(409).json({
        error: 'Polling is currently in progress. Please try again once the current polling cycle completes.',
        pollingInProgress: true
      });
    }

    organization.isPollingEnabled = false;
    await organization.save();

    res.json({ success: true, message: 'Polling stopped successfully' });
  } catch (error) {
    console.error('Error stopping polling:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;