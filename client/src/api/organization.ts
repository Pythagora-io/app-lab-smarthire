import api from './api';
import { Organization, User } from './types';

// Description: Get organization details
// Endpoint: GET /api/organization
// Request: {}
// Response: { organization: Organization }
export const getOrganization = async () => {
  try {
    const response = await api.get('/api/organization');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update organization name
// Endpoint: PUT /api/organization
// Request: { name: string }
// Response: { organization: Organization }
export const updateOrganization = async (data: { name: string }) => {
  try {
    const response = await api.put('/api/organization', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new user in the organization
// Endpoint: POST /api/organization/users
// Request: { email: string, password: string, name: string, role: string }
// Response: { user: { _id: string, email: string, name: string, role: string, organization: string } }
export const createOrganizationUser = async (data: {
  email: string;
  password: string;
  name: string;
  role: string;
}) => {
  try {
    const response = await api.post('/api/organization/users', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update user role
// Endpoint: PUT /api/organization/users/:id
// Request: { role: string }
// Response: { user: User }
export const updateUserRole = async (id: string, data: { role: string }) => {
  try {
    const response = await api.put(`/api/organization/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all hiring managers for organization
// Endpoint: GET /api/organization/hiring-managers
// Request: {}
// Response: { users: Array<{ _id: string, name: string, email: string, role: string }> }
export const getHiringManagers = async () => {
  try {
    const response = await api.get('/api/organization/hiring-managers');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};