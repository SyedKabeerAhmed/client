import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/api';
import DataTable from '../shared/DataTable';
import './AdminCoupons.css';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/coupons');
      
      if (response.data.success) {
        // API returns data.coupons (array) and data.pagination
        setCoupons(response.data.data?.coupons || []);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch coupons');
      setCoupons([]); // Ensure coupons is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setCouponFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: '',
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      validFrom: '',
      validUntil: '',
      isActive: true
    });
    setShowCouponModal(true);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponFormData({
      code: coupon.code || '',
      name: coupon.name || '',
      description: coupon.description || '',
      type: coupon.type || 'percentage',
      value: coupon.value || '',
      minOrderAmount: coupon.minOrderAmount || '',
      maxDiscount: coupon.maxDiscount || '',
      usageLimit: coupon.usageLimit || '',
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
      isActive: coupon.isActive !== undefined ? coupon.isActive : true
    });
    setShowCouponModal(true);
  };

  const handleCloseCouponModal = () => {
    setShowCouponModal(false);
    setEditingCoupon(null);
    setCouponFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: '',
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      validFrom: '',
      validUntil: '',
      isActive: true
    });
  };

  const handleCouponInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCouponFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitCoupon = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...couponFormData,
        value: parseFloat(couponFormData.value),
        minOrderAmount: couponFormData.minOrderAmount ? parseFloat(couponFormData.minOrderAmount) : 0,
        maxDiscount: couponFormData.maxDiscount ? parseFloat(couponFormData.maxDiscount) : undefined,
        usageLimit: couponFormData.usageLimit ? parseInt(couponFormData.usageLimit) : null,
        validFrom: new Date(couponFormData.validFrom),
        validUntil: new Date(couponFormData.validUntil)
      };

      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon._id}`, submitData);
        alert('Coupon updated successfully');
      } else {
        await api.post('/admin/coupons', submitData);
        alert('Coupon created successfully');
      }
      
      handleCloseCouponModal();
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${editingCoupon ? 'update' : 'create'} coupon`);
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await api.delete(`/admin/coupons/${couponId}`);
      alert('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const columns = [
    { key: 'code', title: 'Code' },
    { key: 'name', title: 'Name' },
    { key: 'type', title: 'Type' },
    { key: 'value', title: 'Value' },
    { key: 'usage', title: 'Usage' },
    { key: 'valid', title: 'Valid Until' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Actions' }
  ];

  const tableData = (coupons || []).map(coupon => ({
    id: coupon._id,
    code: <strong>{coupon.code}</strong>,
    name: coupon.name,
    type: coupon.type === 'percentage' ? 'Percentage' : 'Fixed',
    value: coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`,
    usage: `${coupon.usedCount || 0} / ${coupon.usageLimit || '∞'}`,
    valid: new Date(coupon.validUntil).toLocaleDateString(),
    status: (
      <span className={`status-badge ${coupon.isActive ? 'active' : 'inactive'}`}>
        {coupon.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
    actions: (
      <div className="actions-cell">
        <button 
          className="btn-icon btn-primary" 
          onClick={() => handleEditCoupon(coupon)}
          title="Edit"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button 
          className="btn-icon btn-danger" 
          onClick={() => handleDelete(coupon._id)}
          title="Delete"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )
  }));

  return (
    <div className="admin-coupons">
      <div className="admin-page-header">
        <h2>Coupon Management</h2>
        <button className="btn-primary" onClick={handleCreateCoupon}>
          <FontAwesomeIcon icon={faPlus} /> Create Coupon
        </button>
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
        emptyMessage="No coupons found"
      />

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="modal-overlay" onClick={handleCloseCouponModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <button className="btn-icon" onClick={handleCloseCouponModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmitCoupon} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={couponFormData.code}
                    onChange={handleCouponInputChange}
                    required
                    className="form-input"
                    placeholder="e.g., SAVE20"
                    disabled={!!editingCoupon}
                  />
                  {editingCoupon && <small>Code cannot be changed</small>}
                </div>
                <div className="form-group">
                  <label>Coupon Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={couponFormData.name}
                    onChange={handleCouponInputChange}
                    required
                    className="form-input"
                    placeholder="e.g., Summer Sale 20%"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={couponFormData.description}
                  onChange={handleCouponInputChange}
                  className="form-input"
                  rows="3"
                  placeholder="Optional description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type *</label>
                  <select
                    name="type"
                    value={couponFormData.type}
                    onChange={handleCouponInputChange}
                    required
                    className="form-input"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    name="value"
                    value={couponFormData.value}
                    onChange={handleCouponInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="form-input"
                    placeholder={couponFormData.type === 'percentage' ? 'e.g., 20' : 'e.g., 50'}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Minimum Order Amount</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={couponFormData.minOrderAmount}
                    onChange={handleCouponInputChange}
                    min="0"
                    step="0.01"
                    className="form-input"
                    placeholder="0 (no minimum)"
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Discount</label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={couponFormData.maxDiscount}
                    onChange={handleCouponInputChange}
                    min="0"
                    step="0.01"
                    className="form-input"
                    placeholder="No limit"
                  />
                  <small>Only for percentage coupons</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={couponFormData.usageLimit}
                    onChange={handleCouponInputChange}
                    min="1"
                    className="form-input"
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div className="form-group">
                  <label>Active Status</label>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={couponFormData.isActive}
                      onChange={handleCouponInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valid From *</label>
                  <input
                    type="date"
                    name="validFrom"
                    value={couponFormData.validFrom}
                    onChange={handleCouponInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Valid Until *</label>
                  <input
                    type="date"
                    name="validUntil"
                    value={couponFormData.validUntil}
                    onChange={handleCouponInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseCouponModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FontAwesomeIcon icon={faSave} /> {editingCoupon ? 'Update' : 'Create'} Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;

