import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import DataTable from '../shared/DataTable';
import StatsCard from '../shared/StatsCard';
import { useToast } from '../../components/Toast';
import './AdminInventory.css';

const AdminInventory = () => {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'colors' | 'bases'
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });
  
  // Color inventory state
  const [colorInventory, setColorInventory] = useState(null);
  const [colorLoading, setColorLoading] = useState(false);
  const [colorUpdates, setColorUpdates] = useState({});
  const [saving, setSaving] = useState(false);
  // Base inventory state
  const [baseInventory, setBaseInventory] = useState([]);
  const [baseLoading, setBaseLoading] = useState(false);
  const [baseUpdates, setBaseUpdates] = useState({});
  const [baseSaving, setBaseSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (activeTab === 'general') {
      fetchInventory();
    } else if (activeTab === 'colors') {
      fetchColorInventory();
    } else if (activeTab === 'bases') {
      fetchBaseInventory();
    }
  }, [pagination.current, activeTab]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/inventory', { page: pagination.current });
      
      if (response.data.success) {
        setInventory(response.data.data.inventory);
        setStats(response.data.data.stats);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (inventoryId, quantity) => {
    try {
      const response = await api.put(`/admin/inventory/${inventoryId}`, { quantity });
      if (response.data.success) {
        showToast('Inventory updated successfully', 'success');
        fetchInventory();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update inventory', 'error');
    }
  };

  // Color inventory functions
  const fetchColorInventory = async () => {
    try {
      setColorLoading(true);
      const response = await api.get('/admin/inventory/colors');
      if (response.data.success) {
        setColorInventory(response.data.data);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch color inventory', 'error');
    } finally {
      setColorLoading(false);
    }
  };

  // Base inventory functions
  const fetchBaseInventory = async () => {
    try {
      setBaseLoading(true);
      const response = await api.get('/admin/inventory/bases');
      if (response.data.success) {
        setBaseInventory(response.data.data.baseInventory || []);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch base inventory', 'error');
    } finally {
      setBaseLoading(false);
    }
  };

  const handleBaseMaxChange = (subCategoryId, value) => {
    const numValue = parseInt(value, 10);
    if (Number.isNaN(numValue) || numValue < 0) return;

    setBaseUpdates(prev => ({
      ...prev,
      [subCategoryId]: numValue
    }));
  };

  const handleSaveBaseInventory = async () => {
    if (!baseInventory || baseInventory.length === 0) return;

    const updates = baseInventory.map(base => {
      const updatedValue = baseUpdates[base._id];
      const effectiveValue = updatedValue !== undefined ? updatedValue : (base.maxBaseQuantity ?? 0);
      return {
        subCategoryId: base._id,
        maxBaseQuantity: effectiveValue
      };
    }).filter(update => {
      const original = baseInventory.find(b => b._id === update.subCategoryId);
      return original && (original.maxBaseQuantity ?? 0) !== update.maxBaseQuantity;
    });

    if (updates.length === 0) {
      showToast('No changes to save', 'info');
      return;
    }

    try {
      setBaseSaving(true);
      const response = await api.put('/admin/inventory/bases', { baseUpdates: updates });
      if (response.data.success) {
        showToast(response.data.message || 'Base inventory updated successfully', 'success');
        setBaseUpdates({});
        fetchBaseInventory();
      }
    } catch (error) {
      const errorData = error.response?.data;
      showToast(errorData?.message || 'Failed to update base inventory', 'error');
    } finally {
      setBaseSaving(false);
    }
  };

  const handleColorQuantityChange = (colorKey, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return;
    
    setColorUpdates(prev => ({
      ...prev,
      [colorKey]: numValue
    }));
  };

  const handleSaveColors = async () => {
    if (!colorInventory) return;

    try {
      setSaving(true);
      const updates = colorInventory.colors.map(color => {
        const key = `${color.hair_color}_${color.category}_${color.subcategory}`;
        const update = colorUpdates[key];
        return {
          hair_color: color.hair_color,
          category: color.category,
          subcategory: color.subcategory,
          qty_total: update !== undefined ? update : color.qty_total
        };
      }).filter(update => {
        // Only include if value has changed
        const originalColor = colorInventory.colors.find(
          c => c.hair_color === update.hair_color &&
               c.category === update.category &&
               c.subcategory === update.subcategory
        );
        return originalColor && originalColor.qty_total !== update.qty_total;
      });

      if (updates.length === 0) {
        showToast('No changes to save', 'info');
        return;
      }

      const response = await api.put('/admin/inventory/colors/all', { colorUpdates: updates });
      if (response.data.success) {
        showToast(`Color inventory updated for ${response.data.data.updatedProducts} products`, 'success');
        setColorUpdates({});
        fetchColorInventory();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update color inventory', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getColorValue = (color) => {
    const key = `${color.hair_color}_${color.category}_${color.subcategory}`;
    if (colorUpdates[key] !== undefined) {
      return colorUpdates[key];
    }
    return color.qty_total || 0;
  };

  const getBaseMaxValue = (base) => {
    if (baseUpdates[base._id] !== undefined) {
      return baseUpdates[base._id];
    }
    return base.maxBaseQuantity ?? 0;
  };

  const columns = [
    { key: 'product', title: 'Product' },
    { key: 'sku', title: 'SKU' },
    { key: 'quantity', title: 'Total Qty' },
    { key: 'reserved', title: 'Reserved' },
    { key: 'available', title: 'Available' },
    { key: 'threshold', title: 'Low Stock' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Actions' }
  ];

  const tableData = inventory.map(item => ({
    id: item._id,
    product: item.product?.productName || 'N/A',
    sku: item.sku,
    quantity: item.quantity,
    reserved: item.reserved,
    available: item.quantity - item.reserved,
    threshold: item.lowStockThreshold,
    status: (
      <span className={`status-badge ${(item.quantity - item.reserved) <= item.lowStockThreshold ? 'low-stock' : 'in-stock'}`}>
        {(item.quantity - item.reserved) <= item.lowStockThreshold ? 'Low Stock' : 'In Stock'}
      </span>
    ),
    actions: (
      <div className="actions-cell">
        <button className="btn-icon btn-primary" title="Update">
          <i className="fas fa-edit"></i>
        </button>
      </div>
    )
  }));

  const renderColorInventory = () => {
    if (colorLoading) {
      return <div className="loading-spinner">Loading color inventory...</div>;
    }

    if (!colorInventory) {
      return <div className="error-banner">No color inventory data available</div>;
    }

    return (
      <div className="color-inventory-section">
        <div className="color-inventory-header">
          <div className="header-info">
            <h3>Color Inventory Management</h3>
            <p>Manage shared color quantities across all {colorInventory.totalProducts} products ({colorInventory.totalColors} colors)</p>
            <p className="info-text">
              <i className="fas fa-info-circle"></i> Colors are shared across all products. When a color is purchased, it decreases for all products.
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={handleSaveColors}
              disabled={saving}
            >
              {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
              {' '}Save Changes
            </button>
          </div>
        </div>

        <div className="color-inventory-table-container">
          <table className="color-inventory-table">
            <thead>
              <tr>
                <th>Color Code</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Available Quantity</th>
              </tr>
            </thead>
            <tbody>
              {colorInventory.colors.map((color, idx) => {
                const colorKey = `${color.hair_color}_${color.category}_${color.subcategory}`;
                const qty = getColorValue(color);
                
                return (
                  <tr key={idx} className={qty === 0 ? 'zero-stock' : ''}>
                    <td className="color-code">{color.hair_color}</td>
                    <td className="color-category">{color.category}</td>
                    <td className="color-subcategory">{color.subcategory}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        className="quantity-input"
                        value={qty}
                        onChange={(e) => handleColorQuantityChange(colorKey, e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBaseInventory = () => {
    if (baseLoading) {
      return <div className="loading-spinner">Loading base inventory...</div>;
    }

    if (!baseInventory || baseInventory.length === 0) {
      return <div className="error-banner">No base inventory data available</div>;
    }

    return (
      <div className="color-inventory-section">
        <div className="color-inventory-header">
          <div className="header-info">
            <h3>Base Inventory Management</h3>
            <p>Manage maximum allowed stock per base type (subcategory) across all products.</p>
            <p className="info-text">
              <i className="fas fa-info-circle"></i>
              {' '}
              When creating or updating products or inventory, total stock per base cannot exceed the configured max.
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={handleSaveBaseInventory}
              disabled={baseSaving}
            >
              {baseSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
              {' '}Save Base Limits
            </button>
          </div>
        </div>

        <div className="color-inventory-table-container">
          <table className="color-inventory-table">
            <thead>
              <tr>
                <th>Base Type</th>
                <th>Main Category</th>
                <th>Max Quantity</th>
                <th>Current Total Stock</th>
                <th>Remaining Capacity</th>
                <th>Products</th>
              </tr>
            </thead>
            <tbody>
              {baseInventory.map((base) => {
                const maxValue = getBaseMaxValue(base);
                const remaining = base.remainingCapacity ?? Math.max(0, maxValue - (base.currentTotalStock || 0));

                return (
                  <tr key={base._id}>
                    <td className="color-category">{base.name}</td>
                    <td className="color-subcategory">{base.parentName || 'N/A'}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        className="quantity-input"
                        value={maxValue}
                        onChange={(e) => handleBaseMaxChange(base._id, e.target.value)}
                      />
                    </td>
                    <td className="total-qty">{base.currentTotalStock || 0}</td>
                    <td className={remaining === 0 ? 'zero-qty' : ''}>
                      {remaining}
                    </td>
                    <td>{base.productCount || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-inventory">
      <div className="admin-page-header">
        <h2>Inventory Management</h2>
        <div className="inventory-tabs">
          <button
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <i className="fas fa-boxes"></i> General Inventory
          </button>
          <button
            className={`tab-button ${activeTab === 'colors' ? 'active' : ''}`}
            onClick={() => setActiveTab('colors')}
          >
            <i className="fas fa-palette"></i> Color Inventory
          </button>
          <button
            className={`tab-button ${activeTab === 'bases' ? 'active' : ''}`}
            onClick={() => setActiveTab('bases')}
          >
            <i className="fas fa-layer-group"></i> Base Inventory
          </button>
        </div>
      </div>

      {activeTab === 'general' ? (
        <>
          {/* Stats */}
          {stats && (
            <div className="stats-grid">
              <StatsCard
                title="Total Products"
                value={stats.totalProducts}
                icon="fas fa-cube"
                color="blue"
              />
              <StatsCard
                title="Total Quantity"
                value={stats.totalQuantity}
                icon="fas fa-boxes"
                color="green"
              />
              <StatsCard
                title="Reserved"
                value={stats.totalReserved}
                icon="fas fa-lock"
                color="yellow"
              />
              <StatsCard
                title="Low Stock Items"
                value={stats.lowStockCount}
                icon="fas fa-exclamation-triangle"
                color="red"
              />
            </div>
          )}

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
            emptyMessage="No inventory items found"
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
        </>
      ) : activeTab === 'colors' ? (
        renderColorInventory()
      ) : (
        renderBaseInventory()
      )}
    </div>
  );
};

export default AdminInventory;

