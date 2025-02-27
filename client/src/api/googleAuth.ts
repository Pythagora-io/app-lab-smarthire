import api from './api';

// Description: Get Google OAuth URL
// Endpoint: GET /api/google/auth-url
// Request: {}
// Response: { url: string }
export const getGoogleAuthUrl = async () => {
  try {
    const response = await api.get('/api/google/auth-url');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Send OAuth callback code
// Endpoint: POST /api/google/callback
// Request: { code: string }
// Response: { success: boolean }
export const handleGoogleCallback = async (code: string) => {
  try {
    const response = await api.post('/api/google/callback', { code });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Revoke Google access
// Endpoint: POST /api/google/revoke
// Request: {}
// Response: { success: boolean }
export const revokeGoogleAccess = async () => {
  try {
    const response = await api.post('/api/google/revoke');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update Google Sheet URL
// Endpoint: POST /api/google/sheet-url
// Request: { sheetUrl: string }
// Response: { success: boolean, organization: Organization }
export const updateGoogleSheetUrl = async (sheetUrl: string) => {
  try {
    const response = await api.post('/api/google/sheet-url', { sheetUrl });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get Google Sheet headers
// Endpoint: GET /api/google/sheet-headers
// Request: {}
// Response: { headers: string[] }
export const getGoogleSheetHeaders = async () => {
  try {
    const response = await api.get('/api/google/sheet-headers');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update column mapping
// Endpoint: POST /api/google/column-mapping
// Request: { mapping: Record<string, string> }
// Response: { organization: Organization }
export const updateColumnMapping = async (mapping: Record<string, string>) => {
  try {
    const response = await api.post('/api/google/column-mapping', { mapping });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Start polling for responses
// Endpoint: POST /api/google/start-polling
// Request: {}
// Response: { success: boolean }
export const startPolling = async () => {
  try {
    const response = await api.post('/api/google/start-polling');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Stop polling for responses
// Endpoint: POST /api/google/stop-polling
// Request: {}
// Response: { success: boolean }
export const stopPolling = async () => {
  try {
    const response = await api.post('/api/google/stop-polling');
    return response.data;
  } catch (error) {
    if (error?.response?.data?.pollingInProgress) {
      throw new Error('Polling is currently in progress. Please try again once the current polling cycle completes.');
    }
    throw new Error(error?.response?.data?.error || error.message);
  }
};