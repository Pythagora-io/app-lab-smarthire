const Contract = require('../models/Contract');
const employeeService = require('./employeeService');

class ContractService {
  async getContracts(organizationId, teamId, search) {
    try {
      console.log(`Fetching contracts for organization ${organizationId}, team ${teamId}, search "${search}"`);

      let query = { organization: organizationId };

      if (teamId) {
        query.team = teamId;
      }

      // Get base query
      let contractsQuery = Contract.find(query)
        .populate({
          path: 'employee',
          select: 'name email'
        })
        .populate({
          path: 'jobPosting',
          select: 'title'
        })
        .populate({
          path: 'team',
          select: 'name'
        })
        .sort('-createdAt');

      // If search is provided, add search conditions
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        contractsQuery = contractsQuery.populate({
          path: 'employee',
          match: { name: searchRegex },
          select: 'name email'
        });
      }

      // Execute query
      let contracts = await contractsQuery.exec();

      // Filter out contracts where employee is null (due to search criteria)
      if (search) {
        contracts = contracts.filter(contract => contract.employee !== null);
      }

      console.log(`Found ${contracts.length} contracts matching criteria`);

      // Transform the data to match the frontend expected format
      const transformedContracts = contracts.map(contract => {
        if (!contract.employee || !contract.jobPosting || !contract.team) {
          console.error('Invalid contract data:', contract);
          throw new Error('Contract data is missing required relationships');
        }

        return {
          _id: contract._id,
          employee: {
            _id: contract.employee._id,
            name: contract.employee.name,
            email: contract.employee.email
          },
          jobPosting: contract.jobPosting.title,
          salary: contract.salary,
          type: contract.type,
          status: contract.status,
          startDate: contract.startDate,
          team: {
            _id: contract.team._id,
            name: contract.team.name
          }
        };
      });

      console.log('Successfully transformed contract data');
      return transformedContracts;

    } catch (error) {
      console.error('Error in getContracts:', error.stack);
      throw new Error('Failed to fetch contracts');
    }
  }

  async createContract(contractData) {
    try {
      console.log('Creating new contract with data:', contractData);

      if (!contractData.applicantId || !contractData.jobPostingId || !contractData.salary || !contractData.type || !contractData.team) {
        console.error('Missing required contract data:', contractData);
        throw new Error('Missing required contract fields');
      }

      if (isNaN(contractData.salary) || contractData.salary <= 0) {
        console.error('Invalid salary value:', contractData.salary);
        throw new Error('Invalid salary amount');
      }

      const validTypes = ['Full Time', 'Part Time', 'Contract'];
      if (!validTypes.includes(contractData.type)) {
        console.error('Invalid contract type:', contractData.type);
        throw new Error('Invalid contract type');
      }

      // Verify job posting exists
      const jobPosting = await require('../models/JobPosting').findById(contractData.jobPostingId);
      if (!jobPosting) {
        console.error('Job posting not found:', contractData.jobPostingId);
        throw new Error('Job posting not found');
      }

      // Get applicant data
      const Applicant = require('../models/Applicant');
      const applicant = await Applicant.findById(contractData.applicantId);
      if (!applicant) {
        throw new Error('Applicant not found');
      }

      // Create employee from applicant
      const employee = await employeeService.createFromApplicant(applicant, contractData.team);

      const contract = new Contract({
        employee: employee._id,
        jobPosting: contractData.jobPostingId,
        salary: contractData.salary,
        type: contractData.type,
        status: 'Active',
        startDate: new Date(),
        team: contractData.team,
        organization: contractData.organization._id
      });

      const savedContract = await contract.save();
      console.log('Contract created successfully:', savedContract._id);

      return savedContract;

    } catch (error) {
      console.error('Error in createContract:', error.stack);
      throw new Error(`Failed to create contract: ${error.message}`);
    }
  }

  async updateContract(contractId, organizationId, updateData) {
    try {
      console.log(`Updating contract ${contractId} with data:`, updateData);

      // Validate the contract exists and belongs to the organization
      const contract = await Contract.findOne({
        _id: contractId,
        organization: organizationId
      });

      if (!contract) {
        console.error(`Contract ${contractId} not found`);
        throw new Error('Contract not found');
      }

      // Validate salary if provided
      if (updateData.salary !== undefined) {
        if (isNaN(updateData.salary) || updateData.salary <= 0) {
          console.error('Invalid salary value:', updateData.salary);
          throw new Error('Invalid salary amount');
        }
      }

      // Validate type if provided
      if (updateData.type) {
        const validTypes = ['Full Time', 'Part Time', 'Contract'];
        if (!validTypes.includes(updateData.type)) {
          console.error('Invalid contract type:', updateData.type);
          throw new Error('Invalid contract type');
        }
      }

      // Validate status if provided
      if (updateData.status) {
        const validStatuses = ['Active', 'On Hold', 'Terminated'];
        if (!validStatuses.includes(updateData.status)) {
          console.error('Invalid contract status:', updateData.status);
          throw new Error('Invalid contract status');
        }
      }

      // Update only allowed fields
      const allowedUpdates = {
        salary: updateData.salary,
        type: updateData.type,
        status: updateData.status
      };

      // Remove undefined values
      Object.keys(allowedUpdates).forEach(key =>
        allowedUpdates[key] === undefined && delete allowedUpdates[key]
      );

      const updatedContract = await Contract.findByIdAndUpdate(
        contractId,
        allowedUpdates,
        { new: true }
      )
      .populate('employee', 'name email')
      .populate('jobPosting', 'title')
      .populate('team', 'name');

      console.log('Contract updated successfully:', updatedContract._id);

      // Transform to match frontend format
      return {
        _id: updatedContract._id,
        employee: {
          _id: updatedContract.employee._id,
          name: updatedContract.employee.name,
          email: updatedContract.employee.email
        },
        jobPosting: updatedContract.jobPosting.title,
        salary: updatedContract.salary,
        type: updatedContract.type,
        status: updatedContract.status,
        startDate: updatedContract.startDate,
        team: {
          _id: updatedContract.team._id,
          name: updatedContract.team.name
        }
      };

    } catch (error) {
      console.error('Error in updateContract:', error);
      throw new Error(error.message || 'Failed to update contract');
    }
  }
}

module.exports = new ContractService();