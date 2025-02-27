const Organization = require('../models/Organization');
const User = require('../models/User');
const { generatePasswordHash } = require('../utils/password');

class OrganizationService {
  static async getOrganizationWithUsers(organizationId) {
    try {
      console.log(`Getting organization details for organizationId: ${organizationId}`);

      const organization = await Organization.findById(organizationId);
      if (!organization) {
        console.error(`Organization not found for id: ${organizationId}`);
        throw new Error('Organization not found');
      }

      console.log(`Found organization: ${organization.name}`);

      // Get all users for this organization
      const users = await User.find({ organization: organizationId })
        .select('-password -refreshToken')
        .lean();

      console.log(`Found ${users.length} users for organization`);

      // Convert Map to plain object for serialization
      const columnMapping = {};
      if (organization.googleColumnMapping) {
        for (const [key, value] of organization.googleColumnMapping.entries()) {
          columnMapping[key] = value;
        }
      }

      return {
        _id: organization._id,
        name: organization.name,
        googleRefreshToken: organization.googleRefreshToken,
        googleSheetUrl: organization.googleSheetUrl,
        googleColumnMapping: columnMapping,
        isPollingEnabled: organization.isPollingEnabled,
        createdAt: organization.createdAt,
        users: users
      };
    } catch (error) {
      console.error('Error in getOrganizationWithUsers:', error);
      throw error;
    }
  }

  static async updateOrganization(organizationId, updates) {
    try {
      console.log(`Updating organization ${organizationId} with:`, updates);

      const organization = await Organization.findById(organizationId);
      if (!organization) {
        console.error(`Organization not found for id: ${organizationId}`);
        throw new Error('Organization not found');
      }

      organization.name = updates.name;
      await organization.save();

      console.log(`Successfully updated organization ${organizationId}`);

      // Get all users for this organization to maintain consistent response format
      const users = await User.find({ organization: organizationId })
        .select('-password -refreshToken')
        .lean();

      return {
        _id: organization._id,
        name: organization.name,
        users: users
      };
    } catch (error) {
      console.error('Error in updateOrganization:', error);
      throw error;
    }
  }

  static async createUser(organizationId, { email, password, name, role }) {
    try {
      console.log(`Creating new user in organization ${organizationId}`);

      // Check if organization exists
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        throw new Error('Organization not found');
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create password hash
      const hash = await generatePasswordHash(password);

      // Create new user
      const user = new User({
        email,
        password: hash,
        name,
        organization: organizationId,
        role
      });

      await user.save();

      // Return user without sensitive data
      const userObject = user.toObject();
      delete userObject.password;
      delete userObject.refreshToken;

      console.log(`Successfully created user ${user._id} in organization ${organizationId}`);

      return userObject;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  static async updateUserRole(organizationId, userId, role) {
    try {
      console.log(`Updating role for user ${userId} in organization ${organizationId} to ${role}`);

      // Find user and verify they belong to the organization
      const user = await User.findOne({ _id: userId, organization: organizationId });
      if (!user) {
        throw new Error('User not found in this organization');
      }

      // Update role
      user.role = role;
      await user.save();

      // Return user without sensitive data
      const userObject = user.toObject();
      delete userObject.password;
      delete userObject.refreshToken;

      console.log(`Successfully updated role for user ${userId}`);

      return userObject;
    } catch (error) {
      console.error('Error in updateUserRole:', error);
      throw error;
    }
  }
}

module.exports = OrganizationService;