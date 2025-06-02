import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password || undefined,
      });
      
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(
        error.response?.data?.error || 
        'An error occurred while updating your profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSetLegacyContact = () => {
    // Navigate to legacy contact page or open modal
    console.log('Set legacy contact');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
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
                
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your personal information and account settings.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="firstName"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            {...register('firstName')}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="lastName"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            {...register('lastName')}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            id="email"
                            disabled
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 bg-gray-50 rounded-md"
                            {...register('email')}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Email address cannot be changed.
                        </p>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          New password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            id="password"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            {...register('password', {
                              minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters'
                              }
                            })}
                          />
                          {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Leave blank to keep your current password.
                        </p>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirm new password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            id="confirmPassword"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            {...register('confirmPassword', {
                              validate: (value) => {
                                const { password } = document.getElementById('password');
                                return !password.value || password.value === value || 'Passwords do not match';
                              }
                            })}
                          />
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Legacy Planning</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Designate a legacy contact who can manage your account and legacies in the event of your passing.
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleSetLegacyContact}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {user?.has_legacy_contact ? 'Change Legacy Contact' : 'Set Legacy Contact'}
                    </button>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Account Actions</h3>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Log Out
                    </button>
                    <button
                      type="button"
                      className="ml-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Deactivate Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
