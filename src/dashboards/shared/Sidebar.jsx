import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activePage, onPageChange, userRole, user }) => {
  const getNavigationItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
          { id: 'users', label: 'Users', icon: 'fas fa-users' },
          { id: 'products', label: 'Products', icon: 'fas fa-cube' },
          { id: 'orders', label: 'Orders', icon: 'fas fa-box' },
          { id: 'categories', label: 'Categories', icon: 'fas fa-tags' },
          { id: 'coupons', label: 'Coupons', icon: 'fas fa-ticket-alt' },
          { id: 'inventory', label: 'Inventory', icon: 'fas fa-warehouse' }
        ];

      case 'subadmin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
          { id: 'products', label: 'Products', icon: 'fas fa-cube' },
          { id: 'orders', label: 'Orders', icon: 'fas fa-box' },
          { id: 'categories', label: 'Categories', icon: 'fas fa-tags' }
        ];

      case 'factory':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
          { id: 'orders', label: 'Orders', icon: 'fas fa-box' },
          { id: 'inventory', label: 'Inventory', icon: 'fas fa-warehouse' },
          { id: 'installments', label: 'Installments', icon: 'fas fa-calendar-alt' }
        ];

      default: // user
        const items = [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
          { id: 'orders', label: 'Orders', icon: 'fas fa-box' },
          { id: 'installments', label: 'Installments', icon: 'fas fa-calendar-alt' },
          { id: 'wishlist', label: 'Wishlist', icon: 'fas fa-heart' },
          { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
          { id: 'discounts', label: 'Discounts', icon: 'fas fa-ticket-alt' }
        ];

        return items;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Novum</h3>
      </div>

      <nav className="sidebar-nav">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <i className="fas fa-user-circle"></i>
          <span>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
