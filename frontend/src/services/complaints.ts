import { 
  createComplaint as apiCreateComplaint,
  getUserComplaints as apiGetUserComplaints,
  getAllComplaints as apiGetAllComplaints,
  updateComplaintStatus as apiUpdateComplaintStatus
} from './api';

export interface Complaint {
  id: number;
  user_id: number;
  type: string;
  category: string;
  status: string;
  urgency: string;
  description: string;
  location: string;
  preferred_timing: string;
  material_provided: boolean;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export const createComplaint = async (complaint: Omit<Complaint, 'id' | 'status' | 'created_at' | 'updated_at'>, token: string) => {
  return apiCreateComplaint(complaint, token);
};

export const getUserComplaints = async (token: string) => {
  return apiGetUserComplaints(token);
};

export const getAllComplaints = async (token: string) => {
  return apiGetAllComplaints(token);
};

export const updateComplaintStatus = async (
  complaintId: number,
  status: string,
  rejectionReason?: string,
  token?: string
) => {
  if (!token) throw new Error('Token is required');
  return apiUpdateComplaintStatus(complaintId, status, rejectionReason, token);
};