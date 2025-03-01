import { useEffect, useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { Plus, FolderOpen } from "lucide-react"
import { Link } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useForm, Controller } from "react-hook-form"
import { useToast } from "@/hooks/useToast"
import { Label } from "@/components/ui/label"
import {
  getOrganization,
  updateOrganization,
  createOrganizationUser,
  updateUserRole,
} from "@/api/organization"
import { getGoogleAuthUrl, handleGoogleCallback, revokeGoogleAccess, updateGoogleSheetUrl, getGoogleSheetHeaders, updateColumnMapping, startPolling, stopPolling } from "@/api/googleAuth"
import { Organization, User, JobPosting } from "@/api/types"

export function OrganizationPage() {
  const [organization, setOrganization] = useState<Organization>()
  const [openNewUser, setOpenNewUser] = useState(false)
  const [openEditOrg, setOpenEditOrg] = useState(false)
  const [integrationLoading, setIntegrationLoading] = useState(false)
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([])
  const [columnMapping, setColumnMapping] = useState({
    email: '',
    name: '',
    location: '',
    cv: '',
    additionalFile: '',
    position: ''
  })
  const { toast } = useToast()
  const { register: registerUser, handleSubmit: handleSubmitUser, reset: resetUser, control } = useForm()
  const { register: registerOrg, handleSubmit: handleSubmitOrg, reset: resetOrg } = useForm()

  useEffect(() => {
    const fetchData = async () => {
      const response = await getOrganization()
      console.log('Organization data fetched:', {
        name: response.organization.name,
        hasGoogleIntegration: !!response.organization.googleRefreshToken
      });
      setOrganization(response.organization)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (organization?.googleColumnMapping) {
      const mappingObj = {};
      Object.keys(columnMapping).forEach(key => {
        mappingObj[key] = organization.googleColumnMapping[key] || '';
      });
      setColumnMapping(mappingObj);
    }
  }, [organization]);

  useEffect(() => {
    const fetchHeaders = async () => {
      if (organization?.googleSheetUrl) {
        try {
          const { headers } = await getGoogleSheetHeaders();
          setSheetHeaders(headers);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message
          });
        }
      }
    };
    fetchHeaders();
  }, [organization?.googleSheetUrl]);

  const onSubmitNewUser = async (data: any) => {
    try {
      const response = await createOrganizationUser(data)
      setOrganization(prev => prev ? {
        ...prev,
        users: [...prev.users, response.user]
      } : prev)
      setOpenNewUser(false)
      resetUser()
      toast({
        title: "Success",
        description: "User created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user",
      })
    }
  }

  const onSubmitEditOrg = async (data: any) => {
    try {
      const response = await updateOrganization(data)
      setOrganization(response.organization)
      setOpenEditOrg(false)
      resetOrg()
      toast({
        title: "Success",
        description: "Organization updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update organization",
      })
    }
  }

  const handleRoleChange = async (user: User, role: User['role']) => {
    try {
      const response = await updateUserRole(user._id, { role })
      setOrganization(prev => prev ? {
        ...prev,
        users: prev.users.map(u => u._id === user._id ? response.user : u)
      } : prev)
      toast({
        title: "Success",
        description: "User role updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role",
      })
    }
  }

  const handleMappingChange = async (mapping: Record<string, string>) => {
    try {
      const response = await updateColumnMapping(mapping);
      setOrganization(response.organization);
      toast({
        title: "Success",
        description: "Column mapping updated successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const connectGoogle = async () => {
    try {
      setIntegrationLoading(true)
      const { url } = await getGoogleAuthUrl()

      const width = 500
      const height = 600
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const authPromise = new Promise((resolve, reject) => {
        const handleMessage = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          if (event.data.type === 'GOOGLE_CALLBACK') {
            window.removeEventListener('message', handleMessage);
            try {
              await handleGoogleCallback(event.data.code);
              resolve(true);
            } catch (error) {
              reject(error);
            }
          }
        };

        window.addEventListener('message', handleMessage);
      });

      const popup = window.open(
        url,
        'Google Auth',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      await authPromise;

      toast({
        title: "Success",
        description: "Google account connected successfully",
      });

      popup?.close();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    } finally {
      setIntegrationLoading(false)
    }
  }

  const disconnectGoogle = async () => {
    try {
      setIntegrationLoading(true)
      await revokeGoogleAccess()
      toast({
        title: "Success",
        description: "Google account disconnected successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    } finally {
      setIntegrationLoading(false)
    }
  }

  const columns = [
    { key: "email", title: "Email" },
    {
      key: "role",
      title: "Role",
      render: (user: User) => (
        <Select
          defaultValue={user.role}
          onValueChange={(value) => handleRoleChange(user, value as User['role'])}
        >
          <SelectTrigger>
            <SelectValue>{user.role}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="HR Admin">HR Admin</SelectItem>
            <SelectItem value="Hiring Manager">Hiring Manager</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        heading="Organization"
        text="Manage your organization settings"
      />

      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            View and update your organization information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Organization Name</p>
              <p className="text-2xl font-bold">{organization?.name}</p>
            </div>
            <Dialog open={openEditOrg} onOpenChange={setOpenEditOrg}>
              <DialogTrigger asChild>
                <Button>Edit Organization</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Organization</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitOrg(onSubmitEditOrg)} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Organization Name"
                      defaultValue={organization?.name}
                      {...registerOrg("name", { required: true })}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Update Organization
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage users in your organization
              </CardDescription>
            </div>
            <Dialog open={openNewUser} onOpenChange={setOpenNewUser}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitUser(onSubmitNewUser)} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Email"
                      type="email"
                      {...registerUser("email", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Name"
                      type="text"
                      {...registerUser("name", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Password"
                      type="password"
                      {...registerUser("password", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Controller
                      name="role"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="HR Admin">HR Admin</SelectItem>
                            <SelectItem value="Hiring Manager">Hiring Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create User
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={organization?.users || []}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect with external services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Google Sheets</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Google account to import applicants from Google Forms
                </p>
                {organization?.googleRefreshToken && (
                  <p className="text-sm font-medium text-green-600 mt-2">
                    ✓ Connected to Google Account
                  </p>
                )}
              </div>
              <Button
                onClick={organization?.googleRefreshToken ? disconnectGoogle : connectGoogle}
                variant={organization?.googleRefreshToken ? "destructive" : "default"}
                disabled={integrationLoading}
              >
                {integrationLoading ? (
                  "Loading..."
                ) : organization?.googleRefreshToken ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                    Disconnect
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    Connect
                  </>
                )}
              </Button>
            </div>
            {organization?.googleRefreshToken && (
              <div className="mt-4 space-y-4">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const sheetUrl = formData.get('sheetUrl') as string;

                    try {
                      const response = await updateGoogleSheetUrl(sheetUrl);
                      setOrganization(response.organization);
                      toast({
                        title: "Success",
                        description: "Google Sheet URL updated successfully",
                      });
                    } catch (error) {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: error.message,
                      });
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label htmlFor="sheetUrl" className="text-sm font-medium">
                      Google Sheet URL
                    </label>
                    <Input
                      id="sheetUrl"
                      name="sheetUrl"
                      placeholder="Enter your Google Form responses sheet URL"
                      defaultValue={organization.googleSheetUrl || ''}
                      required
                    />
                  </div>
                  <Button type="submit">
                    Save Sheet URL
                  </Button>
                </form>
                {organization?.googleSheetUrl && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Column Mapping</h4>
                      <p className="text-sm text-muted-foreground">
                        Map Google Sheet columns to applicant fields
                      </p>
                    </div>
                    <div className="space-y-4">
                      {['email', 'name', 'location', 'cv', 'additionalFile', 'position'].map((field) => (
                        <div key={field} className="grid grid-cols-2 gap-4">
                          <Label className="text-right">{field}</Label>
                          <Select
                            value={columnMapping[field]}
                            onValueChange={(value) => {
                              const newMapping = { ...columnMapping, [field]: value };
                              setColumnMapping(newMapping);
                              handleMappingChange(newMapping);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                              {sheetHeaders.map((header) => (
                                <SelectItem key={header} value={header}>
                                  {header}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 space-y-2">
                      <h4 className="text-sm font-medium">Job Postings</h4>
                      <Card className="bg-amber-50 border-amber-200">
                        <CardHeader>
                          <CardTitle className="text-sm text-amber-800">
                            Important: Job Posting Requirements
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-amber-700 space-y-2">
                            <p>
                              For the Google Sheet integration to work properly:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>
                                Create job postings that match exactly with the position titles in your Google Form
                              </li>
                              <li>
                                Ensure job postings are in "Active" status
                              </li>
                              <li>
                                Position titles are case-insensitive but must match exactly otherwise
                              </li>
                            </ul>
                            <div className="mt-4">
                              <Button asChild variant="outline">
                                <Link to="/job-postings">
                                  <FolderOpen className="mr-2 h-4 w-4" />
                                  Manage Job Postings
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Response Polling</h4>
                          <p className="text-sm text-muted-foreground">
                            Control when to fetch responses from Google Sheet
                          </p>
                        </div>
                        <Button
                          onClick={async () => {
                            try {
                              if (organization.isPollingEnabled) {
                                try {
                                  await stopPolling();
                                  setOrganization(prev => prev ? {
                                    ...prev,
                                    isPollingEnabled: false
                                  } : prev);
                                  toast({
                                    title: "Success",
                                    description: "Polling stopped successfully"
                                  });
                                } catch (error) {
                                  if (error.response?.data?.pollingInProgress) {
                                    toast({
                                      title: "Please wait",
                                      description: "Polling is currently in progress. Will stop after current cycle completes.",
                                      duration: 5000
                                    });

                                    setTimeout(async () => {
                                      try {
                                        await stopPolling();
                                        setOrganization(prev => prev ? {
                                          ...prev,
                                          isPollingEnabled: false
                                        } : prev);
                                        toast({
                                          title: "Success",
                                          description: "Polling stopped successfully"
                                        });
                                      } catch (retryError) {
                                        toast({
                                          variant: "destructive",
                                          title: "Error",
                                          description: retryError.message
                                        });
                                      }
                                    }, 10000);
                                  } else {
                                    throw error;
                                  }
                                }
                              } else {
                                await startPolling();
                                setOrganization(prev => prev ? {
                                  ...prev,
                                  isPollingEnabled: true
                                } : prev);
                                toast({
                                  title: "Success",
                                  description: "Polling started successfully. New responses will be fetched every 5 minutes."
                                });
                              }
                            } catch (error) {
                              toast({
                                variant: "destructive",
                                title: "Error",
                                description: error.message
                              });
                            }
                          }}
                          variant={organization.isPollingEnabled ? "destructive" : "default"}
                        >
                          {organization.isPollingEnabled ? "Stop Polling" : "Start Polling"}
                        </Button>
                      </div>
                      {organization.isPollingEnabled && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ Polling is active - checking for new responses every 5 minutes
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}