import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/api';
import DataTable from '../shared/DataTable';
import './AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCreatingSubcategory, setIsCreatingSubcategory] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    sortOrder: 0,
    isActive: true,
    parentCategory: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories', { 
        params: { includeSubcategories: 'true' } 
      });
      
      if (response.data.success) {
        // API returns data.categories (array) and data.subcategories (array)
        setCategories(response.data.data?.categories || []);
        setSubcategories(response.data.data?.subcategories || []);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch categories');
      setCategories([]); // Ensure categories is always an array
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsCreatingSubcategory(false);
    setSelectedParentCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      sortOrder: 0,
      isActive: true,
      parentCategory: ''
    });
    setShowCategoryModal(true);
  };

  const handleCreateSubcategory = (parentCategory) => {
    setEditingCategory(null);
    setIsCreatingSubcategory(true);
    setSelectedParentCategory(parentCategory);
    setCategoryFormData({
      name: '',
      description: '',
      sortOrder: 0,
      isActive: true,
      parentCategory: parentCategory._id
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsCreatingSubcategory(category.isSubCategory || false);
    setSelectedParentCategory(category.parentCategory || null);
    setCategoryFormData({
      name: category.name || '',
      description: category.description || '',
      sortOrder: category.sortOrder || 0,
      isActive: category.isActive !== undefined ? category.isActive : true,
      parentCategory: category.parentCategory?._id || category.parentCategory || ''
    });
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setIsCreatingSubcategory(false);
    setSelectedParentCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      sortOrder: 0,
      isActive: true,
      parentCategory: ''
    });
  };

  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }));
    
    // If parent category changes, update the selected parent
    if (name === 'parentCategory' && value) {
      const parent = categories.find(cat => cat._id === value);
      setSelectedParentCategory(parent || null);
      setIsCreatingSubcategory(!!value);
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSend = {
        ...categoryFormData,
        parentCategory: categoryFormData.parentCategory || null
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, dataToSend);
        alert(`${editingCategory.isSubCategory ? 'Subcategory' : 'Category'} updated successfully`);
      } else {
        await api.post('/categories', dataToSend);
        alert(`${isCreatingSubcategory ? 'Subcategory' : 'Category'} created successfully`);
      }
      
      handleCloseCategoryModal();
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${editingCategory ? 'update' : 'create'} ${isCreatingSubcategory || editingCategory?.isSubCategory ? 'subcategory' : 'category'}`);
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
    { key: 'type', title: 'Type' },
    { key: 'parent', title: 'Parent Category' },
    { key: 'slug', title: 'Slug' },
    { key: 'description', title: 'Description' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Actions' }
  ];

  // Combine categories and subcategories for display
  const allItems = [
    ...(categories || []).map(cat => ({ ...cat, isSubCategory: false })),
    ...(subcategories || []).map(cat => ({ ...cat, isSubCategory: true }))
  ];

  const tableData = allItems.map(category => ({
    id: category._id,
    name: category.isSubCategory ? `  └─ ${category.name}` : category.name,
    type: category.isSubCategory ? 'Subcategory' : 'Category',
    parent: category.parentCategory?.name || category.parentCategory || 'N/A',
    slug: category.slug,
    description: category.description || 'N/A',
    status: (
      <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
        {category.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
    actions: (
      <div className="actions-cell">
        {!category.isSubCategory && (
          <button 
            className="btn-icon btn-success" 
            onClick={() => handleCreateSubcategory(category)}
            title="Add Subcategory"
            style={{ marginRight: '5px' }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
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
          <FontAwesomeIcon icon={faTrash} />
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
              <h3>
                {editingCategory 
                  ? `Edit ${isCreatingSubcategory || editingCategory.isSubCategory ? 'Subcategory' : 'Category'}` 
                  : isCreatingSubcategory 
                    ? 'Create Subcategory' 
                    : 'Create Category'}
              </h3>
              <button className="btn-icon" onClick={handleCloseCategoryModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmitCategory} className="modal-body">
              {!isCreatingSubcategory && !editingCategory?.isSubCategory && (
                <div className="form-group">
                  <label>Parent Category (Optional)</label>
                  <select
                    name="parentCategory"
                    value={categoryFormData.parentCategory}
                    onChange={handleCategoryInputChange}
                    className="form-input"
                  >
                    <option value="">None (Main Category)</option>
                    {categories
                      .filter(cat => !cat.isSubCategory && cat._id !== editingCategory?._id)
                      .map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                  <small>Select a parent category to make this a subcategory. Leave empty for main category.</small>
                </div>
              )}
              
              {(isCreatingSubcategory || editingCategory?.isSubCategory || categoryFormData.parentCategory) && (
                <div className="form-group">
                  <label>Parent Category</label>
                  <input
                    type="text"
                    value={selectedParentCategory?.name || categories.find(c => c._id === categoryFormData.parentCategory)?.name || 'N/A'}
                    disabled
                    className="form-input"
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                  <small>This is a subcategory of the selected parent</small>
                </div>
              )}

              <div className="form-group">
                <label>{isCreatingSubcategory || editingCategory?.isSubCategory ? 'Subcategory' : 'Category'} Name *</label>
                <input
                  type="text"
                  name="name"
                  value={categoryFormData.name}
                  onChange={handleCategoryInputChange}
                  required
                  className="form-input"
                  placeholder={isCreatingSubcategory || editingCategory?.isSubCategory ? "e.g., Lace" : "e.g., Hair Systems"}
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

