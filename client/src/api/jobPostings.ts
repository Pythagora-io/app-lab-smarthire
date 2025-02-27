import api from './api';
import { JobPosting } from './types';

// Description: Get all job postings
// Endpoint: GET /api/job-postings
// Request: {}
// Response: { jobPostings: JobPosting[] }
export const getJobPostings = async () => {
  try {
    const response = await api.get('/api/job-postings');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create new job posting
// Endpoint: POST /api/job-postings
// Request: { title: string, summary: string, description: string, requirements: string[], responsibilities: string[], team: string }
// Response: { jobPosting: JobPosting }
export const createJobPosting = async (data: {
  title: string;
  summary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  team: string;
}) => {
  try {
    const response = await api.post('/api/job-postings', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get job posting by ID
// Endpoint: GET /api/job-postings/:id
// Request: {}
// Response: { jobPosting: JobPosting }
export const getJobPostingById = async (id: string) => {
  try {
    const response = await api.get(`/api/job-postings/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get active job postings
// Endpoint: GET /api/job-postings/active
// Request: {}
// Response: { jobPostings: Array<JobPosting> }
export const getActiveJobPostings = async () => {
  try {
    const response = await api.get('/api/job-postings/active');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Archive job posting
// Endpoint: PUT /api/job-postings/:id/archive 
// Request: {}
// Response: { jobPosting: JobPosting }
export const archiveJobPosting = async (id: string) => {
  try {
    const response = await api.put(`/api/job-postings/${id}/archive`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};