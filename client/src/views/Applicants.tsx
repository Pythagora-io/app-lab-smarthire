import { useEffect, useState } from "react";
import { getApplicants } from "@/api/applicants";
import { getJobPostings } from "@/api/jobPostings";
import { getTeams } from "@/api/teams";
import { getHiringManagers } from "@/api/organization";
import { Applicant } from "@/types/applicant";
import { JobPosting } from "@/types/jobPosting";
import { Team } from "@/types/team";
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";

export default function Applicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Split into separate try-catch blocks to handle partial failures
      try {
        const applicantsRes = await getApplicants();
        setApplicants(applicantsRes.applicants);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch applicants"
        });
      }

      try {
        const jobPostingsRes = await getJobPostings();
        setJobPostings(jobPostingsRes.jobPostings);
      } catch (error) {
        console.error('Error fetching job postings:', error);
        toast({
          variant: "destructive",
          title: "Error", 
          description: "Failed to fetch job postings"
        });
      }

      try {
        const teamsRes = await getTeams();
        setTeams(teamsRes.teams);
      } catch (error) {
        console.error('Error fetching teams:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch teams"
        });
      }

      try {
        const hiringManagersRes = await getHiringManagers();
        setOrganizationUsers(hiringManagersRes.users);
      } catch (error) {
        console.error('Error fetching hiring managers:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch hiring managers"
        });
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  };

  return (
    <div>
      <h1>Applicants</h1>
      {/* Render applicants table/list here */}
    </div>
  );
}