import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/api';
import DataTable from '../shared/DataTable';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });
  
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.limit,
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery })
      };

      const response = await api.get('/admin/orders', params);
      
      if (response.data.success) {
        setOrders(response.data.data.orders);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (response.data.success) {
        alert('Order status updated successfully');
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleViewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { class: 'pending', label: 'Pending' },
      'confirmed': { class: 'confirmed', label: 'Confirmed' },
      'in_queue': { class: 'in_queue', label: 'In Queue' },
      'in_process': { class: 'in_process', label: 'In Process' },
      'ready_to_ship': { class: 'ready_to_ship', label: 'Ready to Ship' },
      'shipped': { class: 'shipped', label: 'Shipped' },
      'on_the_way': { class: 'on_the_way', label: 'On the Way' },
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

  const columns = [
    { key: 'orderNumber', title: 'Order #' },
    { key: 'customer', title: 'Customer' },
    { key: 'items', title: 'Items' },
    { key: 'total', title: 'Total' },
    { key: 'status', title: 'Status' },
    { key: 'date', title: 'Date' },
    { key: 'actions', title: 'Actions' }
  ];

  const tableData = orders.map(order => ({
    id: order._id,
    orderNumber: order.orderNumber,
    customer: order.user?.fullName || order.shippingAddress?.fullName || 'N/A',
    items: `${order.items?.length || 0} item(s)`,
    total: `$${order.pricing?.total || 0}`,
    status: (
      <select 
        value={order.status} 
        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
        className="status-select"
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="in_process">In Process</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    ),
    date: new Date(order.createdAt).toLocaleDateString(),
    actions: (
      <button 
        className="btn-icon btn-primary" 
        onClick={() => handleViewOrderDetail(order)}
        title="View Details"
      >
        <FontAwesomeIcon icon={faEye} />
      </button>
    )
  }));

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h2>Order Management</h2>
      </div>

      <div className="filters-bar">
        <div className="filter-group" style={{ flex: 2 }}>
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by order #, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_process">In Process</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

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
        emptyMessage="No orders found"
      />

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="btn-secondary"
            disabled={pagination.current === 1}
            onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
          >
            <i className="fas fa-chevron-left"></i> Previous
          </button>
          <span className="pagination-info">Page {pagination.current} of {pagination.pages}</span>
          <button
            className="btn-secondary"
            disabled={pagination.current === pagination.pages}
            onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
          >
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Order Detail Drawer */}
      {showOrderDetail && selectedOrder && (
        <div className="drawer-overlay" onClick={() => setShowOrderDetail(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Order Details - {selectedOrder.orderNumber}</h3>
              <button className="btn-icon" onClick={() => setShowOrderDetail(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="drawer-body">
              <div className="detail-section">
                <h4>Order Information</h4>
                <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.payment?.method || 'N/A'}</p>
                <p><strong>Payment Status:</strong> {selectedOrder.payment?.status || 'N/A'}</p>
              </div>

              <div className="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.user?.fullName || selectedOrder.shippingAddress?.fullName || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phoneNumber || selectedOrder.user?.phoneNumber || 'N/A'}</p>
              </div>

              <div className="detail-section">
                <h4>Shipping Address</h4>
                {selectedOrder.shippingAddress ? (
                  <>
                    <p>{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </>
                ) : (
                  <p>No shipping address provided</p>
                )}
              </div>
              
              <div className="detail-section">
                <h4>Order Items</h4>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img 
                      src={item.product?.productImages?.[0] || '/default-product.png'} 
                      alt={item.product?.productName || 'Product'}
                      className="item-image"
                    />
                    <div className="item-details">
                      <p><strong>{item.product?.productName || item.productName || 'Product'}</strong></p>
                      <p>Quantity: {item.quantity || 0}</p>
                      <p>Price: ${(item.unitPrice || 0).toFixed(2)}</p>
                      <p>Subtotal: ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="detail-section">
                <h4>Order Summary</h4>
                <p><strong>Subtotal:</strong> ${(selectedOrder.pricing?.subtotal || 0).toFixed(2)}</p>
                <p><strong>Shipping:</strong> ${(selectedOrder.pricing?.shipping || 0).toFixed(2)}</p>
                <p><strong>Tax:</strong> ${(selectedOrder.pricing?.tax || 0).toFixed(2)}</p>
                {selectedOrder.pricing?.discount > 0 && (
                  <p><strong>Discount:</strong> -${(selectedOrder.pricing?.discount || 0).toFixed(2)}</p>
                )}
                {selectedOrder.appliedCoupon && (
                  <p><strong>Coupon:</strong> {selectedOrder.appliedCoupon.code || selectedOrder.appliedCoupon}</p>
                )}
                <p className="total-row total-final"><strong>Total:</strong> ${(selectedOrder.pricing?.total || 0).toFixed(2)}</p>
              </div>

              <div className="detail-section">
                <h4>Update Status</h4>
                <select 
                  value={selectedOrder.status} 
                  onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_queue">In Queue</option>
                  <option value="in_process">In Process</option>
                  <option value="ready_to_ship">Ready to Ship</option>
                  <option value="shipped">Shipped</option>
                  <option value="on_the_way">On the Way</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

