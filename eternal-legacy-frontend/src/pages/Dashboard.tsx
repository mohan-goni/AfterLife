import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [legacies, setLegacies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLegacies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/legacies');
        setLegacies(response.data.legacies);
      } catch (error) {
        console.error('Error fetching legacies:', error);
        setError('Failed to load your legacies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLegacies();
  }, []);

  const handleCreateLegacy = () => {
    navigate('/create-legacy');
  };

  const handleViewLegacy = (legacyId) => {
    navigate(`/legacy/${legacyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">EternalLegacy</h1>
          <div className="flex items-center">
            <span className="text-white mr-4">Welcome, {user?.first_name || user?.username}</span>
            <button
              onClick={() => navigate('/profile')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Welcome section */}
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Your Digital Legacy Dashboard
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Create, manage, and share your digital legacies with loved ones. Preserve your memories for generations to come.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleCreateLegacy}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create New Legacy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Legacies section */}
          <div className="px-4 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Legacies</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : legacies.length === 0 ? (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">You haven't created any legacies yet.</p>
                  <button
                    type="button"
                    onClick={handleCreateLegacy}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Your First Legacy
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {legacies.map((legacy) => (
                  <div
                    key={legacy.id}
                    className="bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-transform transform hover:scale-105"
                    onClick={() => handleViewLegacy(legacy.id)}
                  >
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${legacy.cover_image || 'https://via.placeholder.com/400x200?text=No+Image'})` }}></div>
                    <div className="px-4 py-4 sm:px-6">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{legacy.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{legacy.description || 'No description provided.'}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {legacy.privacy_level}
                        </span>
                        <span className="ml-2">
                          Created: {new Date(legacy.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
