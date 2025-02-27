const JobPosting = require('../models/JobPosting');

class JobPostingService {
  async createJobPosting(organizationId, data) {
    try {
      console.log('Creating job posting with data:', {
        organizationId,
        data
      });
      const jobPosting = new JobPosting({
        ...data,
        organization: organizationId
      });
      console.log('Job posting model created:', jobPosting);
      await jobPosting.save();
      console.log('Job posting saved successfully:', jobPosting);
      return jobPosting;
    } catch (error) {
      console.error('Error in job posting service:', error);
      throw new Error(`Error creating job posting: ${error.message}`);
    }
  }

  async getJobPostings(organizationId) {
    try {
      return await JobPosting.find({ organization: organizationId })
        .populate('team', 'name')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching job postings: ${error.message}`);
    }
  }

  async getJobPostingById(organizationId, id) {
    try {
      const jobPosting = await JobPosting.findOne({
        _id: id,
        organization: organizationId
      }).populate('team', 'name');

      if (!jobPosting) {
        throw new Error('Job posting not found');
      }

      return jobPosting;
    } catch (error) {
      throw new Error(`Error fetching job posting: ${error.message}`);
    }
  }

  async archiveJobPosting(organizationId, jobPostingId) {
    console.log(`Archiving job posting ${jobPostingId} for organization ${organizationId}`);

    const jobPosting = await JobPosting.findOneAndUpdate(
      { _id: jobPostingId, organization: organizationId },
      { status: 'Archived' },
      { new: true }
    );

    if (!jobPosting) {
      throw new Error('Job posting not found');
    }

    return jobPosting;
  }
}

module.exports = new JobPostingService();