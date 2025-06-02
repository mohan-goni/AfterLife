import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateLegacy = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/legacies', {
        title: data.title,
        description: data.description,
        birth_date: data.birthDate || null,
        death_date: data.deathDate || null,
        privacy_level: data.privacyLevel
      });
      
      navigate(`/legacy/${response.data.legacy.id}`);
    } catch (error) {
      console.error('Error creating legacy:', error);
      setError(
        error.response?.data?.error || 
        'An error occurred while creating the legacy. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Create New Legacy</h1>
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
                
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Legacy Information</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Create a new legacy to preserve memories and stories for future generations.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="title"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            {...register('title', { required: 'Title is required' })}
                          />
                          {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            rows={3}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            {...register('description')}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Brief description of this legacy and who it's for.
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                          Birth Date (Optional)
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            id="birthDate"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            {...register('birthDate')}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="deathDate" className="block text-sm font-medium text-gray-700">
                          Death Date (Optional)
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            id="deathDate"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            {...register('deathDate')}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="privacyLevel" className="block text-sm font-medium text-gray-700">
                          Privacy Level
                        </label>
                        <div className="mt-1">
                          <select
                            id="privacyLevel"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            {...register('privacyLevel', { required: 'Privacy level is required' })}
                          >
                            <option value="private">Private (Only you)</option>
                            <option value="shared">Shared (You and invited people)</option>
                            <option value="public">Public (Anyone)</option>
                          </select>
                          {errors.privacyLevel && (
                            <p className="mt-1 text-sm text-red-600">{errors.privacyLevel.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
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
                          Creating...
                        </>
                      ) : (
                        'Create Legacy'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateLegacy;
