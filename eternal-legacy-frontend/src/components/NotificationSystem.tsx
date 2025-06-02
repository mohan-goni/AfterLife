import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Component for implementing the notification system
const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch notifications from the server
    const fetchNotifications = async () => {
      try {
        // This would be replaced with an actual API call
        // const response = await axios.get('http://localhost:5000/api/notifications');
        // setNotifications(response.data.notifications);
        
        // Mock data for now
        setNotifications([
          {
            id: 1,
            type: 'collaboration_invite',
            message: 'John Doe invited you to collaborate on "Family Legacy"',
            isRead: false,
            createdAt: new Date().toISOString(),
            data: { legacyId: 123 }
          },
          {
            id: 2,
            type: 'story_added',
            message: 'Jane Smith added a new story to "Grandpa\'s Memories"',
            isRead: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            data: { legacyId: 456, storyId: 789 }
          }
        ]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      // This would be replaced with an actual API call
      // await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // This would be replaced with an actual API call
      // await axios.put('http://localhost:5000/api/notifications/read-all');
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading notifications...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-4 ${!notification.isRead ? 'bg-indigo-50' : ''}`}
            >
              <div className="flex justify-between">
                <p className={`text-sm ${!notification.isRead ? 'font-medium' : 'text-gray-500'}`}>
                  {notification.message}
                </p>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-2 text-xs text-indigo-600 hover:text-indigo-500"
                  >
                    Mark as read
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationSystem;
