import React, { useState } from 'react';
import { UserIcon, PhoneIcon, BriefcaseIcon, AwardIcon as IdCardIcon, KeyIcon, ShieldQuestionIcon, EyeIcon, EyeOffIcon, MapPinIcon } from 'lucide-react';
import { signup } from '../services/auth';
import toast from 'react-hot-toast';

interface SignupProps {
  onSignup: () => void;
}

function Signup({ onSignup }: SignupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    employee_id: '',
    password: '',
    confirmPassword: '',
    securityQuestion: 'lastName',
    securityAnswer: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        designation: formData.designation,
        employee_id: formData.employee_id,
        address: formData.address,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer
      });

      toast.success('Signup successful! Please login.');
      onSignup();
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <UserIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="pl-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <UserIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
          <input
            type="email"
            name="email"
            placeholder="Email (@bitmesra.ac.in)"
            value={formData.email}
            onChange={handleChange}
            pattern=".*@bitmesra\.ac\.in$"
            required
            className="pl-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            required
            className="pl-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <BriefcaseIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className="pl-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Designation</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <div className="relative">
          <IdCardIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
          <input
            type="text"
            name="employee_id"
            placeholder="Employee/Student ID"
            value={formData.employee_id}
            onChange={handleChange}
            required
            className="pl-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="pl-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <KeyIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password (minimum 8 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
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
        <div className="relative">
          <KeyIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="pl-10 pr-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        {passwordError && (
          <p className="text-red-500 text-sm">{passwordError}</p>
        )}
        <div className="relative">
          <ShieldQuestionIcon className="absolute left-3 top-3 h-5 w-5 text-blue-800" />
          <select
            name="securityQuestion"
            value={formData.securityQuestion}
            onChange={handleChange}
            required
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
            name="securityAnswer"
            placeholder="Answer to security question"
            value={formData.securityAnswer}
            onChange={handleChange}
            required
            className="pl-10 w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;