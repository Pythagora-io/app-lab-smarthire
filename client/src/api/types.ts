import api from './api';

export interface User {
  _id: string;
  email: string;
  role: 'Admin' | 'HR Admin' | 'Hiring Manager';
  organization: string;
}

export interface Organization {
  _id: string;
  name: string;
  users: User[];
  googleRefreshToken?: string | null;
  googleSheetUrl?: string | null;
  googleColumnMapping?: Record<string, string>;
  isPollingEnabled?: boolean;
  createdAt: string;
}

export interface Team {
  _id: string;
  name: string;
  organization: string;
  employees: Employee[];
  manager?: string;
}

export interface EmployeeDocument {
  _id: string;
  name: string;
  type: 'Contract' | 'ID' | 'Resume' | 'Other';
  url: string;
  uploadDate: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  position: string;
  team: {
    _id: string;
    name: string;
  };
  status: 'Active' | 'On Leave' | 'Terminated';
  location: string;
  teamManager: string;
  documents: EmployeeDocument[];
  leaveBalance: number;
  startDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface JobPosting {
  _id: string;
  title: string;
  summary: string;
  team: {
    _id: string;
    name: string;
  };
  status: 'Open' | 'Closed';
  requirements: string[];
  responsibilities: string[];
  createdAt: string;
}

export interface Applicant {
  _id: string;
  name: string;
  email: string;
  location: string;
  cv: string;
  cvFileName: string;
  additionalFile?: string;
  additionalFileName?: string;
  position: string[];
  status: 'Applied' | 'Screened' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  jobPosting: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

export interface Contract {
  _id: string;
  employee: {
    _id: string;
    name: string;
    email: string;
  };
  jobPosting: string;
  salary: number;
  type: 'Full Time' | 'Part Time' | 'Contract';
  status: 'Active' | 'On Hold' | 'Terminated';
  startDate: string;
  team: string;
}