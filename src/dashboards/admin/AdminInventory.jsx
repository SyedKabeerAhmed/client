import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { useToast } from '../../components/Toast';
import './AdminInventory.css';

const AdminInventory = () => {
  const [activeTab, setActiveTab] = useState('colors'); // 'colors' | 'bases'
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
  const [sizeUpdates, setSizeUpdates] = useState({}); // Changed from baseUpdates to sizeUpdates
  const [baseSaving, setBaseSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (activeTab === 'colors') {
      fetchColorInventory();
    } else if (activeTab === 'bases') {
      fetchBaseInventory();
    }
  }, [pagination.current, activeTab]);



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

  const handleSizeQuantityChange = (sizeId, value) => {
    const numValue = parseInt(value, 10);
    if (Number.isNaN(numValue) || numValue < 0) return;

    setSizeUpdates(prev => ({
      ...prev,
      [sizeId]: numValue
    }));
  };

  const handleSaveBaseInventory = async () => {
    if (!baseInventory || baseInventory.length === 0) return;

    // Collect all size updates
    const updates = [];
    baseInventory.forEach(baseType => {
      if (baseType.sizes && baseType.sizes.length > 0) {
        baseType.sizes.forEach(size => {
          const updatedValue = sizeUpdates[size.id];
          if (updatedValue !== undefined && updatedValue !== size.totalQuantity) {
            updates.push({
              sizeId: size.id,
              totalQuantity: updatedValue
            });
          }
        });
      }
    });

    if (updates.length === 0) {
      showToast('No changes to save', 'info');
      return;
    }

    try {
      setBaseSaving(true);
      const response = await api.put('/admin/inventory/bases', { sizeUpdates: updates });
      if (response.data.success) {
        showToast(response.data.message || 'Base inventory updated successfully', 'success');
        setSizeUpdates({});
        fetchBaseInventory();
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Show validation errors
        errorData.errors.forEach(err => {
          showToast(err, 'error');
        });
      } else {
        showToast(errorData?.message || 'Failed to update base inventory', 'error');
      }
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

  const getSizeQuantity = (size) => {
    if (sizeUpdates[size.id] !== undefined) {
      return sizeUpdates[size.id];
    }
    return size.totalQuantity ?? 0;
  };



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

    // Detect old API format (no per-size data: items have "name" but no "sizes" array)
    const isOldFormat = baseInventory.some(b => !Array.isArray(b.sizes));
    if (isOldFormat) {
      return (
        <div className="color-inventory-section">
          <div className="header-info">
            <h3>Base Size Inventory Management</h3>
            <div className="error-banner" style={{ marginTop: '1rem' }}>
              <strong>Backend needs a restart.</strong> The Base Size Inventory API has been updated.
              Restart your backend server (e.g. <code>npm run dev</code> in the <code>server</code> folder), then refresh this page.
              After restart, if you have run the base sizes seeder, the size rows will appear.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="color-inventory-section">
        <div className="color-inventory-header">
          <div className="header-info">
            <h3>Base Size Inventory Management</h3>
            <p>Manage inventory quantities per base type and size. Each base type has multiple sizes (height x width).</p>
            <p className="info-text">
              <i className="fas fa-info-circle"></i>
              {' '}
              You cannot set totalQuantity below reservedQuantity. Reservations expire after 3 days.
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={handleSaveBaseInventory}
              disabled={baseSaving}
            >
              {baseSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
              {' '}Save Changes
            </button>
          </div>
        </div>

        <div className="color-inventory-table-container">
          {baseInventory.map((baseType) => (
            <div key={baseType.baseType} className="base-type-section" style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', padding: '0.5rem', background: '#f5f5f5', borderRadius: '4px' }}>
                {baseType.baseType} Base Type
                <span style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  Total: {baseType.totalQuantity} | Reserved: {baseType.reservedQuantity} | Available: {baseType.availableQuantity}
                </span>
              </h4>
              <table className="color-inventory-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Total Quantity</th>
                    <th>Reserved</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {baseType.sizes && baseType.sizes.length > 0 ? (
                    <>
                      {baseType.sizes.map((size) => {
                        const currentQty = getSizeQuantity(size);
                        const isOutOfStock = size.availableQuantity === 0;
                        const isLowStock = size.availableQuantity > 0 && size.availableQuantity <= 5;

                        return (
                          <tr
                            key={size.id}
                            className={isOutOfStock ? 'zero-stock' : isLowStock ? 'low-stock-row' : ''}
                          >
                            <td className="color-code" style={{ fontWeight: 'bold' }}>{size.label}</td>
                            <td>
                              <input
                                type="number"
                                min={size.reservedQuantity}
                                className="quantity-input"
                                value={currentQty}
                                onChange={(e) => handleSizeQuantityChange(size.id, e.target.value)}
                                title={`Cannot be less than reserved quantity (${size.reservedQuantity})`}
                              />
                            </td>
                            <td className="total-qty">{size.reservedQuantity}</td>
                            <td className={isOutOfStock ? 'zero-qty' : ''}>
                              {size.availableQuantity}
                              {isOutOfStock && <span style={{ marginLeft: '0.5rem', color: '#dc3545' }}>(Out of Stock)</span>}
                            </td>
                            <td>
                              {currentQty !== size.totalQuantity && (
                                <span style={{ color: '#ffc107', fontSize: '0.85rem' }}>
                                  <i className="fas fa-edit"></i> Modified
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Summary row */}
                      <tr style={{ background: '#f8f9fa', fontWeight: 'bold' }}>
                        <td>Total</td>
                        <td>{baseType.totalQuantity}</td>
                        <td>{baseType.reservedQuantity}</td>
                        <td>{baseType.availableQuantity}</td>
                        <td></td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#999' }}>
                        No sizes configured for this base type
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
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

      {activeTab === 'colors' ? (
        renderColorInventory()
      ) : (
        renderBaseInventory()
      )}
    </div>
  );
};

export default AdminInventory;

