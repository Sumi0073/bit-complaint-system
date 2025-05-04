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
  return apiLogin(email, password);
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
  return apiSignup(userData);
};

export const verifySecurityAnswer = async (email: string, securityAnswer: string) => {
  const response = await fetch('http://localhost:5000/api/auth/verify-security', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, securityAnswer }),
  });
  
  if (!response.ok) {
    throw new Error('Invalid security answer');
  }
  
  return response.json();
};

export const resetPassword = async (email: string, newPassword: string) => {
  const response = await fetch('http://localhost:5000/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to reset password');
  }
  
  return response.json();
};