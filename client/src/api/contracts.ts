import api from './api';
import { Contract, Employee, EmployeeDocument } from './types';

// Description: Get all contracts
// Endpoint: GET /api/contracts
// Request: { teamId?: string, search?: string }
// Response: { contracts: Contract[] }
export const getContracts = async (teamId?: string, search?: string) => {
  try {
    const params: Record<string, string> = {};
    if (teamId) params.teamId = teamId;
    if (search) params.search = search;

    const response = await api.get('/api/contracts', { params });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get employee details
// Endpoint: GET /api/contracts/employee/:id
// Request: {}
// Response: {
//   employee: {
//     _id: string;
//     name: string;
//     email: string;
//     location: string;
//     personalInfo: {
//       dateOfBirth?: Date;
//       phoneNumber?: string;
//       address?: string;
//       emergencyContact?: {
//         name: string;
//         relationship: string;
//         phoneNumber: string;
//       };
//     };
//     documents: Array<{
//       name: string;
//       type: string;
//       url: string;
//       uploadedAt: Date;
//     }>;
//     team: {
//       _id: string;
//       name: string;
//     };
//     startDate: Date;
//   }
// }
export const getEmployeeDetails = async (id: string) => {
  try {
    const response = await api.get(`/api/contracts/employee/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update a contract
// Endpoint: PUT /api/contracts/:id
// Request: { salary?: number, type?: string, status?: string }
// Response: { contract: { _id: string, employee: { _id: string, name: string, email: string }, jobPosting: string, salary: number, type: string, status: string, startDate: string, team: { _id: string, name: string } } }
export const updateContract = async (contractId: string, data: { salary?: number; type?: string; status?: string }) => {
  try {
    const response = await api.put(`/api/contracts/${contractId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Upload employee document
// Endpoint: POST /api/contracts/employee/:id/documents
// Request: FormData with file
// Response: { document: EmployeeDocument }
export const uploadEmployeeDocument = (employeeId: string, file: File) => {
  return new Promise<{ document: EmployeeDocument }>((resolve) => {
    setTimeout(() => {
      resolve({
        document: {
          _id: Math.random().toString(),
          name: file.name,
          type: 'Other',
          url: URL.createObjectURL(file),
          uploadDate: new Date().toISOString()
        }
      });
    }, 500);
  });
};

// Description: Create contract
// Endpoint: POST /api/contracts
// Request: { applicantId: string, jobPostingId: string, salary: number, type: string }
// Response: { contract: Contract }
export const createContract = async (data: {
  applicantId: string;
  jobPostingId: string;
  salary: number;
  type: Contract['type'];
}) => {
  try {
    const response = await api.post('/api/contracts', data);
    return response.data;
  } catch (error) {
    console.error('Failed to create contract:', error);
    throw new Error(error?.response?.data?.error || 'Failed to create contract');
  }
};