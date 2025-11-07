import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/api';
import DataTable from '../shared/DataTable';
import './AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      
      if (response.data.success) {
        // API returns data.categories (array)
        setCategories(response.data.data?.categories || []);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch categories');
      setCategories([]); // Ensure categories is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      sortOrder: 0,
      isActive: true
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name || '',
      description: category.description || '',
      sortOrder: category.sortOrder || 0,
      isActive: category.isActive !== undefined ? category.isActive : true
    });
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      sortOrder: 0,
      isActive: true
    });
  };

  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }));
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, categoryFormData);
        alert('Category updated successfully');
      } else {
        await api.post('/categories', categoryFormData);
        alert('Category created successfully');
      }
      
      handleCloseCategoryModal();
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await api.delete(`/categories/${categoryId}`);
      alert('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'slug', title: 'Slug' },
    { key: 'description', title: 'Description' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Actions' }
  ];

  const tableData = (categories || []).map(category => ({
    id: category._id,
    name: category.name,
    slug: category.slug,
    description: category.description || 'N/A',
    status: (
      <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
        {category.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
    actions: (
      <div className="actions-cell">
        <button 
          className="btn-icon btn-primary" 
          onClick={() => handleEditCategory(category)}
          title="Edit"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button 
          className="btn-icon btn-danger" 
          onClick={() => handleDelete(category._id)}
          title="Delete"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    )
  }));

  return (
    <div className="admin-categories">
      <div className="admin-page-header">
        <h2>Category Management</h2>
        <button className="btn-primary" onClick={handleCreateCategory}>
          <FontAwesomeIcon icon={faPlus} /> Add Category
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
        emptyMessage="No categories found"
      />

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={handleCloseCategoryModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
              <button className="btn-icon" onClick={handleCloseCategoryModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmitCategory} className="modal-body">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={categoryFormData.name}
                  onChange={handleCategoryInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., Hair Systems"
                />
                <small>Slug will be auto-generated from the name</small>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={categoryFormData.description}
                  onChange={handleCategoryInputChange}
                  className="form-input"
                  rows="4"
                  placeholder="Optional description for the category"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={categoryFormData.sortOrder}
                    onChange={handleCategoryInputChange}
                    min="0"
                    className="form-input"
                    placeholder="0"
                  />
                  <small>Lower numbers appear first</small>
                </div>
                <div className="form-group">
                  <label>Active Status</label>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={categoryFormData.isActive}
                      onChange={handleCategoryInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseCategoryModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FontAwesomeIcon icon={faSave} /> {editingCategory ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

