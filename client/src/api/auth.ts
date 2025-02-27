import api from './api';

// Description: Login user
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { user: { _id: string, email: string, role: string }, accessToken: string, refreshToken: string }
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Register user
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string, name: string }
// Response: { user: { _id: string, email: string, name: string, role: string, organization: { _id: string, name: string } }, accessToken: string }
export const register = async (email: string, password: string, name: string) => {
  try {
    const response = await api.post('/api/auth/register', { email, password, name });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Logout user
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { success: boolean }
export const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get current user details
// Endpoint: GET /api/auth/me
// Request: {}
// Response: { _id: string, email: string, name: string, role: string, organization: { _id: string, name: string } }
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};