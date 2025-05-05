import { login as apiLogin, signup as apiSignup } from './api';

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  designation: string;
  employee_id: string;
  address: string;
}

export const login = async (email: string, password: string) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
};

export const signup = async (userData: {
  email: string;
  password: string;
  name: string;
  phone: string;
  designation: string;
  employee_id: string;
  address: string;
  securityQuestion: string;
  securityAnswer: string;
}) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }

  return response.json();
};

export const verifySecurityAnswer = async (email: string, securityAnswer: string) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const response = await fetch(`${API_URL}/auth/verify-security`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, securityAnswer }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Invalid security answer');
  }
  
  return response.json();
};

export const resetPassword = async (email: string, newPassword: string) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reset password');
  }
  
  return response.json();
};
