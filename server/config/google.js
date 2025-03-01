const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];

// Create separate OAuth2 clients for different environments
const createOAuth2Client = (redirectUri) => {
  return new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
};

// Export the function to create OAuth2 client with dynamic redirect URI
module.exports = {
  SCOPES,
  createOAuth2Client
};