const Team = require('../models/Team');

class TeamService {
  async createTeam(teamData, organizationId) {
    try {
      console.log(`Creating new team with name: ${teamData.name} for organization: ${organizationId}`);
      const team = new Team({
        ...teamData,
        organization: organizationId
      });
      await team.save();
      console.log(`Successfully created team with id: ${team._id}`);
      return team;
    } catch (error) {
      console.error('Error creating team:', error);
      throw new Error(`Error creating team: ${error.message}`);
    }
  }

  async getTeams(organizationId) {
    try {
      console.log(`Fetching teams for organization: ${organizationId}`);
      const teams = await Team.find({ organization: organizationId });
      console.log(`Found ${teams.length} teams`);
      return teams;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new Error(`Error fetching teams: ${error.message}`);
    }
  }

  async getTeamEmployees(teamId, organizationId) {
    try {
      console.log(`Fetching employees for team: ${teamId} in organization: ${organizationId}`);
      const team = await Team.findOne({
        _id: teamId,
        organization: organizationId
      }).populate({
        path: 'employees',
        select: '-password -refreshToken' // Exclude sensitive fields
      });

      if (!team) {
        throw new Error('Team not found');
      }

      console.log(`Found ${team.employees.length} employees`);
      return team.employees;
    } catch (error) {
      console.error('Error fetching team employees:', error);
      throw new Error(`Error fetching team employees: ${error.message}`);
    }
  }

  async updateTeamManager(teamId, managerId, organizationId) {
    try {
      console.log(`Updating manager for team ${teamId} to ${managerId}`);
      const team = await Team.findOne({
        _id: teamId,
        organization: organizationId
      });

      if (!team) {
        throw new Error('Team not found');
      }

      team.manager = managerId;
      await team.save();

      console.log(`Successfully updated manager for team ${teamId}`);
      return team;
    } catch (error) {
      console.error('Error updating team manager:', error);
      throw new Error(`Error updating team manager: ${error.message}`);
    }
  }
}

module.exports = new TeamService();