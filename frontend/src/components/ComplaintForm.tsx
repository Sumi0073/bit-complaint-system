import React, { useState } from 'react';
import { ClipboardIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createComplaint } from '../services/complaints';
import toast from 'react-hot-toast';

function ComplaintForm() {
  const { token } = useAuth();
  const [complaintType, setComplaintType] = useState('');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [timing, setTiming] = useState('');
  const [location, setLocation] = useState('');
  const [materialProvided, setMaterialProvided] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to submit a complaint');
      return;
    }

    try {
      const complaintData = {
        type: complaintType,
        category,
        urgency,
        preferred_timing: timing,
        location,
        material_provided: materialProvided === 'yes',
        description,
      };

      await createComplaint(complaintData, token);
      toast.success('Complaint submitted successfully!');
      
      // Reset form
      setComplaintType('');
      setCategory('');
      setUrgency('');
      setTiming('');
      setLocation('');
      setMaterialProvided('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to submit complaint. Please try again.');
    }
  };

  const getCategoryOptions = () => {
    switch (complaintType) {
      case 'personal':
        return ['inside house', 'outside house', 'street line'];
      case 'departmental':
        return ['cabin', 'classroom', 'project', 'lab'];
      case 'hostel':
        return ['fan', 'light'];
      default:
        return [];
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">New Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint Type
            </label>
            <select
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value)}
              required
              className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Type</option>
              <option value="personal">Personal</option>
              <option value="hostel">Hostel</option>
              <option value="departmental">Departmental</option>
            </select>
          </div>

          {complaintType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {getCategoryOptions().map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              required
              className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Urgency</option>
              <option value="urgent">Urgent</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Timing
            </label>
            <input
              type="time"
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              required
              className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Enter location details"
              className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          {complaintType === 'personal' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Provided by Customer
              </label>
              <select
                value={materialProvided}
                onChange={(e) => setMaterialProvided(e.target.value)}
                required
                className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description of Complaint
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
            placeholder="Please provide detailed description of the issue..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
}

export default ComplaintForm;