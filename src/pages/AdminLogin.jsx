import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        
        // Redirect based on user role
        setTimeout(() => {
          const userRole = result.user?.role;
          switch (userRole) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'subadmin':
              navigate('/subadmin/dashboard');
              break;
            case 'factory':
              navigate('/factory/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        }, 1000);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fillTestCredentials = (role) => {
    const credentials = {
      admin: { email: 'admin@hairstore.com', password: 'admin123' },
      subadmin: { email: 'subadmin@hairstore.com', password: 'subadmin123' },
      factory: { email: 'factory@hairstore.com', password: 'factory123' }
    };
    
    const creds = credentials[role];
    if (creds) {
      setFormData(prev => ({
        ...prev,
        email: creds.email,
        password: creds.password,
        role: role
      }));
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <div className="admin-icon">
            <FontAwesomeIcon icon={faShieldAlt} />
          </div>
          <h2>Admin Portal</h2>
          <p>Access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="admin">
                Super Admin
              </option>
              <option value="subadmin">
                Sub Admin
              </option>
              <option value="factory">
                Factory User
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>
            <div className="input-group">
              <div className="input-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>
            <div className="input-group">
              <div className="input-icon">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
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

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>
                  Signing In...
                </span>
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                <span>
                  Sign In
                </span>
              </>
            )}
          </button>
        </form>

        <div className="test-credentials">
          <h4>
            Test Credentials
          </h4>
          <div className="credential-buttons">
            <button
              type="button"
              className="cred-btn admin"
              onClick={() => fillTestCredentials('admin')}
            >
              <span>
                Super Admin
              </span>
            </button>
            <button
              type="button"
              className="cred-btn subadmin"
              onClick={() => fillTestCredentials('subadmin')}
            >
              <span>
                Sub Admin
              </span>
            </button>
            <button
              type="button"
              className="cred-btn factory"
              onClick={() => fillTestCredentials('factory')}
            >
              <span>
                Factory User
              </span>
            </button>
          </div>
        </div>

        <div className="login-footer">
          <Link
            to="/login"
            className="back-to-login"
           
          >
            <i className="fas fa-arrow-left"></i>
            Back to Customer Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
