import React, { useEffect } from 'react';
import { LogOutIcon } from 'lucide-react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, token, logout } = useAuth();
  const [showLogin, setShowLogin] = React.useState(true);

  const isLoggedIn = !!user && !!token;
  const isAdmin = user?.email === 'admin@bitmesra.ac.in';

  const handleLogout = () => {
    logout();
    setShowLogin(true);
  };

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
            <div>
              <h1 className="text-xl font-bold">BIT MESRA</h1>
              <p className="text-sm">Electric Office Complaint</p>
            </div>
          </div>
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
            >
              <LogOutIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowLogin(true)}
                className={`px-4 py-2 rounded ${showLogin ? 'bg-white text-blue-800' : 'text-white'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setShowLogin(false)}
                className={`px-4 py-2 rounded ${!showLogin ? 'bg-white text-blue-800' : 'text-white'}`}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {isLoggedIn ? (
          isAdmin ? <AdminDashboard /> : <Dashboard />
        ) : (
          <div className="max-w-md mx-auto">
            {showLogin ? (
              <Login onLogin={() => {}} />
            ) : (
              <Signup onSignup={() => setShowLogin(true)} />
            )}
          </div>
        )}
      </main>

      <footer className="bg-blue-800 text-white py-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>© 2025 BIT Mesra Electric Office. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;