import api from './api';
import { Applicant } from './types';

// Description: Get all applicants
// Endpoint: GET /api/applicants
// Request: {}
// Response: { applicants: Applicant[] }
export const getApplicants = async () => {
  try {
    const response = await api.get('/api/applicants');
    return response.data;
  } catch (error) {
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