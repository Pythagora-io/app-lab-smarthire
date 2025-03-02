import { useEffect, useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getApplicants, updateApplicantStatus, assignHiringManager } from "@/api/applicants"
import { getJobPostings, getJobPostingById } from "@/api/jobPostings"
import { Applicant, JobPosting, Contract, Team, User } from "@/api/types"
import { useToast } from "@/hooks/useToast"
import { FileIcon, ExternalLink, Search, User2, Mail, MapPin, FileText, CheckCircle, Target, Building2, Clock, Circle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createContract } from "@/api/contracts"
import { getTeams } from "@/api/teams"
import { getHiringManagers } from "@/api/organization"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

const statusColors = {
  Applied: "default",
  Screened: "secondary",
  Interview: "warning",
  Offer: "info",
  Hired: "success",
  Rejected: "destructive",
} as const

export function Applicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [organizationUsers, setOrganizationUsers] = useState<User[]>([])
  const [selectedJobPosting, setSelectedJobPosting] = useState<JobPosting | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [jobPostingDialogOpen, setJobPostingDialogOpen] = useState(false)
  const [applicantDialogOpen, setApplicantDialogOpen] = useState(false)
  const [applicantSearch, setApplicantSearch] = useState("")
  const [jobPostingSearch, setJobPostingSearch] = useState("")
  const [contractDialogOpen, setContractDialogOpen] = useState(false)
  const [contractFormData, setContractFormData] = useState({
    salary: '',
    type: 'Full Time' as Contract['type'],
    team: ''
  })
  const { toast } = useToast()

  const fetchApplicants = async () => {
    try {
      console.log('Starting fetchApplicants');
      const [applicantsRes, jobPostingsRes] = await Promise.all([
        getApplicants(),
        getJobPostings()
      ]);
      console.log('fetchApplicants API responses:', {
        applicants: applicantsRes.applicants,
        jobPostings: jobPostingsRes.jobPostings
      });
      setApplicants(applicantsRes.applicants);
      setJobPostings(jobPostingsRes.jobPostings);
      console.log('State updated in fetchApplicants');
    } catch (error) {
      console.error('Error in fetchApplicants:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch updated data",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting fetchData in Applicants page');
        const [applicantsRes, jobPostingsRes, teamsRes, hiringManagersRes] = await Promise.all([
          getApplicants(),
          getJobPostings(),
          getTeams(),
          getHiringManagers()
        ])
        console.log('API responses received:', {
          applicants: applicantsRes,
          jobPostings: jobPostingsRes.jobPostings,
          teams: teamsRes.teams,
          hiringManagers: hiringManagersRes.users
        });
        setApplicants(applicantsRes.applicants)
        setJobPostings(jobPostingsRes.jobPostings)
        setTeams(teamsRes.teams)
        setOrganizationUsers(hiringManagersRes.users)
        console.log('State updated with fetched data');
      } catch (error) {
        console.error('Error in fetchData:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch data"
        });
      }
    }
    fetchData()
  }, [])

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    try {
      if (newStatus === 'Hired') {
        const applicant = applicants.find(a => a._id === applicantId);
        const jobPosting = jobPostings.find(jp => jp._id === applicant?.jobPosting._id);
        setSelectedApplicant(applicant);
        setContractFormData(prev => ({
          ...prev,
          team: jobPosting?.team._id || ''
        }));
        setContractDialogOpen(true);
        return;
      }

      await updateApplicantStatus(applicantId, newStatus);
      await fetchApplicants();
      toast({
        title: "Success",
        description: "Applicant status updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update applicant status",
      });
    }
  }

  const handleAssignHiringManager = async (applicantId: string, hiringManagerId: string) => {
    try {
      await assignHiringManager(applicantId, hiringManagerId);
      await fetchApplicants();
      toast({
        title: "Success",
        description: "Hiring manager assigned successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to assign hiring manager",
      });
    }
  };

  const handleCreateContract = async () => {
    try {
      if (!selectedApplicant || !contractFormData.salary || !contractFormData.team) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields",
        });
        return;
      }

      const salary = parseFloat(contractFormData.salary);
      if (isNaN(salary) || salary <= 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid salary",
        });
        return;
      }

      await createContract({
        applicantId: selectedApplicant._id,
        jobPostingId: selectedApplicant.jobPosting._id,
        salary,
        type: contractFormData.type,
        team: contractFormData.team
      });

      await updateApplicantStatus(selectedApplicant._id, 'Hired');

      setContractDialogOpen(false);
      setContractFormData({ salary: '', type: 'Full Time', team: '' });
      setSelectedApplicant(null);

      await fetchApplicants();

      toast({
        title: "Success",
        description: "Contract created and applicant hired successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create contract",
      });
    }
  }

  const handleJobPostingClick = async (jobPosting: { _id: string, title: string }) => {
    try {
      const response = await getJobPostingById(jobPosting._id);
      setSelectedJobPosting(response.jobPosting);
      setJobPostingDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch job posting details"
      });
    }
  }

  const handleApplicantClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setApplicantDialogOpen(true);
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesApplicant =
      applicant.name.toLowerCase().includes(applicantSearch.toLowerCase()) ||
      applicant.email.toLowerCase().includes(applicantSearch.toLowerCase()) ||
      applicant.location.toLowerCase().includes(applicantSearch.toLowerCase())

    const matchesJobPosting = applicant.jobPosting.title.toLowerCase().includes(jobPostingSearch.toLowerCase())

    return (!applicantSearch || matchesApplicant) &&
           (!jobPostingSearch || matchesJobPosting)
  })

  const columns = [
    {
      key: "name",
      title: "Name",
      render: (applicant: Applicant) => (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => handleApplicantClick(applicant)}
        >
          {applicant.name}
        </Button>
      )
    },
    { key: "email", title: "Email" },
    { key: "location", title: "Location" },
    {
      key: "position",
      title: "Position",
      render: (item: Applicant) => item.position.join(", ")
    },
    {
      key: "jobPosting",
      title: "Job Posting",
      render: (applicant: Applicant) => (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => handleJobPostingClick(applicant.jobPosting)}
        >
          {applicant.jobPosting.title}
        </Button>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (item: Applicant) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Badge variant={statusColors[item.status]}>
                {item.status}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.keys(statusColors).map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusChange(item._id, status as Applicant['status'])}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      key: "hiringManager",
      title: "Hiring Manager",
      render: (applicant: Applicant) => {
        const { user } = useAuth();
        if (user?.role !== 'HR Admin' && user?.role !== 'Admin') {
          return applicant.hiringManager?.name || '-';
        }

        return (
          <Select
            value={applicant.hiringManager?._id || "none"}
            onValueChange={async (value) => {
              try {
                if (value === "none") {
                  return;
                }
                await assignHiringManager(applicant._id, value);
                toast({
                  title: "Success",
                  description: "Hiring manager assigned successfully",
                });
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: error.message,
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue>
                {applicant.hiringManager?.name || "Select Hiring Manager"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {!applicant.hiringManager && (
                <SelectItem value="none">None</SelectItem>
              )}
              {organizationUsers.map((hm) => (
                <SelectItem key={hm._id} value={hm._id}>
                  {hm.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      key: "createdAt",
      title: "Applied At",
      render: (item: Applicant) => new Date(item.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        heading="Applicants"
        text="Manage your applicants"
      />

      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="applicant-search" className="text-sm font-medium block mb-2">
            Search Applicants
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="applicant-search"
              placeholder="Search by name, email, or location..."
              className="pl-8"
              value={applicantSearch}
              onChange={(e) => setApplicantSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1">
          <label htmlFor="job-search" className="text-sm font-medium block mb-2">
            Search Job Postings
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="job-search"
              placeholder="Search by job title..."
              className="pl-8"
              value={jobPostingSearch}
              onChange={(e) => setJobPostingSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredApplicants.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
          <p className="text-lg font-medium text-muted-foreground">
            {applicants.length === 0 ? "No applicants found" : "No matching applicants"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {applicants.length === 0
              ? "When candidates apply through your job postings, they will appear here."
              : "Try adjusting your search criteria."}
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredApplicants}
        />
      )}

      <Dialog open={jobPostingDialogOpen} onOpenChange={setJobPostingDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold tracking-tight">
              {selectedJobPosting?.title}
            </DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground mt-2">
              {selectedJobPosting?.summary}
            </DialogDescription>
          </DialogHeader>

          {selectedJobPosting && (
            <div className="space-y-8 py-4">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold tracking-tight">About the Role</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedJobPosting.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-none shadow-lg bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {selectedJobPosting.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                          <span className="text-sm text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Responsibilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {selectedJobPosting.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                          <span className="text-sm text-muted-foreground">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <Badge variant="outline" className="text-sm">
                  <Building2 className="h-4 w-4 mr-1" />
                  {selectedJobPosting.team.name}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Posted {new Date(selectedJobPosting.createdAt).toLocaleDateString()}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm",
                    selectedJobPosting.status === 'Open' ? "border-green-500 text-green-500" : "border-yellow-500 text-yellow-500"
                  )}
                >
                  <Circle className="h-4 w-4 mr-1" />
                  {selectedJobPosting.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={applicantDialogOpen} onOpenChange={setApplicantDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Applicant Profile</DialogTitle>
            <DialogDescription>Comprehensive applicant information</DialogDescription>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User2 className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedApplicant.name}</h2>
                  <p className="text-muted-foreground">{selectedApplicant.position.join(", ")}</p>
                </div>
                <Badge className="ml-auto" variant={statusColors[selectedApplicant.status]}>
                  {selectedApplicant.status}
                </Badge>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedApplicant.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedApplicant.location}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Application Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={selectedApplicant.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {selectedApplicant.cvFileName}
                      </a>
                    </div>
                    {selectedApplicant.additionalFile && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={selectedApplicant.additionalFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedApplicant.additionalFileName}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Applied Position</span>
                      <span className="font-medium">{selectedApplicant.jobPosting.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Application Date</span>
                      <span className="font-medium">
                        {new Date(selectedApplicant.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={contractDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setContractFormData({ salary: '', type: 'Full Time', team: '' });
          setSelectedApplicant(null);
        }
        setContractDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Contract</DialogTitle>
            <DialogDescription>
              Create a contract for {selectedApplicant?.name} for the position of {selectedApplicant?.jobPosting?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">
                Salary
              </Label>
              <Input
                id="salary"
                type="number"
                className="col-span-3"
                value={contractFormData.salary}
                onChange={(e) => setContractFormData(prev => ({
                  ...prev,
                  salary: e.target.value
                }))}
                placeholder="Enter annual salary"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Contract Type
              </Label>
              <Select
                value={contractFormData.type}
                onValueChange={(value) => setContractFormData(prev => ({
                  ...prev,
                  type: value as Contract['type']
                }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Time">Full Time</SelectItem>
                  <SelectItem value="Part Time">Part Time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team" className="text-right">
                Team
              </Label>
              <Select
                value={contractFormData.team}
                onValueChange={(value) => setContractFormData(prev => ({
                  ...prev,
                  team: value
                }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team._id} value={team._id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setContractDialogOpen(false);
                setContractFormData({ salary: '', type: 'Full Time', team: '' });
                setSelectedApplicant(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateContract}>
              Create Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}