import { useState, useEffect } from 'react';
import { getApplicants } from '../api/applicants';
import { getJobPostings } from '../api/jobPostings';
import { getTeams } from '../api/teams';
import { getHiringManagers } from '../api/organization';
import { User } from '../types/User';
import { toast } from '../components/ui/use-toast';

export default function Applicants() {
  const [isLoading, setIsLoading] = useState(true);
  const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
  const [applicants, setApplicants] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching applicants data...');
        
        const [applicantsRes, jobPostingsRes, teamsRes, hiringManagersRes] = await Promise.all([
          getApplicants(),
          getJobPostings(),
          getTeams(),
          getHiringManagers()
        ]);

        console.log('Successfully fetched applicants data');
        setApplicants(applicantsRes.applicants);
        setJobPostings(jobPostingsRes.jobPostings);
        setTeams(teamsRes.teams);
        setOrganizationUsers(hiringManagersRes.users);

      } catch (error) {
        console.error('Error fetching applicants data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch applicants data"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Applicants</h1>
      
      {/* Display applicants table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Status</th>
            <th>Hiring Manager</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => (
            <tr key={applicant._id}>
              <td>{applicant.name}</td>
              <td>{applicant.email}</td>
              <td>{applicant.position}</td>
              <td>{applicant.status}</td>
              <td>
                <select value={applicant.hiringManager?._id || ''}>
                  <option value="">Assign Hiring Manager</option>
                  {organizationUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select value={applicant.team?._id || ''}>
                  <option value="">Assign Team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}