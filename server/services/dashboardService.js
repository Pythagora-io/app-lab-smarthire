const Applicant = require('../models/Applicant');
const Team = require('../models/Team');
const Contract = require('../models/Contract');

class DashboardService {
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

  async getCurrentlyInterviewing(organizationId) {
    try {
      const count = await Applicant.countDocuments({
        organization: organizationId,
        status: 'Interview'
      });
      return count;
    } catch (error) {
      console.error('Error in getCurrentlyInterviewing:', error);
      throw new Error('Failed to fetch currently interviewing count');
    }
  }

  async getTeamsStats(organizationId) {
    try {
      // Get total teams
      const totalTeams = await Team.countDocuments({ organization: organizationId });

      // Get total employees by counting active contracts
      const totalEmployees = await Contract.countDocuments({
        organization: organizationId,
        status: 'Active'
      });

      // Get new hires this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const newHiresCount = await Contract.countDocuments({
        organization: organizationId,
        createdAt: { $gte: startOfMonth }
      });

      return {
        totalTeams,
        totalEmployees,
        newHiresCount
      };
    } catch (error) {
      console.error('Error in getTeamsStats:', error);
      throw new Error('Failed to fetch teams statistics');
    }
  }
}

module.exports = new DashboardService();