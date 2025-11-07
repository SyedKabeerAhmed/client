import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/api';
import DataTable from '../shared/DataTable';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  
  // Filters
  const [roleFilter, setRoleFilter] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userFormData, setUserFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'subadmin',
    userType: 'admin'
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, roleFilter, userTypeFilter, searchQuery, isActiveFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.current,
        limit: pagination.limit,
        ...(roleFilter && { role: roleFilter }),
        ...(userTypeFilter && { userType: userTypeFilter }),
        ...(searchQuery && { search: searchQuery }),
        ...(isActiveFilter !== '' && { isActive: isActiveFilter })
      };

      const response = await api.get('/admin/users', params);
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      setError(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        alert('User deleted successfully');
        fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, { role: newRole });
      if (response.data.success) {
        alert('User role updated successfully');
        fetchUsers();
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Update user role error:', error);
      alert(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleCreateUser = () => {
    setUserFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: 'subadmin',
      userType: 'admin'
    });
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setUserFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: 'subadmin',
      userType: 'admin'
    });
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/admin/users', userFormData);
      if (response.data.success) {
        alert('User created successfully');
        handleCloseCreateModal();
        fetchUsers();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user');
    }
  };

  const columns = [
    { key: 'fullName', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' },
    { key: 'userType', title: 'Type' },
    { key: 'status', title: 'Status' },
    { key: 'joined', title: 'Joined' },
    { key: 'actions', title: 'Actions' }
  ];

  const tableData = users.map(user => ({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: (
      <select 
        value={user.role} 
        onChange={(e) => handleRoleChange(user._id, e.target.value)}
        className="role-select"
      >
        <option value="user">User</option>
        <option value="business_user">Business</option>
        <option value="individual_user">Individual</option>
        <option value="admin">Admin</option>
      </select>
    ),
    userType: user.userType || 'Consumer',
    status: (
      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
        {user.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
    joined: new Date(user.createdAt).toLocaleDateString(),
    actions: (
      <div className="actions-cell">
            <button 
          className="btn-icon btn-danger"
          onClick={() => handleDelete(user._id)}
          title="Delete User"
            >
              <i className="fas fa-trash"></i>
            </button>
        </div>
      )
  }));

  return (
      <div className="admin-users">
      <div className="admin-page-header">
          <h2>User Management</h2>
        <button className="btn-primary" onClick={handleCreateUser}>
          <FontAwesomeIcon icon={faPlus} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="business_user">Business</option>
            <option value="individual_user">Individual</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="filter-group">
          <label>User Type</label>
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="consumer">Consumer</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={isActiveFilter}
            onChange={(e) => setIsActiveFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Stats */}
      <div className="stats-grid-mini">
        <div className="stat-card">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{pagination.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Page</span>
          <span className="stat-value">{pagination.current} of {pagination.pages}</span>
        </div>
      </div>

      {/* Users Table */}
        {error && (
        <div className="error-banner">
          <i className="fas fa-exclamation-circle"></i>
          {error}
          </div>
        )}

        <DataTable
          columns={columns}
        data={tableData}
          loading={loading}
          emptyMessage="No users found"
        />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
                <button 
            className="btn-secondary"
            disabled={pagination.current === 1}
            onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                >
            <i className="fas fa-chevron-left"></i> Previous
                </button>
          
          <span className="pagination-info">
            Page {pagination.current} of {pagination.pages}
          </span>
          
                  <button 
            className="btn-secondary"
            disabled={pagination.current === pagination.pages}
            onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
          >
            Next <i className="fas fa-chevron-right"></i>
                  </button>
          </div>
        )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={handleCloseCreateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New User</h3>
              <button className="btn-icon" onClick={handleCloseCreateModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmitUser} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={userFormData.fullName}
                    onChange={handleUserInputChange}
                    required
                    className="form-input"
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={userFormData.email}
                    onChange={handleUserInputChange}
                    required
                    className="form-input"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={userFormData.phoneNumber}
                    onChange={handleUserInputChange}
                    required
                    className="form-input"
                    placeholder="+1234567890"
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={userFormData.password}
                    onChange={handleUserInputChange}
                    required
                    minLength="6"
                    className="form-input"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserInputChange}
                    required
                    className="form-input"
                  >
                    <option value="subadmin">Sub Admin</option>
                    <option value="admin">Admin</option>
                    <option value="factory">Factory</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>User Type</label>
                  <select
                    name="userType"
                    value={userFormData.userType}
                    onChange={handleUserInputChange}
                    className="form-input"
                  >
                    <option value="admin">Admin</option>
                    <option value="consumer">Consumer</option>
                    <option value="business">Business</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseCreateModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FontAwesomeIcon icon={faSave} /> Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
  );
};

export default AdminUsers;
