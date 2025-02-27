import { useEffect, useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { Plus, Archive } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getJobPostings, createJobPosting, getJobPostingById, archiveJobPosting } from "@/api/jobPostings"
import { getTeams } from "@/api/teams"
import { JobPosting, Team } from "@/api/types"
import { useForm, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"
import { Separator } from "@/components/ui/separator"

export function JobPostings() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedPosting, setSelectedPosting] = useState<JobPosting | null>(null)
  const { toast } = useToast()
  const { register, handleSubmit, control, reset } = useForm()

  useEffect(() => {
    const fetchData = async () => {
      const [jobPostingsRes, teamsRes] = await Promise.all([
        getJobPostings(),
        getTeams(),
      ])
      setJobPostings(jobPostingsRes.jobPostings)
      setTeams(teamsRes.teams)
    }
    fetchData()
  }, [])

  const handleViewPosting = async (id: string) => {
    try {
      const { jobPosting } = await getJobPostingById(id)
      setSelectedPosting(jobPosting)
      setViewDialogOpen(true)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch job posting details",
      })
    }
  }

  const onSubmit = async (data: any) => {
    try {
      console.log('Creating job posting with data:', data);
      const formattedData = {
        ...data,
        description: data.summary,
        requirements: data.requirements.split('\n').filter(Boolean),
        responsibilities: data.responsibilities.split('\n').filter(Boolean),
      }
      console.log('Formatted job posting data:', formattedData);

      const response = await createJobPosting(formattedData)
      console.log('Job posting creation response:', response);

      setJobPostings([...jobPostings, response.jobPosting])
      setCreateDialogOpen(false)
      reset()
      toast({
        title: "Success",
        description: "Job posting created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create job posting",
      })
    }
  }

  const columns = [
    {
      key: "title",
      title: "Title",
      render: (item: JobPosting) => (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => handleViewPosting(item._id)}
        >
          {item.title}
        </Button>
      )
    },
    {
      key: "team",
      title: "Team",
      render: (item: JobPosting) => {
        if (typeof item.team === 'string') {
          const team = teams.find(t => t._id === item.team)
          return team?.name || 'Unknown Team'
        }
        return item.team?.name || 'Unknown Team'
      }
    },
    { key: "status", title: "Status" },
    {
      key: "createdAt",
      title: "Created At",
      render: (item: JobPosting) => new Date(item.createdAt).toLocaleDateString()
    },
    {
      key: "actions",
      title: "Actions",
      render: (jobPosting: JobPosting) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            try {
              await archiveJobPosting(jobPosting._id);
              toast({
                title: "Success",
                description: "Job posting archived successfully"
              });
              // Refresh job postings list
              const response = await getJobPostings();
              setJobPostings(response.jobPostings);
            } catch (error) {
              toast({
                variant: "destructive",
                title: "Error",
                description: error.message
              });
            }
          }}
        >
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        heading="Job Postings"
        text="Manage your job postings"
      >
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Job Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Job Posting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Title"
                    {...register("title", { required: true })}
                    className="w-full"
                  />
                </div>

                <div>
                  <Controller
                    name="team"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
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
                    )}
                  />
                </div>

                <div>
                  <Textarea
                    placeholder="Summary"
                    {...register("summary", { required: true })}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Textarea
                    placeholder="Requirements (one per line)"
                    {...register("requirements", { required: true })}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Textarea
                    placeholder="Responsibilities (one per line)"
                    {...register("responsibilities", { required: true })}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Job Posting
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <DataTable
        columns={columns}
        data={jobPostings}
      />

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedPosting?.title}</DialogTitle>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-muted-foreground">{selectedPosting?.summary}</p>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {selectedPosting?.requirements.map((req, index) => (
                      <li key={index} className="text-muted-foreground">{req}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {selectedPosting?.responsibilities.map((resp, index) => (
                      <li key={index} className="text-muted-foreground">{resp}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}