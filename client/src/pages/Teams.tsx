import { useEffect, useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { Plus, Users, FileText, Calendar, User2, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getTeams, createTeam, getTeamEmployees, updateTeamManager } from "@/api/teams"
import { Team, Employee } from "@/api/types"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/useToast"

console.log('Teams page - imported functions:', { getTeams, createTeam, updateTeamManager, getTeamEmployees });

export function Teams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string>()
  const [selectedTab, setSelectedTab] = useState("dashboard")
  const [open, setOpen] = useState(false)
  const [editingManagerId, setEditingManagerId] = useState<string | null>(null)
  const [managerName, setManagerName] = useState<string>("")
  const { toast } = useToast()
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    const fetchTeams = async () => {
      console.log('fetchTeams - Before calling getTeams');
      try {
        const response = await getTeams();
        console.log('fetchTeams - getTeams response:', response);
        setTeams(response.teams);
        if (response.teams.length > 0) {
          setSelectedTeam(response.teams[0]._id);
        }
      } catch (error) {
        console.error('fetchTeams - Error calling getTeams:', error);
      }
    }
    fetchTeams()
  }, [])

  useEffect(() => {
    if (selectedTeam) {
      const fetchEmployees = async () => {
        const response = await getTeamEmployees(selectedTeam)
        setEmployees(response.employees)
      }
      fetchEmployees()
    }
  }, [selectedTeam])

  const onSubmit = async (data: any) => {
    try {
      console.log('Form submitted with data:', data);
      const response = await createTeam(data);
      console.log('Create team response in component:', response);
      setTeams([...teams, response.team]);
      setOpen(false);
      reset();
      toast({
        title: "Success",
        description: "Team created successfully",
      })
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create team",
      })
    }
  }

  const handleManagerUpdate = async (teamId: string, manager: string) => {
    try {
      const response = await updateTeamManager(teamId, manager)
      setTeams(teams.map(team =>
        team._id === teamId ? { ...team, manager } : team
      ))
      setEditingManagerId(null)
      toast({
        title: "Success",
        description: "Team manager updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update team manager",
      })
    }
  }

  const startEditing = (teamId: string, currentManager: string = '') => {
    setEditingManagerId(teamId)
    setManagerName(currentManager)
  }

  const handleKeyPress = (e: React.KeyboardEvent, teamId: string) => {
    if (e.key === 'Enter') {
      handleManagerUpdate(teamId, managerName)
    } else if (e.key === 'Escape') {
      setEditingManagerId(null)
    }
  }

  const employeeColumns = [
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "position", title: "Position" },
    { key: "status", title: "Status" },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        heading="Teams"
        text="Manage your teams and employees"
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Team</DialogTitle>
              <DialogDescription>Enter the details for the new team.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Team Name"
                  {...register("name", { required: true })}
                />
              </div>
              <Button type="submit" className="w-full">
                Create Team
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full">
          <TabsTrigger value="dashboard" className="flex-1">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex-1">
            Teams
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Employees
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  On Leave Today
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {employees.filter(e => e.status === 'On Leave').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Hires
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Documents
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams">
          {teams.length === 0 ? (
            <Card className="mt-6">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Users className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No teams found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started by creating your first team using the "New Team" button above.
                </p>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Team</DialogTitle>
                      <DialogDescription>Enter the details for the new team.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          placeholder="Team Name"
                          {...register("name", { required: true })}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Create Team
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={selectedTeam} onValueChange={setSelectedTeam}>
              <TabsList>
                {teams.map((team) => (
                  <TabsTrigger key={team._id} value={team._id}>
                    {team.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {teams.map((team) => (
                <TabsContent key={team._id} value={team._id}>
                  <div className="mt-6 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Team Manager</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <User2 className="h-6 w-6 text-muted-foreground" />
                          {editingManagerId === team._id ? (
                            <Input
                              value={managerName}
                              onChange={(e) => setManagerName(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, team._id)}
                              onBlur={() => handleManagerUpdate(team._id, managerName)}
                              className="max-w-sm"
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{team.manager || 'No manager assigned'}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEditing(team._id, team.manager)}
                                className="h-8 w-8"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Team Employees</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DataTable
                          columns={employeeColumns}
                          data={employees}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}