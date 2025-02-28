import api from './api';

// Description: Get applicant distribution across pipeline stages
// Endpoint: GET /api/dashboard/applicant-distribution
// Request: {}
// Response: { distribution: Array<{ name: string, count: number }> }
export const getApplicantDistribution = async () => {
  try {
    const response = await api.get('/api/dashboard/applicant-distribution');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get currently interviewing count
// Endpoint: GET /api/dashboard/currently-interviewing
// Request: {}
// Response: { count: number }
export const getCurrentlyInterviewing = async () => {
  try {
    const response = await api.get('/api/dashboard/currently-interviewing');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get teams dashboard statistics
// Endpoint: GET /api/dashboard/teams-stats
// Request: {}
// Response: { totalTeams: number, totalEmployees: number, newHiresCount: number }
export const getTeamsStats = async () => {
  try {
    const response = await api.get('/api/dashboard/teams-stats');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};