const Applicant = require('../models/Applicant');

class ApplicantService {
  /**
   * Get all applicants for an organization based on user role
   * @param {string} organizationId - The ID of the organization
   * @param {Object} user - The user object with role and id
   * @returns {Promise<Array>} Array of applicants
   */
  async getApplicants(organizationId, user) {
    try {
      let query = { organization: organizationId };

      // If user is a Hiring Manager, only show applicants assigned to them
      if (user.role === 'Hiring Manager') {
        query.hiringManager = user._id;
      }

      const applicants = await Applicant.find(query)
        .populate('jobPosting', 'title')
        .populate('hiringManager', 'name email')
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
   * @param {Object} user - The user object with role and id
   * @returns {Promise<Object>} Updated applicant
   */
  async updateStatus(applicantId, status, organizationId, user) {
    try {
      console.log(`Updating status for applicant ${applicantId} to ${status}`);

      const query = {
        _id: applicantId,
        organization: organizationId,
      };

      // If user is a Hiring Manager, ensure they can only update their assigned applicants
      if (user.role === 'Hiring Manager') {
        query.hiringManager = user._id;
      }

      const applicant = await Applicant.findOne(query);

      if (!applicant) {
        console.error(`Applicant not found with id ${applicantId} for organization ${organizationId}`);
        throw new Error('Applicant not found or access denied');
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

  /**
   * Assign hiring manager to applicant
   * @param {string} applicantId - The ID of the applicant
   * @param {string} hiringManagerId - The ID of the hiring manager
   * @param {string} organizationId - The ID of the organization
   * @param {Object} user - The user making the request
   * @returns {Promise<Object>} Updated applicant
   */
  async assignHiringManager(applicantId, hiringManagerId, organizationId, user) {
    try {
      console.log(`Assigning hiring manager ${hiringManagerId} to applicant ${applicantId}`);

      // Verify user is HR Admin
      if (user.role !== 'HR Admin' && user.role !== 'Admin') {
        throw new Error('Only HR Admin can assign hiring managers');
      }

      const applicant = await Applicant.findOne({
        _id: applicantId,
        organization: organizationId
      });

      if (!applicant) {
        throw new Error('Applicant not found');
      }

      applicant.hiringManager = hiringManagerId;
      await applicant.save();

      const populatedApplicant = await Applicant.findById(applicant._id)
        .populate('jobPosting', 'title')
        .populate('hiringManager', 'name email');

      console.log(`Successfully assigned hiring manager to applicant ${applicantId}`);
      return populatedApplicant;
    } catch (error) {
      console.error('Error in assignHiringManager:', error);
      throw new Error(error.message || 'Failed to assign hiring manager');
    }
  }
}

module.exports = new ApplicantService();