const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse {
  error?: string;
  [key: string]: any;
}

const handleResponse = async (response: Response): Promise<ApiResponse> => {
  const data = await response.json();
  if (!response.ok) {
    const error = data.error || 'Something went wrong';
    console.error('API Error:', error);
    throw new Error(error);
  }
  return data;
};

export const login = async (email: string, password: string) => {
  console.log('Attempting login:', { email });
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const signup = async (userData: any) => {
  console.log('Attempting signup:', { email: userData.email });
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const createComplaint = async (complaintData: any, token: string) => {
  console.log('Creating complaint:', complaintData);
  const response = await fetch(`${API_URL}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(complaintData),
  });
  return handleResponse(response);
};

export const getUserComplaints = async (token: string) => {
  const response = await fetch(`${API_URL}/complaints`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getAllComplaints = async (token: string) => {
  const response = await fetch(`${API_URL}/complaints/admin`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const updateComplaintStatus = async (
  complaintId: number,
  status: string,
  rejectionReason: string | undefined,
  token: string
) => {
  console.log('Updating complaint status:', { complaintId, status, rejectionReason });
  const response = await fetch(`${API_URL}/complaints/${complaintId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status, rejection_reason: rejectionReason }),
  });
  return handleResponse(response);
};