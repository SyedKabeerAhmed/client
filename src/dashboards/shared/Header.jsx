import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/api';
import './Header.css';

const Header = ({ title, user, onLogout, userRole, activePage, onPageChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notifications function (for all dashboard roles)
  const fetchNotifications = useCallback(async () => {
    if (!userRole || !user) return;

    try {
      setNotificationsLoading(true);
      const response = await api.get(`/${userRole}/notifications?limit=10`);
      if (response.data.success) {
        setNotifications(response.data.data.notifications || []);
        setUnreadCount(response.data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  }, [userRole, user]);

  // Fetch notifications on mount and when userRole changes
  useEffect(() => {
    if (userRole && user) {
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userRole, user, fetchNotifications]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleNotificationDropdown = async () => {
    const newState = !notificationDropdownOpen;
    setNotificationDropdownOpen(newState);
    
    // Fetch fresh notifications when opening
    if (newState) {
      await fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    
    try {
      await api.put(`/${userRole}/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      try {
        await api.put(`/${userRole}/notifications/${notification._id}/read`);
        setNotifications(prev => prev.map(n => 
          n._id === notification._id ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Close dropdown
    setNotificationDropdownOpen(false);

    // Navigate if actionUrl exists
    if (notification.actionUrl && onPageChange) {
      // Extract page from actionUrl (e.g., '/admin/orders' -> 'orders')
      const urlParts = notification.actionUrl.split('/');
      const page = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
      
      // Check if it's a valid page for the current role
      if (page && ['dashboard', 'orders', 'products', 'categories', 'inventory', 'users', 'coupons'].includes(page)) {
        onPageChange(page);
      } else if (notification.actionUrl.startsWith('http')) {
        // External URL
        window.open(notification.actionUrl, '_blank');
      } else {
        // Internal route
        navigate(notification.actionUrl);
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_update':
        return 'fas fa-box';
      case 'low_stock':
        return 'fas fa-exclamation-triangle';
      case 'inventory_alert':
        return 'fas fa-warehouse';
      case 'promotion':
        return 'fas fa-tag';
      default:
        return 'fas fa-bell';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>
      
      <div className="header-right">
        <div className="header-actions">
          {userRole && (
            <div className="notification-wrapper" ref={notificationDropdownRef}>
              <button 
                className="notification-btn" 
                onClick={toggleNotificationDropdown}
                title="Notifications"
              >
                <FontAwesomeIcon icon={faBell} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </button>
              
              {notificationDropdownOpen && (
                <div className="notification-dropdown">
                  <div className="notification-dropdown-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="unread-count">{unreadCount} unread</span>
                    )}
                  </div>
                  
                  <div className="notification-list">
                    {notificationsLoading ? (
                      <div className="notification-loading">Loading...</div>
                    ) : notifications.length === 0 ? (
                      <div className="notification-empty">No notifications</div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="notification-icon" style={{ color: getPriorityColor(notification.priority) }}>
                            <i className={getNotificationIcon(notification.type)}></i>
                          </div>
                          <div className="notification-content">
                            <div className="notification-title">{notification.title}</div>
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-time">{formatTimeAgo(notification.createdAt)}</div>
                          </div>
                          {!notification.isRead && (
                            <button
                              className="notification-mark-read"
                              onClick={(e) => handleMarkAsRead(notification._id, e)}
                              title="Mark as read"
                            >
                              <i className="fas fa-circle"></i>
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="notification-footer">
                      <button 
                        className="view-all-notifications"
                        onClick={() => {
                          setNotificationDropdownOpen(false);
                          if (onPageChange) onPageChange('dashboard');
                        }}
                      >
                        View All
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="user-profile" ref={dropdownRef}>
            <div className="user-menu-toggle" onClick={toggleDropdown}>
              <img 
                src={user?.avatar || '/default-avatar.png'} 
                alt="Profile" 
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0QTkwRTIiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
                }}
              />
              <div className="user-info-header">
                <span className="user-name">{user?.fullName || 'User'}</span>
                <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'} dropdown-arrow`}></i>
              </div>
            </div>
            
            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-item user-info-item">
                  <i className="fas fa-user me-2"></i>
                  <div>
                    <div className="dropdown-user-name">{user?.fullName || 'User'}</div>
                    <div className="dropdown-user-email">{user?.email || ''}</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button onClick={() => { onLogout(); setDropdownOpen(false); }} className="dropdown-item logout-item">
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
