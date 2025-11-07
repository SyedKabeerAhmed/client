import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faListUl, 
  faCog, 
  faCheckCircle, 
  faTruck, 
  faStickyNote, 
  faSyncAlt,
  faExclamationTriangle,
  faBox,
  faClock,
  faFlagCheckered,
  faExclamationCircle,
  faTimes,
  faSave,
  faPaperPlane,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import Layout from '../shared/Layout';
import StatsCard from '../shared/StatsCard';
import DataTable from '../shared/DataTable';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import './FactoryDashboard.css';

const FactoryDashboard = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [orderFilters, setOrderFilters] = useState({ status: 'all', search: '' });
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [newNoteInternal, setNewNoteInternal] = useState(false);
  const [newNotePriority, setNewNotePriority] = useState('medium');
  const [etaDate, setEtaDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Inventory page state
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState(null);
  const [inventoryFilters, setInventoryFilters] = useState({
    lowStock: false,
    search: ''
  });
  const [inventoryPagination, setInventoryPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activePage === 'orders') {
      fetchOrders({ page: 1 });
    } else if (activePage === 'inventory') {
      fetchInventory({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/factory/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Factory dashboard fetch error:', error);
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

  const fetchOrders = async ({ page = 1, status, search } = {}) => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', pagination.limit);
      
      // Use provided values or current filter state
      const filterSearch = search !== undefined ? search : orderFilters.search;
      const filterStatus = status !== undefined ? status : orderFilters.status;
      
      if (filterSearch) params.append('search', filterSearch);
      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);

      const response = await api.get(`/factory/orders?${params.toString()}`);
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
        setPagination(response.data.data.pagination || { current: 1, pages: 1, total: 0, limit: 10 });
      } else {
        setOrdersError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Factory orders fetch error:', error);
      setOrdersError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, nextStatus) => {
    if (!window.confirm(`Update order status to "${nextStatus}"?`)) return;
    try {
      await api.put(`/factory/orders/${orderId}/status`, { status: nextStatus });
      fetchOrders({ page: pagination.current });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleOpenNotes = async (order) => {
    setSelectedOrder(order);
    setEtaDate(order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().slice(0,10) : '');
    setNewNote('');
    setNewNoteInternal(false);
    setNewNotePriority('medium');
    setShowNotesModal(true);
    await fetchNotes(order._id);
  };

  const handleCloseNotes = () => {
    setShowNotesModal(false);
    setSelectedOrder(null);
    setNotes([]);
    setNewNote('');
    setNewNoteInternal(false);
    setNewNotePriority('medium');
    setEtaDate('');
    setNotesError(null);
  };

  const fetchNotes = async (orderId) => {
    try {
      setNotesLoading(true);
      setNotesError(null);
      // Include internal notes - factory users should see all notes they create
      const res = await api.get(`/factory/orders/${orderId}/production-notes?includeInternal=true`);
      if (res.data.success) {
        setNotes(res.data.data || []);
      } else {
        setNotesError('Failed to load notes');
      }
    } catch (err) {
      setNotesError(err.response?.data?.message || 'Failed to load notes');
    } finally {
      setNotesLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await api.post(`/factory/orders/${selectedOrder._id}/production-notes`, {
        note: newNote.trim(),
        noteType: 'production',
        priority: newNotePriority,
        isInternal: newNoteInternal
      });
      if (res.data.success) {
        setNewNote('');
        setNewNoteInternal(false);
        setNewNotePriority('medium');
        // Refresh notes list to show the newly added note
        await fetchNotes(selectedOrder._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add note');
    }
  };

  const handleSetETA = async () => {
    if (!etaDate) return;
    try {
      // Preserve current status, only update ETA
      await api.put(`/factory/orders/${selectedOrder._id}/status`, {
        status: selectedOrder.status,
        estimatedCompletion: new Date(etaDate)
      });
      // Refresh orders and selected order
      await fetchOrders({ page: pagination.current });
      setShowNotesModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to set ETA');
    }
  };

  // ============ INVENTORY MANAGEMENT FUNCTIONS ============
  
  // Fetch inventory with filters
  const fetchInventory = async ({ page = 1, lowStock, search } = {}) => {
    try {
      setInventoryLoading(true);
      setInventoryError(null);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', inventoryPagination.limit);
      
      const filterSearch = search !== undefined ? search : inventoryFilters.search;
      const filterLowStock = lowStock !== undefined ? lowStock : inventoryFilters.lowStock;
      
      if (filterSearch) params.append('search', filterSearch);
      if (filterLowStock) params.append('lowStock', 'true');

      const response = await api.get(`/factory/inventory?${params.toString()}`);
      if (response.data.success) {
        setInventory(response.data.data.inventory || []);
        setInventoryPagination(response.data.data.pagination || { current: 1, pages: 1, total: 0, limit: 10 });
      } else {
        setInventoryError('Failed to fetch inventory');
      }
    } catch (error) {
      console.error('Inventory fetch error:', error);
      setInventoryError(error.response?.data?.message || 'Failed to fetch inventory');
    } finally {
      setInventoryLoading(false);
    }
  };

  // Update inventory threshold
  const handleUpdateThreshold = async (inventoryId, currentThreshold) => {
    const newThreshold = prompt('Enter new low stock threshold:', currentThreshold);
    if (newThreshold === null || newThreshold === '') return;
    
    const threshold = parseInt(newThreshold);
    if (isNaN(threshold) || threshold < 0) {
      alert('Please enter a valid positive number');
      return;
    }

    try {
      await api.put(`/factory/inventory/${inventoryId}`, {
        lowStockThreshold: threshold
      });
      await fetchInventory({ page: inventoryPagination.current });
      alert('Threshold updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update threshold');
    }
  };

  const getNextStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'in_queue':
        return ['in_process'];
      case 'in_process':
        return ['ready_to_ship'];
      case 'ready_to_ship':
        return ['shipped'];
      default:
        return [];
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'in_queue': { class: 'in_queue', label: 'In Queue' },
      'in_process': { class: 'in_process', label: 'In Process' },
      'ready_to_ship': { class: 'ready_to_ship', label: 'Ready to Ship' },
      'shipped': { class: 'shipped', label: 'Shipped' }
    };
    
    const statusInfo = statusMap[status] || { class: 'pending', label: status };
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout
        activePage={activePage}
        onPageChange={handlePageChange}
        user={user}
        userRole="factory"
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
        userRole="factory"
        onLogout={handleLogout}
        title="Dashboard"
      >
        <div className="error-message">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
        </div>
      </Layout>
    );
  }

  const renderDashboard = () => {
    if (!dashboardData) return null;

    return (
      <div className="factory-dashboard">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Factory Dashboard</h2>
          <p>Manage production orders and track manufacturing progress</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatsCard
            title="Total Orders"
            value={dashboardData.stats?.totalOrders || 0}
            icon="fas fa-box"
            color="blue"
          />
          <StatsCard
            title="Pending"
            value={dashboardData.stats?.pendingOrders || 0}
            icon="fas fa-clock"
            color="yellow"
          />
          <StatsCard
            title="In Process"
            value={dashboardData.stats?.inProcessOrders || 0}
            icon="fas fa-cog"
            color="blue"
          />
          <StatsCard
            title="Ready to Ship"
            value={dashboardData.stats?.readyToShipOrders || 0}
            icon="fas fa-check-circle"
            color="green"
          />
          <StatsCard
            title="Completed Today"
            value={dashboardData.stats?.completedToday || 0}
            icon="fas fa-flag-checkered"
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
              { key: 'products', title: 'Products' },
              { key: 'quantity', title: 'Quantity' },
              { key: 'status', title: 'Status' },
              { key: 'date', title: 'Order Date' }
            ]}
            data={(dashboardData.productionQueue || []).map(order => ({
              id: order._id,
              orderNumber: order.orderNumber,
              products: `${(order.items || []).length} item(s)`,
              quantity: (order.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
              status: getStatusBadge(order.status),
              date: new Date(order.createdAt).toLocaleDateString()
            }))}
            emptyMessage="No orders found"
          />
        </div>
      </div>
    );
  };

  const renderOrders = () => {
    const columns = [
      { key: 'orderNumber', title: 'Order #' },
      { key: 'products', title: 'Products' },
      { key: 'quantity', title: 'Qty' },
      { key: 'status', title: 'Status' },
      { key: 'date', title: 'Date' }
    ];

    const tableData = (orders || []).map((order) => ({
      id: order._id,
      orderNumber: order.orderNumber,
      products: `${(order.items || []).length} item(s)`,
      quantity: (order.items || []).reduce((sum, it) => sum + (it.quantity || 0), 0),
      status: getStatusBadge(order.status),
      date: new Date(order.createdAt).toLocaleDateString()
    }));

    return (
      <div className="factory-orders">
        <div className="section-header">
          <h3>Orders</h3>
          <div className="filters">
            <input
              type="text"
              placeholder="Search by order or customer..."
              value={orderFilters.search}
              onChange={(e) => setOrderFilters({ ...orderFilters, search: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrders({ page: 1 })}
              className="filter-input"
            />
            <select
              value={orderFilters.status}
              onChange={(e) => {
                const newStatus = e.target.value;
                setOrderFilters({ ...orderFilters, status: newStatus });
                // Pass the new status directly to avoid state timing issues
                fetchOrders({ page: 1, status: newStatus, search: orderFilters.search });
              }}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="in_queue">In Queue</option>
              <option value="in_process">In Process</option>
              <option value="ready_to_ship">Ready to Ship</option>
              <option value="shipped">Shipped</option>
            </select>
            <button className="btn-primary" onClick={() => fetchOrders({ page: 1 })}>
              <FontAwesomeIcon icon={faSyncAlt} /> Refresh
            </button>
          </div>
        </div>

        {ordersError && (
          <div className="error-banner">
            <FontAwesomeIcon icon={faExclamationCircle} />
            {ordersError}
          </div>
        )}

        <DataTable
          columns={columns}
          data={tableData}
          loading={ordersLoading}
          actions={(row) => {
            const original = (orders || []).find(o => o._id === row.id);
            const nextStatuses = getNextStatuses(original?.status);
            return (
              <div className="actions-cell">
                {nextStatuses.map((st) => {
                  // Get appropriate icon and tooltip text based on status
                  let icon, tooltip;
                  if (st === 'in_queue') {
                    icon = faListUl;
                    tooltip = 'Move to Queue';
                  } else if (st === 'in_process') {
                    icon = faCog;
                    tooltip = 'Start Processing';
                  } else if (st === 'ready_to_ship') {
                    icon = faCheckCircle;
                    tooltip = 'Mark Ready to Ship';
                  } else if (st === 'shipped') {
                    icon = faTruck;
                    tooltip = 'Mark as Shipped';
                  } else {
                    icon = faCheckCircle; // fallback
                    tooltip = `Update to ${st.replaceAll('_', ' ')}`;
                  }
                  
                  return (
                    <div key={st} className="tooltip-wrapper">
                      <button
                        className="action-btn action-btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(row.id, st);
                        }}
                      >
                        <FontAwesomeIcon icon={icon} />
                      </button>
                      <span className="tooltip-text">{tooltip}</span>
                    </div>
                  );
                })}
                <div className="tooltip-wrapper">
                  <button
                    className="action-btn action-btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNotes(original);
                    }}
                  >
                    <FontAwesomeIcon icon={faStickyNote} />
                  </button>
                  <span className="tooltip-text">View Notes & ETA</span>
                </div>
              </div>
            );
          }}
        />

        {pagination.pages > 1 && (
          <div className="pagination-controls">
            <button
              className="btn-secondary"
              disabled={pagination.current <= 1}
              onClick={() => fetchOrders({ page: pagination.current - 1 })}
            >
              Prev
            </button>
            <span className="page-info">Page {pagination.current} of {pagination.pages}</span>
            <button
              className="btn-secondary"
              disabled={pagination.current >= pagination.pages}
              onClick={() => fetchOrders({ page: pagination.current + 1 })}
            >
              Next
            </button>
          </div>
        )}
        {showNotesModal && selectedOrder && (
          <div className="modal-overlay" onClick={handleCloseNotes}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>Order {selectedOrder.orderNumber} — Notes & ETA</h4>
                <button className="btn-icon" onClick={handleCloseNotes}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="modal-body">
                <div className="eta-section">
                  <label>Estimated Completion (ETA)</label>
                  <div className="eta-row">
                    <input type="date" value={etaDate} onChange={(e) => setEtaDate(e.target.value)} />
                    <button className="btn-primary" onClick={handleSetETA}>
                      <FontAwesomeIcon icon={faSave} /> Save ETA
                    </button>
                  </div>
                </div>
                <div className="notes-section">
                  <h5>Production Notes</h5>
                  {notesLoading ? (
                    <p>Loading notes...</p>
                  ) : notesError ? (
                    <div className="error-banner"><FontAwesomeIcon icon={faExclamationCircle} />{notesError}</div>
                  ) : (
                    <ul className="notes-list">
                      {(notes || []).map((n) => (
                        <li key={n._id} className="note-item">
                          <div className="note-meta">
                            <span className={`badge ${n.isInternal ? 'badge-gray' : 'badge-blue'}`}>{n.isInternal ? 'Internal' : 'Public'}</span>
                            <span className="note-priority">Priority: {n.priority}</span>
                            <span className="note-date">{new Date(n.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="note-text">{n.note}</div>
                        </li>
                      ))}
                      {(!notes || notes.length === 0) && <li>No notes yet.</li>}
                    </ul>
                  )}
                  <div className="note-compose">
                    <textarea
                      placeholder="Add a production note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <div className="note-controls">
                      <label>
                        <input type="checkbox" checked={newNoteInternal} onChange={(e) => setNewNoteInternal(e.target.checked)} /> Internal
                      </label>
                      <select value={newNotePriority} onChange={(e) => setNewNotePriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <button className="btn-primary" onClick={handleAddNote}>
                        <FontAwesomeIcon icon={faPaperPlane} /> Add Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInventory = () => {
    const columns = [
      { key: 'product', title: 'Product' },
      { key: 'sku', title: 'SKU' },
      { key: 'totalQuantity', title: 'Total Quantity' },
      { key: 'reserved', title: 'Reserved' },
      { key: 'available', title: 'Available' },
      { key: 'threshold', title: 'Low Stock Threshold' },
      { key: 'status', title: 'Status' }
    ];

    const tableData = (inventory || []).map((item) => {
      const available = item.quantity - (item.reserved || 0);
      const isLowStock = available <= (item.lowStockThreshold || 0);
      
      return {
        id: item._id,
        product: item.product?.productName || 'N/A',
        sku: item.sku,
        totalQuantity: item.quantity || 0,
        reserved: item.reserved || 0,
        available: (
          <span style={{ 
            color: isLowStock ? '#ef4444' : '#16a34a',
            fontWeight: isLowStock ? 'bold' : 'normal'
          }}>
            {available}
          </span>
        ),
        threshold: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{item.lowStockThreshold || 0}</span>
            <button
              className="btn-icon"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateThreshold(item._id, item.lowStockThreshold || 0);
              }}
              style={{ padding: '4px', fontSize: '12px' }}
              title="Edit threshold"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
        ),
        status: isLowStock ? (
          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Low Stock</span>
        ) : (
          <span style={{ color: '#16a34a' }}>In Stock</span>
        )
      };
    });

    return (
      <div className="factory-inventory">
        <div className="section-header">
          <h3>Inventory Management</h3>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by SKU or product..."
            value={inventoryFilters.search}
            onChange={(e) => setInventoryFilters({ ...inventoryFilters, search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && fetchInventory({ page: 1 })}
            className="filter-input"
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={inventoryFilters.lowStock}
              onChange={(e) => {
                const newFilter = !inventoryFilters.lowStock;
                setInventoryFilters({ ...inventoryFilters, lowStock: newFilter });
                fetchInventory({ lowStock: newFilter, page: 1 });
              }}
            />
            Low Stock Only
          </label>
        </div>

        {inventoryError && (
          <div className="error-banner">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{inventoryError}</span>
          </div>
        )}

        <DataTable
          columns={columns}
          data={tableData}
          loading={inventoryLoading}
          emptyMessage="No inventory items found"
        />

        {inventoryPagination.pages > 1 && (
          <div className="pagination-controls">
            <button
              className="btn-secondary"
              disabled={inventoryPagination.current <= 1}
              onClick={() => fetchInventory({ page: inventoryPagination.current - 1 })}
            >
              Prev
            </button>
            <span className="page-info">Page {inventoryPagination.current} of {inventoryPagination.pages}</span>
            <button
              className="btn-secondary"
              disabled={inventoryPagination.current >= inventoryPagination.pages}
              onClick={() => fetchInventory({ page: inventoryPagination.current + 1 })}
            >
              Next
            </button>
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
      userRole="factory"
      onLogout={handleLogout}
      title={activePage.charAt(0).toUpperCase() + activePage.slice(1)}
    >
      {renderPage()}
    </Layout>
  );
};

export default FactoryDashboard;
