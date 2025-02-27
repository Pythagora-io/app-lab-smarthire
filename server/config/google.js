const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID, // INPUT_REQUIRED {Your Google OAuth client ID from Google Cloud Console} 
  process.env.GOOGLE_CLIENT_SECRET, // INPUT_REQUIRED {Your Google OAuth client secret from Google Cloud Console}
  process.env.GOOGLE_REDIRECT_URI // INPUT_REQUIRED {Your Google OAuth redirect URI (e.g. http://localhost:5173/google-callback)}
);

module.exports = {
  oauth2Client,
  SCOPES
};