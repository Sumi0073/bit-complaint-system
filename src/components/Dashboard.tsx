import React, { useState } from 'react';
import ComplaintForm from './ComplaintForm';
import TrackingPage from './TrackingPage';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('complaint');

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() => setActiveTab('complaint')}
          className={`px-4 py-2 rounded ${activeTab === 'complaint' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          New Complaint
        </button>
        <button
          onClick={() => setActiveTab('tracking')}
          className={`px-4 py-2 rounded ${activeTab === 'tracking' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Track Complaints
        </button>
      </div>

      {activeTab === 'complaint' ? <ComplaintForm /> : <TrackingPage />}
    </div>
  );
}

export default Dashboard;