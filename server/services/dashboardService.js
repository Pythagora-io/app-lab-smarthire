const Applicant = require('../models/Applicant');

class DashboardService {
  /**
   * Get distribution of applicants across pipeline stages
   * @param {string} organizationId - The ID of the organization
   * @returns {Promise<Array>} Array of stage counts
   */
  async getApplicantDistribution(organizationId) {
    try {
      const stages = ['Applied', 'Screened', 'Interview', 'Offer', 'Hired'];

      const counts = await Promise.all(
        stages.map(async (stage) => {
          const count = await Applicant.countDocuments({
            organization: organizationId,
            status: stage
          });
          return { name: stage, count };
        })
      );

      return counts;
    } catch (error) {
      console.error('Error in getApplicantDistribution:', error);
      throw new Error('Failed to fetch applicant distribution');
    }
  }
}

module.exports = new DashboardService();