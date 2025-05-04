import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ClockIcon, XCircleIcon, LayoutDashboardIcon, ListIcon, FilterIcon, UserIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllComplaints, updateComplaintStatus } from '../services/complaints';
import RejectionInput from './RejectionInput';
import toast from 'react-hot-toast';

interface User {
  name: string;
  email: string;
  phone: string;
  designation: string;
  id: string;
  address: string;
}

interface Complaint {
  id: number;
  type: string;
  category: string;
  status: string;
  created_at: string;
  description: string;
  location: string;
  urgency: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_designation: string;
  user_id: string;
  user_address: string;
  rejection_reason?: string;
}

function AdminDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: number]: string }>({});
  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, [token]);

  const fetchComplaints = async () => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await getAllComplaints(token);
      setComplaints(response.map((complaint: any) => ({
        ...complaint,
        date: new Date(complaint.created_at).toLocaleDateString(),
      })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to fetch complaints');
      setLoading(false);
    }
  };

  const filteredComplaints = statusFilter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === statusFilter);

  const stats = {
    total: complaints.length,
    new: complaints.filter(c => c.status === 'new').length,
    pending: complaints.filter(c => c.status === 'pending').length,
    completed: complaints.filter(c => c.status === 'completed').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
    urgent: complaints.filter(c => c.urgency === 'urgent').length,
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    if (newStatus === 'rejected') {
      setSelectedComplaint(id);
      setRejectionReasons(prev => ({ ...prev, [id]: '' }));
      return;
    }

    try {
      await updateComplaintStatus(id, newStatus, undefined, token);
      await fetchComplaints();
      toast.success(`Complaint ${newStatus} successfully`);
      setSelectedComplaint(null);
      setRejectionReasons(prev => {
        const newReasons = { ...prev };
        delete newReasons[id];
        return newReasons;
      });
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast.error('Failed to update complaint status');
    }
  };

  const handleReject = async (id: number) => {
    if (!token || !rejectionReasons[id]) return;

    try {
      await updateComplaintStatus(id, 'rejected', rejectionReasons[id], token);
      await fetchComplaints();
      toast.success('Complaint rejected successfully');
      setSelectedComplaint(null);
      setRejectionReasons(prev => {
        const newReasons = { ...prev };
        delete newReasons[id];
        return newReasons;
      });
    } catch (error) {
      console.error('Error rejecting complaint:', error);
      toast.error('Failed to reject complaint');
    }
  };

  const handleRejectionReasonChange = (id: number, value: string) => {
    setRejectionReasons(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleCancelRejection = (id: number) => {
    setSelectedComplaint(null);
    setRejectionReasons(prev => {
      const newReasons = { ...prev };
      delete newReasons[id];
      return newReasons;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Complaints</option>
            <option value="new">New</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Complaints</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-3xl font-bold text-blue-600">{stats.total}</span>
            <ListIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Pending</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-3xl font-bold text-yellow-600">{stats.pending}</span>
            <ClockIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Completed</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-3xl font-bold text-green-600">{stats.completed}</span>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Complaint Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{complaint.user_name}</div>
                        <div className="text-sm text-gray-500">{complaint.user_designation}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{complaint.type}</div>
                    <div className="text-sm text-gray-500">{complaint.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      complaint.status === 'completed' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      complaint.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setShowDetails(showDetails === complaint.id ? null : complaint.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {showDetails === complaint.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetails !== null && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Detailed Information</h3>
          {complaints.filter(c => c.id === showDetails).map(complaint => (
            <div key={complaint.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-700">User Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{complaint.user_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{complaint.user_phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{complaint.user_address}</span>
                  </div>
                  <p className="text-sm text-gray-500">ID: {complaint.user_id}</p>
                  <p className="text-sm text-gray-500">Email: {complaint.user_email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-700">Complaint Details</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Description:</span> {complaint.description}</p>
                  <p><span className="font-medium">Location:</span> {complaint.location}</p>
                  <p><span className="font-medium">Type:</span> {complaint.type} - {complaint.category}</p>
                  <p><span className="font-medium">Urgency:</span> {complaint.urgency}</p>
                  <p><span className="font-medium">Status:</span> {complaint.status}</p>
                  {complaint.rejection_reason && (
                    <p><span className="font-medium">Rejection Reason:</span> {complaint.rejection_reason}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ManageComplaints = () => (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Complaints</option>
            <option value="new">New</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredComplaints.map((complaint) => (
        <div key={complaint.id} className="border border-blue-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  complaint.urgency === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {complaint.urgency}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  complaint.status === 'completed' ? 'bg-green-100 text-green-800' :
                  complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  complaint.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {complaint.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{complaint.type} - {complaint.category}</h3>
            </div>
            
            <div className="flex space-x-2">
              {complaint.status === 'new' && (
                <>
                  <button
                    onClick={() => handleStatusChange(complaint.id, 'pending')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusChange(complaint.id, 'rejected')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </>
              )}
              {complaint.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange(complaint.id, 'completed')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">User Information</h4>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{complaint.user_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{complaint.user_phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{complaint.user_address}</span>
              </div>
              <p className="text-sm text-gray-500">ID: {complaint.user_id}</p>
              <p className="text-sm text-gray-500">Email: {complaint.user_email}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Complaint Details</h4>
              <p className="text-gray-600">{complaint.description}</p>
              <p className="text-sm text-gray-500">Location: {complaint.location}</p>
              <p className="text-sm text-gray-500">Date: {new Date(complaint.created_at).toLocaleDateString()}</p>
              {complaint.rejection_reason && (
                <p className="text-sm text-red-600">Rejection Reason: {complaint.rejection_reason}</p>
              )}
            </div>
          </div>

          {selectedComplaint === complaint.id && (
            <RejectionInput
              value={rejectionReasons[complaint.id] || ''}
              onChange={(value) => handleRejectionReasonChange(complaint.id, value)}
              onCancel={() => handleCancelRejection(complaint.id)}
              onConfirm={() => handleReject(complaint.id)}
              isValid={Boolean(rejectionReasons[complaint.id]?.trim())}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/d/d2/Birla_Institute_of_Technology_Mesra.png" 
              alt="BIT Mesra Logo" 
              className="h-12"
            />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded ${
                activeTab === 'dashboard' ? 'bg-white text-blue-800' : 'text-white'
              }`}
            >
              <LayoutDashboardIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center space-x-2 px-4 py-2 rounded ${
                activeTab === 'manage' ? 'bg-white text-blue-800' : 'text-white'
              }`}
            >
              <ListIcon className="h-5 w-5" />
              <span>Manage Complaints</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'dashboard' ? <DashboardContent /> : <ManageComplaints />}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;