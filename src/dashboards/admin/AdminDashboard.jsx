import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import StatsCard from '../shared/StatsCard';
import DataTable from '../shared/DataTable';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/Toast';
import { SalesTrendChart, OrderStatusChart } from '../../components/Chart';
import api from '../../config/api';
import AdminUsers from './AdminUsers';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminCategories from './AdminCategories';
import AdminCoupons from './AdminCoupons';
import AdminInventory from './AdminInventory';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [activePage, setActivePage] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Admin dashboard fetch error:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <Layout
        activePage={activePage}
        onPageChange={handlePageChange}
        user={user}
        userRole="admin"
        onLogout={handleLogout}
        title="Dashboard"
      >
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        activePage={activePage}
        onPageChange={handlePageChange}
        user={user}
        userRole="admin"
        onLogout={handleLogout}
        title="Dashboard"
      >
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      </Layout>
    );
  }

  const renderDashboard = () => {
    if (!dashboardData) return null;

    return (
      <div className="admin-dashboard">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Admin Dashboard</h2>
          <p>Manage your system, users, orders, and products from here.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatsCard
            title="Total Users"
            value={dashboardData.stats.totalUsers}
            icon="fas fa-users"
            color="blue"
          />
          <StatsCard
            title="Total Orders"
            value={dashboardData.stats.totalOrders}
            icon="fas fa-box"
            color="green"
          />
          <StatsCard
            title="Total Products"
            value={dashboardData.stats.totalProducts}
            icon="fas fa-cube"
            color="purple"
          />
          <StatsCard
            title="Total Coupons"
            value={dashboardData.stats.totalCoupons}
            icon="fas fa-ticket-alt"
            color="yellow"
          />
        </div>

        {/* Order Status Stats */}
        <div className="order-stats-grid">
          <StatsCard
            title="Pending Orders"
            value={dashboardData.stats.pendingOrders}
            icon="fas fa-clock"
            color="yellow"
          />
          <StatsCard
            title="Processing Orders"
            value={dashboardData.stats.processingOrders}
            icon="fas fa-cog"
            color="blue"
          />
          <StatsCard
            title="Shipped Orders"
            value={dashboardData.stats.shippedOrders}
            icon="fas fa-shipping-fast"
            color="green"
          />
          <StatsCard
            title="Delivered Orders"
            value={dashboardData.stats.deliveredOrders}
            icon="fas fa-check-circle"
            color="indigo"
          />
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="section-header">
            <h3>Recent Orders</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <DataTable
            columns={[
              { key: 'orderNumber', title: 'Order Number' },
              { key: 'customer', title: 'Customer' },
              { key: 'products', title: 'Products' },
              { key: 'total', title: 'Total' },
              { key: 'status', title: 'Status' },
              { key: 'date', title: 'Date' }
            ]}
            data={dashboardData.recentOrders.map(order => ({
              id: order._id,
              orderNumber: order.orderNumber,
              customer: (
                <div className="customer-info">
                  <p className="customer-name">{order.user?.fullName || 'N/A'}</p>
                  <p className="customer-email">{order.user?.email || 'N/A'}</p>
                </div>
              ),
              products: `${order.items.length} item(s)`,
              total: `$${order.pricing?.total || 0}`,
              status: (
                <span className={`status-badge ${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              ),
              date: new Date(order.createdAt).toLocaleDateString()
            }))}
            emptyMessage="No recent orders found"
          />
        </div>

        {/* Recent Users */}
        <div className="recent-users">
          <div className="section-header">
            <h3>Recent Users</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <DataTable
            columns={[
              { key: 'name', title: 'Name' },
              { key: 'email', title: 'Email' },
              { key: 'type', title: 'Type' },
              { key: 'status', title: 'Status' },
              { key: 'joined', title: 'Joined' }
            ]}
            data={dashboardData.recentUsers.map(user => ({
              id: user._id,
              name: user.fullName,
              email: user.email,
              type: user.userType?.charAt(0).toUpperCase() + user.userType?.slice(1) || 'Consumer',
              status: (
                <span className="status-badge active">
                  Active
                </span>
              ),
              joined: new Date(user.createdAt).toLocaleDateString()
            }))}
            emptyMessage="No recent users found"
          />
        </div>

        {/* Analytics Charts */}
        {dashboardData.salesAnalytics && (
          <div className="analytics-section">
            <div className="chart-container">
              <h3 className="chart-title">
                <i className="fas fa-chart-line"></i>
                Sales Trends (Last 30 Days)
              </h3>
              <SalesTrendChart 
                data={dashboardData.salesAnalytics.map(item => ({
                  name: `${item._id.month}/${item._id.day}`,
                  sales: item.totalSales
                }))} 
              />
            </div>

            <div className="chart-container">
              <h3 className="chart-title">
                <i className="fas fa-chart-bar"></i>
                Order Status Distribution
              </h3>
              <OrderStatusChart 
                data={[
                  { name: 'Pending', count: dashboardData.stats.pendingOrders },
                  { name: 'Processing', count: dashboardData.stats.processingOrders },
                  { name: 'Shipped', count: dashboardData.stats.shippedOrders },
                  { name: 'Delivered', count: dashboardData.stats.deliveredOrders }
                ]} 
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUsers = () => {
    return <AdminUsers />;
  };

  const renderOrders = () => {
    return <AdminOrders />;
  };

  const renderProducts = () => {
    return <AdminProducts />;
  };

  const renderCategories = () => {
    return <AdminCategories />;
  };

  const renderCoupons = () => {
    return <AdminCoupons />;
  };

  const renderInventory = () => {
    return <AdminInventory />;
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'orders':
        return renderOrders();
      case 'products':
        return renderProducts();
      case 'categories':
        return renderCategories();
      case 'coupons':
        return renderCoupons();
      case 'inventory':
        return renderInventory();
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout
      activePage={activePage}
      onPageChange={handlePageChange}
      user={user}
      userRole="admin"
      onLogout={handleLogout}
      title={activePage.charAt(0).toUpperCase() + activePage.slice(1)}
    >
      {renderPage()}
    </Layout>
  );
};

export default AdminDashboard;
