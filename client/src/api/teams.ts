console.log('teams.ts - Module initialization');

import api from './api';
import { Team } from './types';
console.log('teams.ts - Imports loaded');

// Description: Get all teams
// Endpoint: GET /api/teams
// Request: {}
// Response: { teams: Team[] }
const getTeams = async () => {
  try {
    const response = await api.get('/api/teams');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create new team
// Endpoint: POST /api/teams
// Request: { name: string }
// Response: { team: Team }
const createTeam = async (data: { name: string }) => {
  try {
    console.log('Creating team with data:', data);
    const response = await api.post('/api/teams', data);
    console.log('Create team response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating team:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update team manager
// Endpoint: PUT /api/teams/:id/manager
// Request: { managerId: string }
// Response: { team: Team }
const updateTeamManager = async (teamId: string, managerId: string) => {
  try {
    console.log(`Updating manager for team ${teamId} to ${managerId}`);
    const response = await api.put(`/api/teams/${teamId}/manager`, { managerId });
    console.log('Update team manager response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating team manager:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get team employees
// Endpoint: GET /api/teams/:id/employees
// Request: {}
// Response: { employees: Array<{ _id: string, name: string, email: string, role: string }> }
const getTeamEmployees = async (teamId: string) => {
  try {
    const response = await api.get('/api/teams/' + teamId + '/employees');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

console.log('teams.ts - Functions defined:', { getTeams, createTeam, updateTeamManager, getTeamEmployees });

export {
  getTeams,
  createTeam,
  updateTeamManager,
  getTeamEmployees
};