import React, { useState } from 'react';
import { UserIcon, KeyIcon, ShieldQuestionIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login, verifySecurityAnswer, resetPassword } from '../services/auth';
import toast from 'react-hot-toast';

interface LoginProps {
  onLogin: (isAdmin: boolean) => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('lastName');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const { setUser, setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const isAdmin = response.user.designation === 'staff';
      
      setUser(response.user);
      setToken(response.token);
      
      toast.success('Login successful!');
      onLogin(isAdmin);
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifySecurityAnswer(resetEmail, securityAnswer);
      setShowResetForm(true);
      setResetError('');
    } catch (error) {
      setResetError('Invalid security answer');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters long');
      return;
    }

    try {
      await resetPassword(resetEmail, newPassword);
      setResetSuccess('Password has been successfully reset');
      setTimeout(() => {
        setShowForgotPassword(false);
        setShowResetForm(false);
        setResetSuccess('');
        setResetError('');
      }, 2000);
    } catch (error) {
      setResetError('Failed to reset password. Please try again.');
    }
  };

  if (showForgotPassword) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Reset Password</h2>
        {!showResetForm ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
              <input
                type="email"
                placeholder="Email (@bitmesra.ac.in)"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                pattern=".*@bitmesra\.ac\.in$"
                required
                className="pl-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <ShieldQuestionIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
              <select
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="pl-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="lastName">What is your last name?</option>
                <option value="favColour">What is your favourite colour?</option>
              </select>
            </div>
            <div className="relative">
              <ShieldQuestionIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
              <input
                type="text"
                placeholder="Answer to security question"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
                className="pl-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            {resetError && (
              <p className="text-red-500 text-sm">{resetError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Verify Answer
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="relative">
              <KeyIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="pl-10 pr-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showNewPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="relative">
              <KeyIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="pl-10 pr-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmNewPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {resetError && (
              <p className="text-red-500 text-sm">{resetError}</p>
            )}
            {resetSuccess && (
              <p className="text-green-500 text-sm">{resetSuccess}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Reset Password
            </button>
          </form>
        )}
        <button
          type="button"
          onClick={() => {
            setShowForgotPassword(false);
            setShowResetForm(false);
            setResetError('');
            setResetSuccess('');
          }}
          className="w-full mt-4 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition duration-200"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <UserIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
          <input
            type="email"
            placeholder="Email (@bitmesra.ac.in)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern=".*@bitmesra\.ac\.in$"
            required
            className="pl-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <KeyIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 pr-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="w-full text-blue-800 hover:text-blue-600 transition duration-200"
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
}

export default Login;