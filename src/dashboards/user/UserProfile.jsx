import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const [activePage, setActivePage] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put('/auth/profile', formData);
      
      if (response.data.success) {
        updateUser(response.data.data.user);
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || ''
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout
      activePage={activePage}
      onPageChange={handlePageChange}
      user={user}
      userRole="user"
      onLogout={handleLogout}
      title="Profile"
    >
      <div className="user-profile">
        <div className="profile-header">
          <h2>Profile Settings</h2>
          <p>Manage your personal information and account settings</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <span>{success}</span>
          </div>
        )}

        <div className="profile-card">
          <div className="card-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <i className="fas fa-pencil-alt"></i>
                Edit
              </button>
            )}
          </div>

          <div className="card-content">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <img 
                  src="/default-avatar.png" 
                  alt="Profile" 
                  className="profile-avatar"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiM0QTkwRTIiLz4KPHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI0IDI0QzI4LjQxODMgMjQgMzIgMjAuNDE4MyAzMiAxNkMzMiAxMS41ODE3IDI4LjQxODMgOCAyNCA4QzE5LjU4MTcgOCAxNiAxMS41ODE3IDE2IDE2QzE2IDIwLjQxODMgMTkuNTgxNyAyNCAyNCAyNFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNCAyOEMxNy4zNzI2IDI4IDEyIDMzLjM3MjYgMTIgNDBIMzZDMzYgMzMuMzcyNiAzMC42Mjc0IDI4IDI0IDI4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPg==';
                  }}
                />
                {isEditing && (
                  <button className="change-avatar-btn">
                    <i className="fas fa-camera"></i>
                  </button>
                )}
              </div>
              <div className="avatar-info">
                <h4>{user?.fullName || 'User'}</h4>
                <p>{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'disabled'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'disabled'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'disabled'}
                />
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="account-info-card">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>User Type</label>
              <span>{user?.userType || 'Consumer'}</span>
            </div>
            <div className="info-item">
              <label>Account Status</label>
              <span className="status-active">Active</span>
            </div>
            <div className="info-item">
              <label>Email Verified</label>
              <span className={user?.isEmailVerified ? 'status-verified' : 'status-unverified'}>
                {user?.isEmailVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
