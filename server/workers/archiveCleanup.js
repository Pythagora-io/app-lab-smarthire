const cron = require('node-cron');
const JobPosting = require('../models/JobPosting');
const Applicant = require('../models/Applicant');
const Contract = require('../models/Contract');

// Run every hour
const cleanupArchived = cron.schedule('0 * * * *', async () => {
  try {
    console.log('Running archive cleanup job');

    // Get all archived job postings
    const archivedPostings = await JobPosting.find({ status: 'Archived' });

    for (const posting of archivedPostings) {
      console.log(`Processing archived posting: ${posting._id}`);

      // Check if posting has any contracts
      const hasContracts = await Contract.exists({ jobPosting: posting._id });

      if (!hasContracts) {
        // If no contracts exist, delete all applicants and the posting
        console.log(`No contracts found for posting ${posting._id}, deleting applicants and posting`);
        await Applicant.deleteMany({ jobPosting: posting._id });
        await JobPosting.deleteOne({ _id: posting._id });
      } else {
        // If contracts exist, only delete non-hired applicants
        console.log(`Contracts found for posting ${posting._id}, deleting only non-hired applicants`);
        await Applicant.deleteMany({
          jobPosting: posting._id,
          status: { $ne: 'Hired' }
        });
      }
    }
  } catch (error) {
    console.error('Error in archive cleanup job:', error);
  }
});

module.exports = cleanupArchived;