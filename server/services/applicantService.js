const Applicant = require('../models/Applicant');

class ApplicantService {
  /**
   * Get all applicants for an organization
   * @param {string} organizationId - The ID of the organization
   * @returns {Promise<Array>} Array of applicants
   */
  async getApplicants(organizationId) {
    try {
      const applicants = await Applicant.find({ organization: organizationId })
        .populate('jobPosting', 'title')
        .sort({ createdAt: -1 });
      return applicants;
    } catch (error) {
      console.error('Error in getApplicants:', error);
      throw new Error('Failed to fetch applicants');
    }
  }

  /**
   * Update applicant status
   * @param {string} applicantId - The ID of the applicant
   * @param {string} status - The new status
   * @param {string} organizationId - The ID of the organization
   * @returns {Promise<Object>} Updated applicant
   */
  async updateStatus(applicantId, status, organizationId) {
    try {
      console.log(`Updating status for applicant ${applicantId} to ${status}`);
      
      const applicant = await Applicant.findOne({
        _id: applicantId,
        organization: organizationId
      });

      if (!applicant) {
        console.error(`Applicant not found with id ${applicantId} for organization ${organizationId}`);
        throw new Error('Applicant not found');
      }

      // Validate status is one of the allowed values
      const allowedStatuses = ['Applied', 'Screened', 'Interview', 'Offer', 'Hired', 'Rejected'];
      if (!allowedStatuses.includes(status)) {
        console.error(`Invalid status ${status} provided. Allowed values: ${allowedStatuses.join(', ')}`);
        throw new Error('Invalid status');
      }

      applicant.status = status;
      await applicant.save();

      console.log(`Successfully updated status for applicant ${applicantId} to ${status}`);
      return applicant;
    } catch (error) {
      console.error('Error in updateStatus:', error);
      throw new Error(error.message || 'Failed to update applicant status');
    }
  }
}

module.exports = new ApplicantService();