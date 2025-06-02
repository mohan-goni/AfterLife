import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LegacyDetail = () => {
  const { id } = useParams();
  const [legacy, setLegacy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('timeline');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLegacy = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/legacies/${id}`);
        setLegacy(response.data.legacy);
      } catch (error) {
        console.error('Error fetching legacy:', error);
        setError('Failed to load legacy details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLegacy();
  }, [id]);

  const handleAddTimelineEvent = () => {
    // Navigate to add timeline event page or open modal
    console.log('Add timeline event');
  };

  const handleAddStory = () => {
    // Navigate to add story page or open modal
    console.log('Add story');
  };

  const handleAddMedia = () => {
    // Navigate to add media page or open modal
    console.log('Add media');
  };

  const handleEditLegacy = () => {
    // Navigate to edit legacy page
    console.log('Edit legacy');
  };

  const handleDeleteLegacy = async () => {
    if (window.confirm('Are you sure you want to delete this legacy? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/legacies/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting legacy:', error);
        alert('Failed to delete legacy. Please try again later.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!legacy) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Legacy Not Found</h2>
          <p className="text-gray-700">The legacy you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with cover image */}
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ 
          backgroundImage: `url(${legacy.cover_image || 'https://via.placeholder.com/1200x400?text=No+Cover+Image'})`,
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white">{legacy.title}</h1>
                {legacy.birth_date && legacy.death_date && (
                  <p className="text-white mt-1">
                    {new Date(legacy.birth_date).toLocaleDateString()} - {new Date(legacy.death_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleEditLegacy}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteLegacy}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'timeline'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stories'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('stories')}
            >
              Stories
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'media'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('media')}
            >
              Media
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'collaborators'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('collaborators')}
            >
              Collaborators
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Description */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">About</h3>
              <p className="mt-1 text-sm text-gray-500">
                {legacy.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Tab content */}
          {activeTab === 'timeline' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Timeline Events</h2>
                <button
                  onClick={handleAddTimelineEvent}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Event
                </button>
              </div>
              
              {legacy.timeline_events && legacy.timeline_events.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {legacy.timeline_events.map((event, eventIdx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== legacy.timeline_events.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {event.event_date && new Date(event.event_date).toLocaleDateString()}
                                  {event.location && ` • ${event.location}`}
                                </p>
                                <p className="text-base font-medium text-gray-900">{event.title}</p>
                                <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-gray-500">No timeline events yet.</p>
                    <button
                      onClick={handleAddTimelineEvent}
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add First Event
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Stories</h2>
                <button
                  onClick={handleAddStory}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Story
                </button>
              </div>
              
              {legacy.stories && legacy.stories.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {legacy.stories.map((story) => (
                    <div key={story.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{story.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          By {story.author_name || 'Anonymous'} • {new Date(story.created_at).toLocaleDateString()}
                        </p>
                        <div className="mt-3 prose prose-sm max-w-none text-gray-500">
                          {story.content.length > 200 
                            ? `${story.content.substring(0, 200)}...` 
                            : story.content}
                        </div>
                        <div className="mt-4">
                          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Read more
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-gray-500">No stories yet.</p>
                    <button
                      onClick={handleAddStory}
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add First Story
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Media Gallery</h2>
                <button
                  onClick={handleAddMedia}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Media
                </button>
              </div>
              
              {legacy.media_items && legacy.media_items.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {legacy.media_items.map((media) => (
                    <div key={media.id} className="group relative">
                      <div className="w-full bg-gray-200 rounded-lg overflow-hidden aspect-w-1 aspect-h-1">
                        {media.media_type === 'image' ? (
                          <img
                            src={`http://localhost:5000/static/${media.file_path}`}
                            alt={media.title || 'Media item'}
                            className="w-full h-full object-center object-cover"
                          />
                        ) : media.media_type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-black">
                            <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        ) : media.media_type === 'audio' ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{media.title || 'Untitled'}</h3>
                        <p className="text-xs text-gray-500">{new Date(media.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-gray-500">No media items yet.</p>
                    <button
                      onClick={handleAddMedia}
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add First Media Item
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'collaborators' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Collaborators</h2>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Invite Collaborator
                </button>
              </div>
              
              {legacy.collaborators && legacy.collaborators.length > 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {legacy.collaborators.map((collaborator) => (
                      <li key={collaborator.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 font-medium">
                                {collaborator.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{collaborator.username}</div>
                              <div className="text-sm text-gray-500">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {collaborator.role}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <button className="text-sm text-gray-500 hover:text-gray-700">
                              Edit
                            </button>
                            <button className="ml-4 text-sm text-red-500 hover:text-red-700">
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-gray-500">No collaborators yet.</p>
                    <button
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Invite First Collaborator
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LegacyDetail;
