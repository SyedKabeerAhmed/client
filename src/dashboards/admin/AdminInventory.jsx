import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import DataTable from '../shared/DataTable';
import StatsCard from '../shared/StatsCard';
import './AdminInventory.css';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });

  useEffect(() => {
    fetchInventory();
  }, [pagination.current]);

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
        alert('Inventory updated successfully');
        fetchInventory();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update inventory');
    }
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

  return (
    <div className="admin-inventory">
      <div className="admin-page-header">
        <h2>Inventory Management</h2>
      </div>

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
    </div>
  );
};

export default AdminInventory;

