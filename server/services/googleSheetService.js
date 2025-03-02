const { google } = require('googleapis');
const { SCOPES, createOAuth2Client } = require('../config/google');
const Organization = require('../models/Organization');
const Applicant = require('../models/Applicant');
const { parseISO, isAfter } = require('date-fns');

class GoogleSheetService {
  static pollingInProgress = new Map();

  static async getSheetHeaders(organization) {
    try {
      // First check if we have the necessary credentials
      if (!organization.googleRefreshToken) {
        throw new Error('Please connect your Google account to access Google Sheets integration. Click the "Connect" button in the Google Sheets section to get started.');
      }

      if (!organization.googleSheetUrl) {
        throw new Error('Please enter a Google Sheet URL before attempting to fetch headers.');
      }

      const redirectUri = process.env.NODE_ENV === 'production'
        ? process.env.GOOGLE_REDIRECT_URI_PROD
        : process.env.GOOGLE_REDIRECT_URI_DEV;

      const oauth2Client = createOAuth2Client(redirectUri);
      oauth2Client.setCredentials({
        refresh_token: organization.googleRefreshToken
      });

      // Create sheets client
      const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

      // Extract sheet ID from URL
      const sheetId = organization.googleSheetUrl.match(/\/d\/(.*?)(\/|$)/)[1];

      // Get first row (headers)
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'A1:Z1', // First row, multiple columns
      });

      return response.data.values[0];
    } catch (error) {
      // If it's our custom error, pass it through
      if (error.message.includes('Please connect your Google account') ||
          error.message.includes('Please enter a Google Sheet URL')) {
        throw error;
      }

      if (error.message.includes('invalid_grant')) {
        throw new Error('Your Google account connection has expired. Please disconnect and reconnect your Google account to continue.');
      }

      console.error('Error fetching sheet headers:', error);
      throw new Error('Failed to fetch sheet headers: ' + error.message);
    }
  }

  static async getNewResponses(organization) {
    try {
      const redirectUri = process.env.NODE_ENV === 'production'
        ? process.env.GOOGLE_REDIRECT_URI_PROD
        : process.env.GOOGLE_REDIRECT_URI_DEV;

      const oauth2Client = createOAuth2Client(redirectUri);
      oauth2Client.setCredentials({
        refresh_token: organization.googleRefreshToken
      });

      const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

      // Extract sheet ID from URL
      const sheetId = organization.googleSheetUrl.match(/\/d\/(.*?)(\/|$)/)[1];
      console.log('Getting responses from sheet:', sheetId);

      // Get values (including headers)
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'A1:Z',  // Full range to get all data
      });

      console.log('Raw sheet data:', {
        totalRows: response.data.values?.length,
        headers: response.data.values?.[0],
        firstDataRow: response.data.values?.[1],
      });

      // Skip header row and convert to objects
      const rows = response.data.values.slice(1).map(row => {
        const rowObj = {};
        response.data.values[0].forEach((header, index) => {
          rowObj[header] = row[index] || '';
        });
        return rowObj;
      });

      console.log('Processed sheet rows:', {
        count: rows.length,
        firstRow: rows[0],
        mapping: organization.googleColumnMapping,
      });

      return rows;
    } catch (error) {
      // Handle invalid/expired token specifically
      if (error.message.includes('invalid_grant')) {
        // Reset organization's Google integration
        await Organization.findByIdAndUpdate(organization._id, {
          $set: {
            googleRefreshToken: null,
            isPollingEnabled: false
          }
        });
        throw new Error('Google access token has expired. Please reconnect your Google account.');
      }
      console.error('Error fetching sheet responses:', error);
      throw new Error('Failed to fetch sheet responses: ' + error.message);
    }
  }

  static async processNewResponses(organization) {
    this.pollingInProgress.set(organization._id.toString(), true);

    try {
      const responses = await this.getNewResponses(organization);
      const mapping = organization.googleColumnMapping;

      console.log('Processing responses with mapping:', {
        responseCount: responses.length,
        firstResponse: responses[0],
        mapping: Object.fromEntries(mapping),
      });

      // Get all active job postings for this organization
      const JobPosting = require('../models/JobPosting');
      const activeJobPostings = await JobPosting.find({
        organization: organization._id,
        status: { $ne: 'Archived' } // Changed from status: 'Active' to exclude archived
      });

      if (!activeJobPostings.length) {
        throw new Error('No active job postings found for organization');
      }

      // Create a map of normalized titles to job posting ids for efficient lookup
      const jobPostingMap = new Map(
        activeJobPostings.map(jp => [
          jp.title.toLowerCase().trim(),
          jp._id
        ])
      );

      for (const response of responses) {
        // Basic applicant data
        const baseApplicantData = {
          organization: organization._id,
          email: response[mapping.get('email')] || '',
          name: response[mapping.get('name')] || '',
          location: response[mapping.get('location')] || '',
          cv: response[mapping.get('cv')] || '',
          cvFileName: 'Resume from Google Forms',
          additionalFile: response[mapping.get('additionalFile')] || '',
          additionalFileName: 'Additional Document from Google Forms',
          status: 'Applied'
        };

        console.log('Processing response:', {
          raw: response,
          mapped: baseApplicantData,
          mappingKeys: Array.from(mapping.keys()),
          mappingValues: Array.from(mapping.values()),
        });

        // Validate required fields
        if (!baseApplicantData.email || !baseApplicantData.name ||
            !baseApplicantData.location || !baseApplicantData.cv) {
          console.warn('Skipping invalid applicant data:', {
            data: baseApplicantData,
            validation: {
              hasEmail: !!baseApplicantData.email,
              hasName: !!baseApplicantData.name,
              hasLocation: !!baseApplicantData.location,
              hasCV: !!baseApplicantData.cv,
            }
          });
          continue;
        }

        // Get positions from response and normalize them
        const positions = (response[mapping.get('position')] || '')
          .split(',')
          .map(p => p.toLowerCase().trim())
          .filter(p => p.length > 0);

        console.log('Processing positions for applicant:', {
          email: baseApplicantData.email,
          positions,
          availablePositions: Array.from(jobPostingMap.keys())
        });

        // Match positions with job postings
        const matchedJobPostings = positions
          .map(position => jobPostingMap.get(position))
          .filter(id => id); // Remove undefined matches

        if (matchedJobPostings.length === 0) {
          console.warn(
            'No matching job postings found for positions:',
            positions,
            'Available positions:',
            Array.from(jobPostingMap.keys())
          );
          continue;
        }

        // Create an application for each matched job posting
        for (const jobPostingId of matchedJobPostings) {
          const applicantData = {
            ...baseApplicantData,
            jobPosting: jobPostingId,
            position: [positions.find(p =>
              jobPostingMap.get(p) === jobPostingId
            )]
          };

          // Check if applicant already exists for this job posting
          const existingApplicant = await Applicant.findOne({
            organization: organization._id,
            email: applicantData.email,
            jobPosting: jobPostingId
          });

          if (!existingApplicant) {
            const created = await Applicant.create(applicantData);
            console.log('Created new applicant:', {
              email: created.email,
              jobPosting: created.jobPosting,
              position: created.position
            });
          }
        }
      }
    } catch (error) {
      console.error('Error processing responses:', error);
      throw error;
    } finally {
      this.pollingInProgress.delete(organization._id.toString());
    }
  }

  static isPollingInProgress(organizationId) {
    return this.pollingInProgress.get(organizationId.toString()) === true;
  }
}

module.exports = GoogleSheetService;