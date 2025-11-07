import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './admin/AdminDashboard';
import SubAdminDashboard from './subadmin/SubAdminDashboard';
import FactoryDashboard from './factory/FactoryDashboard';

const DashboardRouter = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Determine user role and render appropriate dashboard
  const getUserRole = () => {
    // Check if user has role field (new system)
    if (user?.role) {
      return user.role;
    }
    
    // Fallback to userType for backward compatibility
    if (user?.userType === 'admin') {
      return 'admin';
    }
    
    // Default to user role
    return 'user';
  };

  const userRole = getUserRole();

  // If URL path conflicts with the user's role, redirect to the proper route
  const path = location.pathname;
  const roleToPath = {
    admin: '/admin/dashboard',
    subadmin: '/subadmin/dashboard',
    factory: '/factory/dashboard',
    user: '/dashboard',
    business_user: '/dashboard',
    individual_user: '/dashboard'
  };
  const expectedPath = roleToPath[userRole] || '/dashboard';
  if (!path.startsWith(expectedPath)) {
    return <Navigate to={expectedPath} replace />;
  }

  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'subadmin':
      return <SubAdminDashboard />;
    case 'factory':
      return <FactoryDashboard />;
    case 'business_user':
    case 'individual_user':
    case 'user':
    default:
      return <UserDashboard />;
  }
};

export default DashboardRouter;
