import api from './api';
import { Applicant } from './types';

// Description: Get a list of applicants
// Endpoint: GET /api/applicants
// Request: {}
// Response: { applicants: Array<Applicant> }
export const getApplicants = async () => {
  try {
    console.log('Calling getApplicants API');
    const response = await api.get('/api/applicants');
    console.log('getApplicants API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getApplicants:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update applicant status
// Endpoint: PUT /api/applicants/:id/status
// Request: { status: string }
// Response: { applicant: Applicant }
export const updateApplicantStatus = async (id: string, status: Applicant['status']) => {
  try {
    const response = await api.put(`/api/applicants/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Assign hiring manager to applicant
// Endpoint: PUT /api/applicants/:id/hiring-manager
// Request: { hiringManagerId: string }
// Response: { applicant: Applicant }
export const assignHiringManager = async (id: string, hiringManagerId: string) => {
  try {
    const response = await api.put(`/api/applicants/${id}/hiring-manager`, { hiringManagerId });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};