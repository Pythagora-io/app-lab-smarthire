const cron = require('node-cron');
const Organization = require('../models/Organization');
const GoogleSheetService = require('../services/googleSheetService');

// Run every 5 minutes
const pollGoogleSheets = cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Running Google Sheets polling job');

    // Add log to see query conditions
    const query = {
      googleRefreshToken: { $ne: null },
      googleSheetUrl: { $ne: null },
      googleColumnMapping: { $ne: null },
      isPollingEnabled: true
    };
    console.log('Polling query conditions:', JSON.stringify(query));

    const organizations = await Organization.find(query);

    // Add log to see what organizations were found
    console.log('Found organizations for polling:', organizations.map(org => ({
      id: org._id,
      name: org.name,
      hasRefreshToken: !!org.googleRefreshToken,
      hasSheetUrl: !!org.googleSheetUrl,
      hasMapping: !!org.googleColumnMapping,
      isPollingEnabled: org.isPollingEnabled
    })));

    for (const organization of organizations) {
      try {
        console.log(`Processing organization ${organization._id}:`, {
          refreshToken: !!organization.googleRefreshToken,
          sheetUrl: !!organization.googleSheetUrl,
          mappingSize: organization.googleColumnMapping ? Object.keys(organization.googleColumnMapping).length : 0
        });

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