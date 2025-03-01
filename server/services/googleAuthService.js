const { SCOPES, createOAuth2Client } = require('../config/google');
const Organization = require('../models/Organization');

class GoogleAuthService {
  static getAuthUrl(redirectUri) {
    const oauth2Client = createOAuth2Client(redirectUri);
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });
  }

  static async getTokens(code, redirectUri) {
    try {
      const oauth2Client = createOAuth2Client(redirectUri);
      const { tokens } = await oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      console.error('Error getting Google tokens:', error);
      throw new Error('Failed to get Google tokens');
    }
  }

  static async saveRefreshToken(organizationId, refreshToken) {
    try {
      console.log(`Attempting to save refresh token for organization ${organizationId}`);
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        console.log('Organization not found');
        throw new Error('Organization not found');
      }

      console.log('Found organization, current refresh token:', organization.googleRefreshToken);
      organization.googleRefreshToken = refreshToken;
      const savedOrg = await organization.save();
      console.log('Saved organization with new refresh token:', savedOrg.googleRefreshToken);

      return organization;
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw new Error('Failed to save refresh token');
    }
  }

  static async revokeAccess(organizationId) {
    try {
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        throw new Error('Organization not found');
      }

      if (organization.googleRefreshToken) {
        oauth2Client.setCredentials({
          refresh_token: organization.googleRefreshToken
        });
        await oauth2Client.revokeToken(organization.googleRefreshToken);

        organization.googleRefreshToken = null;
        await organization.save();
      }

      return organization;
    } catch (error) {
      console.error('Error revoking access:', error);
      throw new Error('Failed to revoke Google access');
    }
  }

  static async validateAndUpdateSheetUrl(organizationId, sheetUrl) {
    try {
      console.log(`Validating sheet URL for organization ${organizationId}: ${sheetUrl}`);

      // Validate URL format
      if (!sheetUrl.includes('docs.google.com/spreadsheets')) {
        throw new Error('Invalid Google Sheets URL format');
      }

      // Extract sheet ID from URL
      const matches = sheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!matches) {
        throw new Error('Could not extract sheet ID from URL');
      }
      const sheetId = matches[1];

      // Mock sheet access verification
      // In production, this would actually verify access using Google Sheets API
      console.log(`Sheet ID ${sheetId} validated successfully`);

      // Update organization with sheet URL
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        throw new Error('Organization not found');
      }

      organization.googleSheetUrl = sheetUrl;
      await organization.save();

      return organization;
    } catch (error) {
      console.error('Error validating sheet URL:', error);
      throw error;
    }
  }
}

module.exports = GoogleAuthService;