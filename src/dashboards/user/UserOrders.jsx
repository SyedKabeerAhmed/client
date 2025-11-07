import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import StatusFilter from '../shared/StatusFilter';
import DataTable from '../shared/DataTable';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import './UserOrders.css';

const UserOrders = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    awaitingPayment: 0,
    awaitingShipment: 0,
    shipmentTracking: 0,
    awaitingReviews: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [activeFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = activeFilter !== 'all' ? { status: activeFilter } : {};
      const response = await api.get('/user/orders', { params });
      
      if (response.data.success) {
        setOrders(response.data.data.orders);
        // Update stats based on current orders
        updateStats(response.data.data.orders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Orders fetch error:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (ordersData) => {
    const newStats = {
      awaitingPayment: ordersData.filter(order => 
        order.payment.status === 'pending' && order.payment.method === 'card_payment'
      ).length,
      awaitingShipment: ordersData.filter(order => 
        ['confirmed', 'in_queue', 'in_process'].includes(order.status)
      ).length,
      shipmentTracking: ordersData.filter(order => 
        ['shipped', 'on_the_way'].includes(order.status)
      ).length,
      awaitingReviews: ordersData.filter(order => 
        order.status === 'delivered'
      ).length
    };
    setStats(newStats);
  };

  const filters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'awaiting_payment', label: 'Awaiting Payment', count: stats.awaitingPayment },
    { id: 'awaiting_shipment', label: 'Awaiting Shipment', count: stats.awaitingShipment },
    { id: 'shipment_tracking', label: 'Shipment Tracking', count: stats.shipmentTracking },
    { id: 'awaiting_reviews', label: 'Awaiting Reviews', count: stats.awaitingReviews }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { class: 'pending', label: 'Pending' },
      'confirmed': { class: 'confirmed', label: 'Confirmed' },
      'in_queue': { class: 'in_queue', label: 'In Queue' },
      'in_process': { class: 'in_process', label: 'In Process' },
      'ready_to_ship': { class: 'ready_to_ship', label: 'Ready to Ship' },
      'shipped': { class: 'shipped', label: 'Shipped' },
      'on_the_way': { class: 'shipped', label: 'On the Way' },
      'delivered': { class: 'delivered', label: 'Delivered' },
      'cancelled': { class: 'cancelled', label: 'Cancelled' }
    };
    
    const statusInfo = statusMap[status] || { class: 'pending', label: status };
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const handleLogout = () => {
    logout();
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  const handleOrderClick = (order) => {
    // Navigate to order details or tracking
    console.log('Order clicked:', order);
  };

  const columns = [
    {
      key: 'product',
      title: 'Product',
      className: 'product-column',
      render: (value, order) => (
        <div className="product-info">
          <img 
            src={order.items[0]?.product?.images?.[0] || '/default-product.png'} 
            alt="Product" 
            className="product-image"
          />
          <div>
            <p className="product-name">{order.items[0]?.product?.name || 'Product'}</p>
            <p className="product-code">{order.items[0]?.productCode || 'N/A'}</p>
            <button className="delete-btn">
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (value, order) => `$${order.items[0]?.unitPrice || 0}`
    },
    {
      key: 'quantity',
      title: 'Quantity',
      render: (value, order) => (
        <div className="quantity-control">
          <button className="qty-btn">-</button>
          <span>{order.items[0]?.quantity || 1}</span>
          <button className="qty-btn">+</button>
        </div>
      )
    },
    {
      key: 'subtotal',
      title: 'Subtotal',
      render: (value, order) => `$${order.pricing?.total || 0}`
    },
    {
      key: 'status',
      title: 'Status',
      render: (value, order) => getStatusBadge(order.status)
    }
  ];

  return (
    <Layout
      activePage={activePage}
      onPageChange={handlePageChange}
      user={user}
      userRole="user"
      onLogout={handleLogout}
      title="Orders"
    >
      <div className="user-orders">
        <StatusFilter
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
        
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          emptyMessage="No orders found"
          onRowClick={handleOrderClick}
        />
      </div>
    </Layout>
  );
};

export default UserOrders;
