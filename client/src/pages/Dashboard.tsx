import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/PageHeader"
import {
  Users,
  UserPlus,
  Calendar,
  Briefcase,
} from "lucide-react"
import { getApplicants } from "@/api/applicants"
import { getTeams } from "@/api/teams"
import { getJobPostings } from "@/api/jobPostings"
import { getApplicantDistribution } from "@/api/dashboard"
import { Applicant, Team, JobPosting } from "@/api/types"
import { useToast } from "@/hooks/useToast"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

export function Dashboard() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [pipelineData, setPipelineData] = useState<{ name: string, count: number }[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicantsRes, teamsRes, jobPostingsRes, distributionRes] = await Promise.all([
          getApplicants(),
          getTeams(),
          getJobPostings(),
          getApplicantDistribution()
        ])
        setApplicants(applicantsRes.applicants)
        setTeams(teamsRes.teams)
        setJobPostings(jobPostingsRes.jobPostings)
        setPipelineData(distributionRes.distribution)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        })
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        heading="Dashboard"
        text="Overview of your recruitment pipeline"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Job Posts</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobPostings.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recruitment Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}