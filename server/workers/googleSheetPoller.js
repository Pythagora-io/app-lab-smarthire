const cron = require('node-cron');
const Organization = require('../models/Organization');
const GoogleSheetService = require('../services/googleSheetService');

// Run every 5 minutes
const pollGoogleSheets = cron.schedule('*/1 * * * *', async () => {
  try {
    console.log('Running Google Sheets polling job');

    const organizations = await Organization.find({
      googleRefreshToken: { $exists: true, $ne: null }, 
      googleSheetUrl: { $exists: true, $ne: null },
      googleColumnMapping: { $exists: true, $ne: null },
      isPollingEnabled: true
    });

    for (const organization of organizations) {
      try {
        await GoogleSheetService.processNewResponses(organization);
      } catch (error) {
        console.error(`Error processing responses for organization ${organization._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in Google Sheets polling job:', error);
  }
});

module.exports = pollGoogleSheets;