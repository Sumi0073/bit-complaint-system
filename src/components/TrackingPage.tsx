import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserComplaints } from '../services/complaints';
import toast from 'react-hot-toast';

interface Complaint {
  id: number;
  type: string;
  category: string;
  status: string;
  date: string;
  description: string;
  rejection_reason?: string;
}

function TrackingPage() {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!token) {
        toast.error('Please login to view complaints');
        return;
      }

      try {
        const response = await getUserComplaints(token);
        setComplaints(response.map((complaint: any) => ({
          ...complaint,
          date: new Date(complaint.created_at).toLocaleDateString(),
        })));
      } catch (error) {
        toast.error('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [token]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      case 'rejected':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <ClockIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Track Complaints</h2>
      {complaints.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No complaints found. Submit a new complaint to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(complaint.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{complaint.date}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{complaint.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{complaint.category}</p>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{complaint.description}</p>
              {complaint.status === 'rejected' && complaint.rejection_reason && (
                <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-sm font-medium text-red-800">
                    Rejection Reason:
                  </p>
                  <p className="text-sm text-red-600">{complaint.rejection_reason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrackingPage;