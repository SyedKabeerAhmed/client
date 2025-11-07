import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faTrash, 
  faSearch, 
  faFilter,
  faTimes,
  faSave,
  faEdit,
  faExclamationCircle,
  faSyncAlt,
  faPlus,
  faShoppingCart,
  faTicketAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import Layout from '../shared/Layout';
import StatsCard from '../shared/StatsCard';
import DataTable from '../shared/DataTable';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Orders page state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [orderFilters, setOrderFilters] = useState({
    status: 'all',
    paymentMethod: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [ordersPagination, setOrdersPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // Wishlist page state
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);
  const [wishlistSearch, setWishlistSearch] = useState('');
  const [wishlistPagination, setWishlistPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });

  // Profile page state
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Discounts/Coupons page state
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponsError, setCouponsError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activePage === 'orders') {
      fetchOrders({ page: 1 });
    } else if (activePage === 'wishlist') {
      fetchWishlist({ page: 1 });
    } else if (activePage === 'profile') {
      fetchProfile();
    } else if (activePage === 'discounts') {
      fetchCoupons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // ============ ORDERS PAGE FUNCTIONS ============
  const fetchOrders = async ({ page = 1, status, paymentMethod, search, dateFrom, dateTo } = {}) => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', ordersPagination.limit || 10);
      
      const filterStatus = status !== undefined ? status : orderFilters.status;
      const filterPaymentMethod = paymentMethod !== undefined ? paymentMethod : orderFilters.paymentMethod;
      const filterSearch = search !== undefined ? search : orderFilters.search;
      const filterDateFrom = dateFrom !== undefined ? dateFrom : orderFilters.dateFrom;
      const filterDateTo = dateTo !== undefined ? dateTo : orderFilters.dateTo;
      
      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPaymentMethod && filterPaymentMethod !== 'all') params.append('paymentMethod', filterPaymentMethod);
      if (filterSearch) params.append('search', filterSearch);
      if (filterDateFrom) params.append('dateFrom', filterDateFrom);
      if (filterDateTo) params.append('dateTo', filterDateTo);

      const response = await api.get(`/user/orders?${params.toString()}`);
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
        setOrdersPagination(response.data.data.pagination || { current: 1, pages: 1, total: 0, limit: 10 });
      } else {
        setOrdersError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Orders fetch error:', error);
      setOrdersError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleViewOrderDetail = async (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const response = await api.post(`/user/orders/${orderId}/cancel`);
      if (response.data.success) {
        alert('Order cancelled successfully');
        fetchOrders({ page: ordersPagination.current });
        setShowOrderDetail(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel order');
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

  // ============ WISHLIST PAGE FUNCTIONS ============
  const fetchWishlist = async ({ page = 1, search } = {}) => {
    try {
      setWishlistLoading(true);
      setWishlistError(null);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', wishlistPagination.limit || 10);
      
      const filterSearch = search !== undefined ? search : wishlistSearch;
      if (filterSearch) params.append('search', filterSearch);

      const response = await api.get(`/user/wishlist?${params.toString()}`);
      if (response.data.success) {
        setWishlist(response.data.data.wishlist || []);
        setWishlistPagination(response.data.data.pagination || { current: 1, pages: 1, total: 0, limit: 10 });
      } else {
        setWishlistError('Failed to fetch wishlist');
      }
    } catch (error) {
      console.error('Wishlist fetch error:', error);
      setWishlistError(error.response?.data?.message || 'Failed to fetch wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      const response = await api.delete(`/user/wishlist/${wishlistId}`);
      if (response.data.success) {
        fetchWishlist({ page: wishlistPagination.current });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  const handleAddToCartFromWishlist = (product) => {
    navigate(`/products/${product._id || product.product?._id}`);
  };

  // ============ PROFILE PAGE FUNCTIONS ============
  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await api.get('/user/profile');
      if (response.data.success) {
        const profile = response.data.data.user || response.data.data;
        setProfileData({
          fullName: profile.fullName || user?.fullName || '',
          email: profile.email || user?.email || '',
          phoneNumber: profile.phoneNumber || user?.phoneNumber || ''
        });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setProfileError('Failed to fetch profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await api.put('/user/profile', profileData);
      if (response.data.success) {
        updateUser(response.data.data.user);
        setIsEditingProfile(false);
        alert('Profile updated successfully');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setChangingPassword(true);
      const response = await api.put('/user/profile/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (response.data.success) {
        alert('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  // ============ COUPONS/DISCOUNTS PAGE FUNCTIONS ============
  const fetchCoupons = async () => {
    try {
      setCouponsLoading(true);
      setCouponsError(null);
      const response = await api.get('/user/coupons');
      if (response.data.success) {
        setCoupons(response.data.data.coupons || response.data.data || []);
      } else {
        setCouponsError('Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Coupons fetch error:', error);
      setCouponsError(error.response?.data?.message || 'Failed to fetch coupons');
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleApplyCoupon = async (couponCode) => {
    try {
      const response = await api.post('/user/coupons/apply', { code: couponCode });
      if (response.data.success) {
        alert(`Coupon "${couponCode}" applied successfully!`);
        navigate('/cart');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply coupon');
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
        userRole="user"
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
        userRole="user"
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
      <div className="user-dashboard">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Hello, {dashboardData.user.name}</h2>
          <p>Check your order process and utilization data here.</p>
        </div>

        {/* Account Settings Card */}
        <div className="account-settings-card">
          <div className="card-header">
            <h3>Account Settings</h3>
            <button className="edit-btn">
              <i className="fas fa-pencil-alt"></i>
            </button>
          </div>
          <div className="card-content">
            <div className="profile-info">
              <img 
                src="/default-avatar.png" 
                alt="Profile" 
                className="profile-image"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0QTkwRTIiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
                }}
              />
              <div className="user-details">
                <p><strong>Name:</strong> {dashboardData.user.name}</p>
                <p><strong>Password:</strong> *************</p>
                <p><strong>Email:</strong> {dashboardData.user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatsCard
            title="Awaiting Payment"
            value={`$${dashboardData.stats.awaitingPayment}`}
            icon="fas fa-dollar-sign"
            color="yellow"
          />
          <StatsCard
            title="Awaiting Shipment"
            value={dashboardData.stats.awaitingShipment}
            icon="fas fa-box"
            color="blue"
          />
          <StatsCard
            title="Shipment Tracking"
            value={dashboardData.stats.shipmentTracking}
            icon="fas fa-shipping-fast"
            color="green"
          />
        </div>

        {/* Payment Summary */}
        <div className="payment-summary">
          <h3>Payment Summary</h3>
          <div className="payment-cards">
            <div className="payment-card paid">
              <h4>Paid Amount</h4>
              <p>${dashboardData.paymentSummary.paid}</p>
            </div>
            <div className="payment-card pending">
              <h4>Pending Amount</h4>
              <p>${dashboardData.paymentSummary.pending}</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          <DataTable
            columns={[
              { key: 'product', title: 'Product', className: 'product-column' },
              { key: 'price', title: 'Price' },
              { key: 'quantity', title: 'Quantity' },
              { key: 'subtotal', title: 'Subtotal' }
            ]}
            data={dashboardData.recentOrders.map(order => ({
              id: order._id,
              product: (
                <div className="product-info">
                  <img 
                    src={order.items[0]?.product?.images?.[0] || '/default-product.png'} 
                    alt="Product" 
                    className="product-image"
                  />
                  <div>
                    <p className="product-name">{order.items[0]?.product?.name || 'Product'}</p>
                    <button className="delete-btn">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ),
              price: `$${order.items[0]?.unitPrice || 0}`,
              quantity: (
                <div className="quantity-control">
                  <button className="qty-btn">-</button>
                  <span>1</span>
                  <button className="qty-btn">+</button>
                </div>
              ),
              subtotal: `$${order.pricing?.total || 0}`
            }))}
            emptyMessage="No recent orders found"
          />
        </div>
      </div>
    );
  };

  const renderOrders = () => {
    const columns = [
      { key: 'orderNumber', title: 'Order #' },
      { key: 'items', title: 'Items' },
      { key: 'total', title: 'Total' },
      { key: 'status', title: 'Status' },
      { key: 'date', title: 'Date' },
      { key: 'actions', title: 'Actions' }
    ];

    const tableData = (orders || []).map((order) => ({
      id: order._id,
      orderNumber: order.orderNumber,
      items: `${(order.items || []).length} item(s)`,
      total: `$${(order.pricing?.total || 0).toFixed(2)}`,
      status: getStatusBadge(order.status),
      date: new Date(order.createdAt).toLocaleDateString(),
      actions: (
        <div className="actions-cell">
          <button 
            className="btn-icon" 
            onClick={() => handleViewOrderDetail(order)}
            title="View Details"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          {['pending', 'confirmed'].includes(order.status) && (
            <button 
              className="btn-icon" 
              onClick={() => handleCancelOrder(order._id)}
              title="Cancel Order"
              style={{ color: '#ef4444' }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
      )
    }));

    return (
      <div className="user-orders">
        <div className="section-header">
          <h3>My Orders</h3>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by order # or product..."
            value={orderFilters.search}
            onChange={(e) => setOrderFilters({ ...orderFilters, search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders({ page: 1 })}
            className="filter-input"
          />
          <select
            value={orderFilters.status}
            onChange={(e) => {
              setOrderFilters({ ...orderFilters, status: e.target.value });
              fetchOrders({ status: e.target.value, page: 1 });
            }}
            className="filter-select"
          >
            <option value="all">All Status</option>
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
          <select
            value={orderFilters.paymentMethod}
            onChange={(e) => {
              setOrderFilters({ ...orderFilters, paymentMethod: e.target.value });
              fetchOrders({ paymentMethod: e.target.value, page: 1 });
            }}
            className="filter-select"
          >
            <option value="all">All Payment Methods</option>
            <option value="card_payment">Card Payment</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
          </select>
          <input
            type="date"
            placeholder="From"
            value={orderFilters.dateFrom}
            onChange={(e) => setOrderFilters({ ...orderFilters, dateFrom: e.target.value })}
            className="filter-input"
            style={{ width: '150px' }}
          />
          <input
            type="date"
            placeholder="To"
            value={orderFilters.dateTo}
            onChange={(e) => setOrderFilters({ ...orderFilters, dateTo: e.target.value })}
            className="filter-input"
            style={{ width: '150px' }}
          />
          <button className="btn-primary" onClick={() => fetchOrders({ page: 1 })}>
            <FontAwesomeIcon icon={faSyncAlt} /> Refresh
          </button>
        </div>

        {ordersError && (
          <div className="error-banner">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{ordersError}</span>
          </div>
        )}

        <DataTable
          columns={columns}
          data={tableData}
          loading={ordersLoading}
          emptyMessage="No orders found"
        />

        {ordersPagination.pages > 1 && (
          <div className="pagination-controls">
            <button
              className="btn-secondary"
              disabled={ordersPagination.current <= 1}
              onClick={() => fetchOrders({ page: ordersPagination.current - 1 })}
            >
              Prev
            </button>
            <span className="page-info">Page {ordersPagination.current} of {ordersPagination.pages}</span>
            <button
              className="btn-secondary"
              disabled={ordersPagination.current >= ordersPagination.pages}
              onClick={() => fetchOrders({ page: ordersPagination.current + 1 })}
            >
              Next
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
                </div>
                
                <div className="detail-section">
                  <h4>Items</h4>
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img 
                        src={item.product?.productImages?.[0] || '/default-product.png'} 
                        alt={item.product?.productName || 'Product'}
                        className="item-image"
                      />
                      <div className="item-details">
                        <p><strong>{item.product?.productName || 'Product'}</strong></p>
                        <p>Quantity: {item.quantity || 0}</p>
                        <p>Price: ${(item.unitPrice || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="detail-section">
                  <h4>Total</h4>
                  <p><strong>Subtotal:</strong> ${(selectedOrder.pricing?.subtotal || 0).toFixed(2)}</p>
                  <p><strong>Shipping:</strong> ${(selectedOrder.pricing?.shipping || 0).toFixed(2)}</p>
                  <p><strong>Tax:</strong> ${(selectedOrder.pricing?.tax || 0).toFixed(2)}</p>
                  {selectedOrder.pricing?.discount > 0 && (
                    <p><strong>Discount:</strong> -${(selectedOrder.pricing?.discount || 0).toFixed(2)}</p>
                  )}
                  <p><strong>Total:</strong> ${(selectedOrder.pricing?.total || 0).toFixed(2)}</p>
                </div>

                {['pending', 'confirmed'].includes(selectedOrder.status) && (
                  <div className="detail-section">
                    <button 
                      className="btn-secondary" 
                      onClick={() => handleCancelOrder(selectedOrder._id)}
                      style={{ backgroundColor: '#ef4444', color: 'white' }}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWishlist = () => {
    const columns = [
      { key: 'product', title: 'Product' },
      { key: 'price', title: 'Price' },
      { key: 'added', title: 'Added Date' },
      { key: 'actions', title: 'Actions' }
    ];

    const tableData = (wishlist || []).map((item) => {
      const product = item.product || item;
      return {
        id: item._id,
        product: (
          <div className="wishlist-product">
            <img 
              src={product.productImages?.[0] || '/default-product.png'} 
              alt={product.productName || 'Product'}
              className="product-thumb"
            />
            <span>{product.productName || 'Product'}</span>
          </div>
        ),
        price: product.pricing ? `$${(product.pricing.priceForIndividual || 0).toFixed(2)}` : 'N/A',
        added: new Date(item.addedAt || item.createdAt).toLocaleDateString(),
        actions: (
          <div className="actions-cell">
            <button 
              className="btn-icon" 
              onClick={() => handleAddToCartFromWishlist(product)}
              title="View Product"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
            </button>
            <button 
              className="btn-icon" 
              onClick={() => handleRemoveFromWishlist(item._id)}
              title="Remove from Wishlist"
              style={{ color: '#ef4444' }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )
      };
    });

    return (
      <div className="user-wishlist">
        <div className="section-header">
          <h3>My Wishlist</h3>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={wishlistSearch}
            onChange={(e) => setWishlistSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchWishlist({ page: 1 })}
            className="filter-input"
          />
          <button className="btn-primary" onClick={() => fetchWishlist({ page: 1 })}>
            <FontAwesomeIcon icon={faSearch} /> Search
          </button>
        </div>

        {wishlistError && (
          <div className="error-banner">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{wishlistError}</span>
          </div>
        )}

        <DataTable
          columns={columns}
          data={tableData}
          loading={wishlistLoading}
          emptyMessage="Your wishlist is empty"
        />

        {wishlistPagination.pages > 1 && (
          <div className="pagination-controls">
            <button
              className="btn-secondary"
              disabled={wishlistPagination.current <= 1}
              onClick={() => fetchWishlist({ page: wishlistPagination.current - 1 })}
            >
              Prev
            </button>
            <span className="page-info">Page {wishlistPagination.current} of {wishlistPagination.pages}</span>
            <button
              className="btn-secondary"
              disabled={wishlistPagination.current >= wishlistPagination.pages}
              onClick={() => fetchWishlist({ page: wishlistPagination.current + 1 })}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="user-profile-page">
        <div className="section-header">
          <h3>My Profile</h3>
          <button 
            className="btn-primary"
            onClick={() => isEditingProfile ? handleUpdateProfile() : setIsEditingProfile(true)}
          >
            <FontAwesomeIcon icon={isEditingProfile ? faSave : faEdit} />
            {isEditingProfile ? ' Save' : ' Edit'}
          </button>
        </div>

        {profileError && (
          <div className="error-banner">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{profileError}</span>
          </div>
        )}

        <div className="profile-form">
          <div className="form-section">
            <h4>Personal Information</h4>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                disabled={!isEditingProfile}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="form-input"
                style={{ backgroundColor: '#f3f4f6' }}
              />
              <small>Email cannot be changed</small>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                disabled={!isEditingProfile}
                className="form-input"
              />
            </div>
            {isEditingProfile && (
              <button className="btn-secondary" onClick={() => setIsEditingProfile(false)}>
                Cancel
              </button>
            )}
          </div>

          <div className="form-section">
            <h4>Change Password</h4>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="form-input"
              />
            </div>
            <button 
              className="btn-primary" 
              onClick={handleChangePassword}
              disabled={changingPassword}
            >
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDiscounts = () => {
    return (
      <div className="user-discounts">
        <div className="section-header">
          <h3>Available Coupons & Discounts</h3>
        </div>

        {couponsError && (
          <div className="error-banner">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{couponsError}</span>
          </div>
        )}

        {couponsLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="empty-state">
            <FontAwesomeIcon icon={faTicketAlt} size="3x" />
            <p>No coupons available at this time</p>
          </div>
        ) : (
          <div className="coupons-grid">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="coupon-card">
                <div className="coupon-header">
                  <h4>{coupon.name || coupon.code}</h4>
                  {coupon.discountType === 'percentage' ? (
                    <span className="discount-badge">{coupon.discountValue}% OFF</span>
                  ) : (
                    <span className="discount-badge">${coupon.discountValue} OFF</span>
                  )}
                </div>
                <div className="coupon-body">
                  <p className="coupon-code">
                    <strong>Code:</strong> <span>{coupon.code}</span>
                  </p>
                  {coupon.description && <p>{coupon.description}</p>}
                  {coupon.minimumPurchase && (
                    <p><small>Min. purchase: ${coupon.minimumPurchase}</small></p>
                  )}
                  {coupon.expiryDate && (
                    <p><small>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</small></p>
                  )}
                </div>
                <div className="coupon-footer">
                  <button 
                    className="btn-primary"
                    onClick={() => handleApplyCoupon(coupon.code)}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} /> Apply Coupon
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return renderDashboard();
      case 'orders':
        return renderOrders();
      case 'wishlist':
        return renderWishlist();
      case 'profile':
        return renderProfile();
      case 'discounts':
        return renderDiscounts();
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout
      activePage={activePage}
      onPageChange={handlePageChange}
      user={user}
      userRole="user"
      onLogout={handleLogout}
      title={activePage.charAt(0).toUpperCase() + activePage.slice(1)}
    >
      {renderPage()}
    </Layout>
  );
};

export default UserDashboard;
