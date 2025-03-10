import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Layout } from "./components/Layout"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Dashboard } from "./pages/Dashboard"
import { Applicants } from "./pages/Applicants"
import { JobPostings } from "./pages/JobPostings"
import { Teams } from "./pages/Teams"
import { OrganizationPage } from "./pages/Organization"
import { Contracts } from "./pages/Contracts"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="applicants" element={<Applicants />} />
              <Route path="job-postings" element={<JobPostings />} />
              <Route path="teams/*" element={<Teams />} />
              <Route path="organization" element={<OrganizationPage />} />
              <Route path="contracts" element={<Contracts />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App