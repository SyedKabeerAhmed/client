import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import DataTable from '../shared/DataTable';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import './UserDiscounts.css';

const UserDiscounts = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState('discounts');
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/coupons');
      
      if (response.data.success) {
        setCoupons(response.data.data);
      } else {
        setError('Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Coupons fetch error:', error);
      setError('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async (couponCode) => {
    try {
      const response = await api.post('/user/coupons/apply', {
        couponCode,
        orderId: 'current-order' // This would be the current order ID
      });
      
      if (response.data.success) {
        setAppliedCoupon(response.data.data.coupon);
        setError(null);
      } else {
        setError('Failed to apply coupon');
      }
    } catch (error) {
      console.error('Apply coupon error:', error);
      setError('Failed to apply coupon');
    }
  };

  const getCouponType = (type, value) => {
    return type === 'percentage' ? `${value}% OFF` : `$${value} OFF`;
  };

  const getCouponStatus = (coupon) => {
    const now = new Date();
    if (coupon.validUntil < now) {
      return { class: 'expired', label: 'Expired' };
    }
    if (coupon.validFrom > now) {
      return { class: 'upcoming', label: 'Upcoming' };
    }
    return { class: 'active', label: 'Active' };
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const handleLogout = () => {
    logout();
  };

  const columns = [
    {
      key: 'coupon',
      title: 'Coupon',
      className: 'coupon-column',
      render: (value, coupon) => (
        <div className="coupon-info">
          <div className="coupon-code">{coupon.code}</div>
          <div className="coupon-name">{coupon.name}</div>
          {coupon.description && (
            <div className="coupon-description">{coupon.description}</div>
          )}
        </div>
      )
    },
    {
      key: 'discount',
      title: 'Discount',
      render: (value, coupon) => (
        <div className="discount-info">
          <span className="discount-value">
            {getCouponType(coupon.type, coupon.value)}
          </span>
          {coupon.minOrderAmount && (
            <span className="min-order">
              Min order: ${coupon.minOrderAmount}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'validity',
      title: 'Validity',
      render: (value, coupon) => (
        <div className="validity-info">
          <div className="valid-dates">
            <span>Valid from: {new Date(coupon.validFrom).toLocaleDateString()}</span>
            <span>Valid until: {new Date(coupon.validUntil).toLocaleDateString()}</span>
          </div>
          <span className={`status-badge ${getCouponStatus(coupon).class}`}>
            {getCouponStatus(coupon).label}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, coupon) => {
        const status = getCouponStatus(coupon);
        return (
          <div className="coupon-actions">
            {status.class === 'active' ? (
              <button 
                className="action-btn primary"
                onClick={() => handleApplyCoupon(coupon.code)}
              >
                <i className="fas fa-ticket-alt"></i>
                Apply Coupon
              </button>
            ) : (
              <span className="action-disabled">
                {status.label}
              </span>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <Layout
      activePage={activePage}
      onPageChange={handlePageChange}
      user={user}
      userRole="user"
      onLogout={handleLogout}
      title="Discounts"
    >
      <div className="user-discounts">
        <div className="discounts-header">
          <h2>Available Coupons</h2>
          <p>Apply these coupons to your orders and save money</p>
        </div>

        {appliedCoupon && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <span>Coupon "{appliedCoupon.code}" applied successfully! You saved ${appliedCoupon.discount}</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="coupons-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-ticket-alt"></i>
            </div>
            <div className="stat-content">
              <h3>{coupons.length}</h3>
              <p>Available Coupons</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <h3>{coupons.filter(c => getCouponStatus(c).class === 'active').length}</h3>
              <p>Active Coupons</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="stat-content">
              <h3>Up to {Math.max(...coupons.map(c => c.value))}%</h3>
              <p>Maximum Discount</p>
            </div>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={coupons}
          loading={loading}
          emptyMessage="No coupons available at the moment"
        />
      </div>
    </Layout>
  );
};

export default UserDiscounts;
