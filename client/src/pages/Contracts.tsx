import { useEffect, useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { DataTable } from "@/components/DataTable"
import { getContracts, updateContract, getEmployeeDetails, uploadEmployeeDocument } from "@/api/contracts"
import { getTeams } from "@/api/teams"
import { Contract, Team, Employee, EmployeeDocument } from "@/api/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Mail, MapPin, Building2, User2, Pencil, FileText, Upload } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string>()
  const [searchQuery, setSearchQuery] = useState("")
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchContracts = async () => {
    const response = await getContracts(selectedTeam === 'all' ? undefined : selectedTeam, searchQuery)
    setContracts(response.contracts)
  }

  useEffect(() => {
    const fetchData = async () => {
      const teamsResponse = await getTeams()
      setTeams(teamsResponse.teams)
    }
    fetchData()
  }, [])

  useEffect(() => {
    fetchContracts()
  }, [selectedTeam, searchQuery])

  const handleUpdateContract = async (id: string, data: { type?: Contract['type'], status?: Contract['status'], salary?: number }) => {
    try {
      await updateContract(id, data)
      await fetchContracts()
      setEditingContract(null)
      toast({
        title: "Success",
        description: "Contract updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update contract",
      })
    }
  }

  const handleEmployeeClick = async (contract: Contract) => {
    try {
      console.log('Fetching employee details for contract:', contract);
      const response = await getEmployeeDetails(contract.employee._id)
      console.log('Employee details received:', response.employee);
      setSelectedEmployee(response.employee)
      setEmployeeDialogOpen(true)
    } catch (error) {
      console.log('Error details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch employee details",
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedEmployee) return

    try {
      const response = await uploadEmployeeDocument(selectedEmployee._id, file)
      setSelectedEmployee(prev => prev ? {
        ...prev,
        documents: [...prev.documents, response.document]
      } : null)
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload document",
      })
    }
  }

  const columns = [
    {
      key: "applicant",
      title: "Employee",
      render: (contract: Contract) => (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => handleEmployeeClick(contract)}
        >
          {contract.employee.name}
        </Button>
      )
    },
    {
      key: "jobPosting",
      title: "Position",
      render: (contract: Contract) => contract.jobPosting
    },
    {
      key: "salary",
      title: "Salary",
      render: (contract: Contract) => {
        const [newSalary, setNewSalary] = useState(contract.salary);
        const [isOpen, setIsOpen] = useState(false);

        return (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost">${contract.salary.toLocaleString()}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Contract Salary</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  type="number"
                  defaultValue={contract.salary}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setNewSalary(value);
                    }
                  }}
                />
                <Button
                  onClick={async () => {
                    await handleUpdateContract(contract._id, { salary: newSalary });
                    setIsOpen(false);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        );
      }
    },
    {
      key: "type",
      title: "Type",
      render: (contract: Contract) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">{contract.type}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Contract Type</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Select
                defaultValue={contract.type}
                onValueChange={(value) => handleUpdateContract(contract._id, { type: value as Contract['type'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Time">Full Time</SelectItem>
                  <SelectItem value="Part Time">Part Time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (contract: Contract) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">{contract.status}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Contract Status</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Select
                defaultValue={contract.status}
                onValueChange={(value) => handleUpdateContract(contract._id, { status: value as Contract['status'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>
      )
    },
    {
      key: "startDate",
      title: "Start Date",
      render: (contract: Contract) => new Date(contract.startDate).toLocaleDateString()
    }
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        heading="Contracts"
        text="View and manage employee contracts"
      />

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team._id} value={team._id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {contracts.length > 0 ? (
        <DataTable
          columns={columns}
          data={contracts}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px] border rounded-lg bg-muted/10">
          <p className="text-muted-foreground mb-2">No contracts found</p>
          <p className="text-sm text-muted-foreground">
            {searchQuery || selectedTeam ?
              "Try adjusting your filters or search query" :
              "Contracts will appear here once they are created"
            }
          </p>
        </div>
      )}

      <Dialog open={employeeDialogOpen} onOpenChange={setEmployeeDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>View and manage employee information</DialogDescription>
          </DialogHeader>
          {console.log('Rendering dialog with employee:', selectedEmployee)}
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User2 className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                  <p className="text-muted-foreground">{selectedEmployee.position}</p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {selectedEmployee.status}
                </Badge>
              </div>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="employment">Employment</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedEmployee.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedEmployee.location}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Employment Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedEmployee.team.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User2 className="h-4 w-4 text-muted-foreground" />
                          <span>Reports to {selectedEmployee.teamManager || 'Not Assigned'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Employee Documents</h3>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {selectedEmployee.documents.map((doc) => (
                      <Card key={doc._id}>
                        <CardContent className="flex items-center p-4">
                          <FileText className="h-8 w-8 text-muted-foreground mr-4" />
                          <div className="flex-1">
                            <h4 className="font-medium">{doc.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <Upload className="h-4 w-4" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="employment" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Leave & Benefits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Leave Balance</span>
                        <span className="font-medium">{selectedEmployee.leaveBalance} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Employment Status</span>
                        <Badge>{selectedEmployee.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}