import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/api';
import DataTable from '../shared/DataTable';
import './AdminOrders.css';

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'installments'
  const [plans, setPlans] = useState([]);
  const [summary, setSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [inventoryStatus, setInventoryStatus] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'all') {
      fetchOrders();
    } else {
      fetchPlans();
      fetchSummary();
    }
  }, [pagination.current, statusFilter, searchQuery, activeTab]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.limit,
        search: searchQuery
      };
      // Note: adjust api endpoint if needed, assuming the service handles it
      const response = await api.get('/v1/installments', { params });
      if (response.data.success) {
        setPlans(response.data.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch installment plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      setSummaryLoading(true);
      const response = await api.get('/v1/installments/upcoming-summary');
      if (response.data.success) {
        setSummary(response.data.data);
      }
    } catch (error) {
      console.error('Summary fetch error:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.limit,
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery })
      };

      const response = await api.get('/admin/orders', { params });

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

  const getColumns = () => {
    if (activeTab === 'all') {
      return [
        { key: 'orderNumber', title: 'Order #' },
        { key: 'customer', title: 'Customer' },
        { key: 'items', title: 'Items' },
        { key: 'total', title: 'Total' },
        { key: 'status', title: 'Status' },
        { key: 'date', title: 'Date' },
        { key: 'actions', title: 'Actions' }
      ];
    } else {
      return [
        { key: 'orderNumber', title: 'Order #' },
        { key: 'customer', title: 'Customer' },
        { key: 'total', title: 'Total Amount' },
        { key: 'paid', title: 'Paid / Remaining' },
        { key: 'progress', title: 'Progress' },
        { key: 'status', title: 'Plan Status' },
        { key: 'actions', title: 'Actions' }
      ];
    }
  };

  const getTableData = () => {
    if (activeTab === 'all') {
      return orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customer: order.user?.fullName || order.shippingAddress?.fullName || 'N/A',
        items: `${order.items?.length || 0} item(s)`,
        total: `$${(order.pricing?.total || 0).toFixed(2)}`,
        status: (
          <select
            value={order.status}
            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
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
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
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
    } else {
      return plans.map(plan => ({
        id: plan._id,
        orderNumber: plan.order?.orderNumber || 'N/A',
        customer: (
          <div>
            <div>{plan.user?.fullName || 'N/A'}</div>
            <small className="text-muted" style={{ fontSize: '11px' }}>{plan.user?.email}</small>
          </div>
        ),
        total: `$${plan.totalAmount.toFixed(2)}`,
        paid: (
          <div>
            <span className="text-success">${plan.amountPaid.toFixed(2)}</span>
            <span className="mx-1">/</span>
            <span className="text-danger">${(plan.totalAmount - plan.amountPaid).toFixed(2)}</span>
          </div>
        ),
        progress: (
          <div style={{ width: '100px' }}>
            <div className="d-flex justify-content-between mb-1" style={{ fontSize: '10px' }}>
              <span>{plan.installmentsPaid}/{plan.totalInstallments}</span>
              <span>{Math.round((plan.amountPaid / plan.totalAmount) * 100)}%</span>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${(plan.amountPaid / plan.totalAmount) * 100}%` }}
              ></div>
            </div>
          </div>
        ),
        status: (
          <span className={`status-badge ${plan.status}`}>
            {plan.status.toUpperCase()}
          </span>
        ),
        actions: (
          <div className="d-flex gap-2">
            <button
              className="btn-icon btn-primary"
              onClick={() => handleViewOrderDetail(plan.order, plan)}
              title="View Plan Details"
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
          </div>
        )
      }));
    }
  };

  const handleViewOrderDetail = async (order, plan = null) => {
    if (plan) {
      // If we clicked from installments tab, attach the plan to the order object for the drawer
      setSelectedOrder({ ...order, installmentPlan: plan });
      setShowOrderDetail(true);
    } else if (order.installmentPlan) {
      // Fetch full plan details including release schedule with delivery dates
      const planId = typeof order.installmentPlan === 'string' ? order.installmentPlan : order.installmentPlan._id;
      try {
        const response = await api.get(`/v1/installments/${planId}`);
        if (response.data.success) {
          setSelectedOrder({ ...order, installmentPlan: response.data.data });
        } else {
          setSelectedOrder(order);
        }
      } catch (err) {
        console.error('Error fetching plan detail:', err);
        setSelectedOrder(order);
      }
      setShowOrderDetail(true);
    } else {
      setSelectedOrder(order);
      setShowOrderDetail(true);
    }

    // Fetch inventory status for the order items
    setInventoryLoading(true);
    try {
      const invResponse = await api.get(`/admin/orders/${order._id}/inventory-status`);
      if (invResponse.data.success) {
        setInventoryStatus(invResponse.data.data);
      } else {
        setInventoryStatus(null);
      }
    } catch (err) {
      console.error('Error fetching inventory status', err);
      setInventoryStatus(null);
    } finally {
      setInventoryLoading(false);
    }
  };

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h2>Order Management</h2>
        <div className="tab-toggle">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveTab('all'); setPagination({ ...pagination, current: 1 }); }}
          >
            All Orders
          </button>
          <button
            className={`tab-btn ${activeTab === 'installments' ? 'active' : ''}`}
            onClick={() => { setActiveTab('installments'); setPagination({ ...pagination, current: 1 }); }}
          >
            Installment Plans
          </button>
        </div>
      </div>

      {activeTab === 'installments' && summary.some(s => s.isLowStock) && (
        <div className="inventory-alert-banner mb-4">
          <div className="alert-header">
            <i className="fas fa-exclamation-triangle"></i>
            Stock Alert for Upcoming Releases
          </div>
          <div className="alert-body">
            {summary.filter(s => s.isLowStock).map((item, i) => (
              <div key={i} className="alert-item mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                <strong>{item.name}</strong> - {item.stockBaseSizeLabel || 'No Size'} | {item.hairColorName || 'No Color'}
                <br />
                <span className="text-warning">
                  Need: {item.neededTotal} |
                  Base Size Avail: {item.baseAvailableStock !== null && item.baseAvailableStock !== undefined ? item.baseAvailableStock : 'N/A'} |
                  Color Avail: {item.colorAvailableStock !== null && item.colorAvailableStock !== undefined ? item.colorAvailableStock : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
        columns={getColumns()}
        data={getTableData()}
        loading={loading}
        emptyMessage={activeTab === 'all' ? "No orders found" : "No installment plans found"}
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
                    {item.product?.productImages?.[0] && (
                      <img
                        src={item.product?.productImages?.[0]}
                        alt={item.product?.productName || 'Product'}
                        className="item-image"
                      />
                    )}
                    <div className="item-details">
                      <p className="mb-1"><strong>{item.product?.productName || item.productName || 'Product'}</strong></p>
                      <div className="item-attrs mb-1" style={{ fontSize: '13px' }}>
                        {item.stockBaseSizeLabel && <span className="badge bg-secondary me-2">{item.stockBaseSizeLabel}</span>}
                        {item.additionalNotes && item.additionalNotes.includes('Hair Color:') ? (
                          <span className="badge bg-info text-dark">{item.additionalNotes.replace('Hair Color:', '').trim()}</span>
                        ) : item.selectedColor?.hair_color ? (
                          <span className="badge bg-info text-dark">{item.selectedColor.hair_color}</span>
                        ) : null}
                      </div>
                      <p className="text-muted small mb-0">Code: {item.product?.productDetails?.productCode || item.productCode || 'N/A'}</p>
                      <p className="text-muted small mb-0">Qty: {item.quantity || 0} | Unit: ${(item.unitPrice || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {inventoryStatus && inventoryStatus.length > 0 && (
                <div className="detail-section">
                  <h4>Inventory Status</h4>
                  {inventoryLoading ? (
                    <p>Loading inventory...</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered" style={{ fontSize: '13px' }}>
                        <thead className="table-light">
                          <tr>
                            <th>Item</th>
                            <th>Base Size (Available / Reserved)</th>
                            <th>Hair Color (Available)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inventoryStatus.map((inv, idx) => (
                            <tr key={idx}>
                              <td>{inv.productName} <br /><small className="text-muted">Req Qty: {inv.requiredQuantity}</small></td>
                              <td>
                                {inv.baseSize.label}
                                <div className="mt-1">
                                  <span className={`badge ${inv.baseSize.available >= inv.requiredQuantity ? 'bg-success' : 'bg-danger'}`}>
                                    Avail: {inv.baseSize.available}
                                  </span>
                                  <span className="badge bg-secondary ms-1">Rsvd: {inv.baseSize.reserved}</span>
                                </div>
                              </td>
                              <td>
                                {inv.color.name}
                                <div className="mt-1">
                                  <span className={`badge ${inv.color.available >= inv.requiredQuantity ? 'bg-success' : 'bg-danger'}`}>
                                    Avail: {inv.color.available}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {typeof selectedOrder.installmentPlan === 'object' && selectedOrder.installmentPlan !== null && (
                <div className="detail-section installment-details-box">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Installment Progress</h4>
                    {selectedOrder.installmentPlan.status && (
                      <span className={`status-badge ${selectedOrder.installmentPlan.status}`}>
                        {selectedOrder.installmentPlan.status.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="progress-summary mb-4">
                    <div className="row text-center">
                      <div className="col">
                        <small className="text-muted d-block">Paid</small>
                        <span className="fw-bold text-success">${(selectedOrder.installmentPlan.amountPaid || 0).toFixed(2)}</span>
                      </div>
                      <div className="col">
                        <small className="text-muted d-block">Remaining</small>
                        <span className="fw-bold text-danger">${((selectedOrder.installmentPlan.totalAmount || 0) - (selectedOrder.installmentPlan.amountPaid || 0)).toFixed(2)}</span>
                      </div>
                      <div className="col">
                        <small className="text-muted d-block">Next Payment</small>
                        <span className="fw-bold">{selectedOrder.installmentPlan.nextPaymentDate ? new Date(selectedOrder.installmentPlan.nextPaymentDate).toLocaleDateString() : '-'}</span>
                      </div>
                    </div>
                    <div className="progress mt-3" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${((selectedOrder.installmentPlan.amountPaid || 0) / (selectedOrder.installmentPlan.totalAmount || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-center mt-1">
                      <small className="text-muted" style={{ fontSize: '11px' }}>
                        {selectedOrder.installmentPlan.installmentsPaid} of {selectedOrder.installmentPlan.totalInstallments} installments paid ({Math.round(((selectedOrder.installmentPlan.amountPaid || 0) / (selectedOrder.installmentPlan.totalAmount || 1)) * 100)}%)
                      </small>
                    </div>
                  </div>

                  <h5>Release Schedule</h5>
                  <div className="schedule-list">
                    {(selectedOrder.installmentPlan.releaseSchedule || []).map((step, i) => (
                      <div key={i} className={`schedule-item ${step.released ? 'released' : 'locked'} p-2 mb-2 rounded`} style={{ border: '1px solid #eee' }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="schedule-info">
                            <div className="d-flex align-items-center mb-1">
                              <span className="badge bg-dark me-2">#{step.itemIndex}</span>
                              <span className="fw-bold">{step.productName || 'Product Unit'}</span>
                            </div>
                            <div className="small text-muted mb-1">
                              {step.stockBaseSizeLabel || 'No Base Size'} | {step.hairColorName || 'No color selected'}
                            </div>
                            <div className="small">
                              {step.released ? (
                                <span className="text-success"><i className="fas fa-check-circle me-1"></i> Released on {new Date(step.releasedDate).toLocaleDateString()}</span>
                              ) : (
                                <span className="text-muted"><i className="far fa-calendar-alt me-1"></i> Est. Delivery: {step.scheduledDeliveryDate ? new Date(step.scheduledDeliveryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'TBD'}</span>
                              )}
                            </div>
                            {step.deliveredByDate && step.released && !step.shipped && (
                              <div className="small text-danger mt-1">
                                <i className="fas fa-clock me-1"></i> Deliver by: {new Date(step.deliveredByDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className="schedule-status text-end">
                            {step.released ? (
                              <Badge bg={
                                step.releaseOrderStatus === 'delivered' ? 'success' :
                                  step.releaseOrderStatus === 'shipped' ? 'primary' :
                                    step.releaseOrderStatus === 'ready_to_ship' ? 'warning' :
                                      step.releaseOrderStatus === 'confirmed' ? 'info' : 'secondary'
                              }>
                                {(step.releaseOrderStatus || 'RELEASED').toUpperCase()}
                              </Badge>
                            ) : (
                              <div className="text-muted small">
                                Locked
                                {step.triggerPaymentNumber && <div className="mt-1">Pay #{step.triggerPaymentNumber} to unlock</div>}
                              </div>
                            )}
                            {step.shipped && <div className="mt-1"><Badge bg="success">SHIPPED</Badge></div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  <option value="returned">Returned</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
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

