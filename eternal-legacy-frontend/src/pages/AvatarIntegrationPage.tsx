import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ThreeDCloneCompanion from '../components/ThreeDCloneCompanion';
import AIGuidanceSystem from '../components/AIGuidanceSystem';

const AvatarIntegrationPage = () => {
  const { legacyId } = useParams();
  const [activeTab, setActiveTab] = useState('create');
  const [hasAvatar, setHasAvatar] = useState(false);

  // Check if user already has an avatar
  useEffect(() => {
    // This would be replaced with an actual API call
    // const checkAvatar = async () => {
    //   try {
    //     const response = await axios.get(`http://localhost:5000/api/avatar/check`);
    //     setHasAvatar(response.data.hasAvatar);
    //   } catch (error) {
    //     console.error('Error checking avatar:', error);
    //   }
    // };
    
    // checkAvatar();
    
    // Mock data for now
    setHasAvatar(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Digital Avatar Experience</h1>
          <p className="mt-1 text-sm text-white opacity-80">
            Create and interact with your personalized 3D companion
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('create')}
            >
              {hasAvatar ? 'Edit Avatar' : 'Create Avatar'}
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'interact'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('interact')}
              disabled={!hasAvatar}
            >
              Interact with Avatar
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('settings')}
              disabled={!hasAvatar}
            >
              Avatar Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {activeTab === 'create' && (
            <ThreeDCloneCompanion />
          )}
          
          {activeTab === 'interact' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Interact with Your Digital Avatar
                </h2>
                
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* 3D Avatar Display */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                    {/* This would be replaced with the actual 3D avatar */}
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Avatar Preview</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Your 3D avatar will appear here
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Guidance System */}
                  <div className="h-500px">
                    <AIGuidanceSystem legacyId={legacyId} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Avatar Settings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Voice Settings</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Voice Speed
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          defaultValue="1"
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Slow</span>
                          <span>Normal</span>
                          <span>Fast</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Voice Tone
                        </label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                          <option>Natural</option>
                          <option>Warm</option>
                          <option>Professional</option>
                          <option>Friendly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Avatar Appearance</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Background
                        </label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                          <option>Neutral</option>
                          <option>Gradient</option>
                          <option>Nature</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Animation Style
                        </label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                          <option>Natural</option>
                          <option>Minimal</option>
                          <option>Expressive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">AI Personality</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Conversation Style
                        </label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                          <option>Conversational</option>
                          <option>Informative</option>
                          <option>Supportive</option>
                          <option>Reflective</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Memory Access
                        </label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                          <option>All Memories</option>
                          <option>Selected Categories</option>
                          <option>Time-Based</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Reset to Default
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AvatarIntegrationPage;
