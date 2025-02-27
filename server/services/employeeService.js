const Employee = require('../models/Employee');

class EmployeeService {
  async getEmployeeById(employeeId, organizationId) {
    try {
      console.log(`Fetching employee ${employeeId} for organization ${organizationId}`);

      const employee = await Employee.findOne({
        _id: employeeId,
        organization: organizationId
      }).populate('team', 'name');

      if (!employee) {
        console.error(`Employee ${employeeId} not found`);
        throw new Error('Employee not found');
      }

      console.log('Employee data returned:', JSON.stringify(employee, null, 2));
      return employee;
    } catch (error) {
      console.error('Error in getEmployeeById:', error);
      throw new Error(error.message || 'Failed to fetch employee details');
    }
  }

  async createFromApplicant(applicant, teamId) {
    try {
      console.log(`Creating employee from applicant ${applicant._id}`);

      // Create the documents array properly
      const documents = [];

      // Add CV document
      if (applicant.cv && applicant.cvFileName) {
        documents.push({
          name: applicant.cvFileName,
          type: 'CV',
          url: applicant.cv
        });
      }

      // Add additional document if exists
      if (applicant.additionalFile && applicant.additionalFileName) {
        documents.push({
          name: applicant.additionalFileName,
          type: 'Additional',
          url: applicant.additionalFile
        });
      }

      const employee = new Employee({
        name: applicant.name,
        email: applicant.email,
        location: applicant.location,
        organization: applicant.organization,
        team: teamId,
        documents: documents
      });

      await employee.save();
      console.log(`Successfully created employee from applicant ${applicant._id}`);

      return employee;
    } catch (error) {
      console.error('Error in createFromApplicant:', error);
      throw new Error('Failed to create employee from applicant');
    }
  }
}

module.exports = new EmployeeService();