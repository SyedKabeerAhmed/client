import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({
  children,
  activePage,
  onPageChange,
  user,
  userRole,
  onLogout,
  title
}) => {
  return (
    <div className="dashboard-layout">
      <Sidebar
        activePage={activePage}
        onPageChange={onPageChange}
        userRole={userRole}
        user={user}
      />

      <div className="dashboard-content">
        <Header
          title={title}
          user={user}
          onLogout={onLogout}
          userRole={userRole}
          activePage={activePage}
          onPageChange={onPageChange}
        />

        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
