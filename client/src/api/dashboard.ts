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