import React, { useState } from 'react';
import axios from 'axios';

// Component for implementing sharing and privacy controls
const SharingPrivacyControls = ({ legacyId, initialPrivacyLevel = 'private', onUpdate }) => {
  const [privacyLevel, setPrivacyLevel] = useState(initialPrivacyLevel);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('contributor');

  const handlePrivacyChange = async (newLevel) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.put(`http://localhost:5000/api/legacies/${legacyId}`, {
        privacy_level: newLevel
      });
      
      setPrivacyLevel(newLevel);
      setSuccess(`Privacy level updated to ${newLevel}`);
      
      if (onUpdate) {
        onUpdate({ privacy_level: newLevel });
      }
    } catch (error) {
      console.error('Error updating privacy level:', error);
      setError('Failed to update privacy level. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }
    
    try {
      // This would be replaced with an actual API call
      // await axios.post(`http://localhost:5000/api/legacies/${legacyId}/collaborators`, {
      //   email,
      //   role
      // });
      
      setSuccess(`Invitation sent to ${email}`);
      setEmail('');
    } catch (error) {
      console.error('Error sending invitation:', error);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Sharing & Privacy</h3>
      </div>
      
      <div className="p-4">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
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
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Privacy Level</h4>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <input
                id="privacy-private"
                name="privacy-level"
                type="radio"
                checked={privacyLevel === 'private'}
                onChange={() => handlePrivacyChange('private')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="privacy-private" className="ml-3 block text-sm font-medium text-gray-700">
                Private (Only you)
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="privacy-shared"
                name="privacy-level"
                type="radio"
                checked={privacyLevel === 'shared'}
                onChange={() => handlePrivacyChange('shared')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="privacy-shared" className="ml-3 block text-sm font-medium text-gray-700">
                Shared (You and invited people)
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="privacy-public"
                name="privacy-level"
                type="radio"
                checked={privacyLevel === 'public'}
                onChange={() => handlePrivacyChange('public')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="privacy-public" className="ml-3 block text-sm font-medium text-gray-700">
                Public (Anyone)
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Invite Collaborators</h4>
          <form onSubmit={handleInvite} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="viewer">Viewer (can only view)</option>
                <option value="contributor">Contributor (can add content)</option>
                <option value="editor">Editor (can edit everything)</option>
              </select>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isLoading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Share Link</h4>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={`http://localhost:3000/legacy/${legacyId}`}
              className="flex-1 block w-full border border-gray-300 rounded-md rounded-r-none shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
            />
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 border-l-0 rounded-r-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                navigator.clipboard.writeText(`http://localhost:3000/legacy/${legacyId}`);
                setSuccess('Link copied to clipboard');
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharingPrivacyControls;
