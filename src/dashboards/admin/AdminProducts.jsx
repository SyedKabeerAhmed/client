import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faSave, faUpload } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/api';
import DataTable from '../shared/DataTable';
import { allColors, allHaircuts } from '../../utils/productConstants';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');

  // Product form state
  const [productFormData, setProductFormData] = useState({
    productName: '',
    productShortTitle: '',
    productDescription: '',
    mainCategory: 'Hair Systems',
    subCategory: '',
    productCode: '',
    stock: 0,
    isActive: true,
    bestSelling: false,
    premiumProduct: false,
    pricing: {
      priceForIndividual: 0,
      discountedPriceForIndividual: 0,
      priceForBusiness: 0,
      discountedPriceForBusiness: 0
    },
    productDetails: {
      baseDesign: '',
      baseSize: '',
      frontContour: '',
      bleachKnots: '',
      knotTypes: '',
      hairType: '',
      hairLength: '',
      hairWaveCurl: '',
      hairDensity: '',
      hairColour: '',
      hairDirection: ''
    },
    productBenefits: {
      durability: 5,
      comfort: 5,
      appearance: 5,
      maintenance: 4
    },
    cutToSize: {
      cutByStylist: false,
      cutToMySize: true
    },
    haircut: {
      price: '',
      sendEmailToHairStore: true,
      uploadImageHairStyle: true,
      orderHairLength: {
        height: '',
        width: ''
      }
    },
    additionalInformation: '',
    seoTitle: '',
    seoDescription: '',
    tags: ''
  });

  const [productImages, setProductImages] = useState([]);
  const [productImagesPreview, setProductImagesPreview] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedHaircuts, setSelectedHaircuts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [pagination.current, searchQuery, isActiveFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.limit,
        ...(searchQuery && { search: searchQuery }),
        ...(isActiveFilter !== '' && { isActive: isActiveFilter })
      };

      const response = await api.get('/admin/products', params);
      
      if (response.data.success) {
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      setError(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      productName: '',
      productShortTitle: '',
      productDescription: '',
      mainCategory: 'Hair Systems',
      subCategory: 'Skin',
      productCode: '',
      stock: 0,
      isActive: true,
      bestSelling: false,
      premiumProduct: false,
      pricing: {
        priceForIndividual: '',
        discountedPriceForIndividual: '',
        priceForBusiness: '',
        discountedPriceForBusiness: ''
      },
      productDetails: {
        baseDesign: '',
        baseSize: '',
        frontContour: '',
        bleachKnots: '',
        knotTypes: '',
        hairType: '',
        hairLength: '',
        hairWaveCurl: '',
        hairDensity: '',
        hairColour: '',
        hairDirection: ''
      },
      productBenefits: {
        durability: 5,
        comfort: 5,
        appearance: 5,
        maintenance: 4
      },
      cutToSize: {
        cutByStylist: false,
        cutToMySize: true
      },
      haircut: {
        price: 0,
        sendEmailToHairStore: true,
        uploadImageHairStyle: true,
        orderHairLength: {
          height: 8,
          width: 6
        }
      },
      additionalInformation: '',
      seoTitle: '',
      seoDescription: '',
      tags: ''
    });
    setProductImages([]);
    setProductImagesPreview([]);
    setSelectedColors([...allColors]);
    setSelectedHaircuts([...allHaircuts]);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductFormData({
      productName: product.productName || '',
      productShortTitle: product.productShortTitle || '',
      productDescription: product.productDescription || '',
      mainCategory: product.mainCategory || 'Hair Systems',
      subCategory: product.subCategory || '',
      productCode: product.productDetails?.productCode || '',
      stock: product.stock || 0,
      isActive: product.isActive !== undefined ? product.isActive : true,
      bestSelling: product.bestSelling || false,
      premiumProduct: product.premiumProduct || false,
      pricing: {
        priceForIndividual: product.pricing?.priceForIndividual || 0,
        discountedPriceForIndividual: product.pricing?.discountedPriceForIndividual || 0,
        priceForBusiness: product.pricing?.priceForBusiness || 0,
        discountedPriceForBusiness: product.pricing?.discountedPriceForBusiness || 0
      },
      productDetails: {
        baseDesign: product.productDetails?.baseDesign || '',
        baseSize: product.productDetails?.baseSize || '',
        frontContour: product.productDetails?.frontContour || '',
        bleachKnots: product.productDetails?.bleachKnots || '',
        knotTypes: product.productDetails?.knotTypes || '',
        hairType: product.productDetails?.hairType || '',
        hairLength: product.productDetails?.hairLength || '',
        hairWaveCurl: product.productDetails?.hairWaveCurl || '',
        hairDensity: product.productDetails?.hairDensity || '',
        hairColour: product.productDetails?.hairColour || '',
        hairDirection: product.productDetails?.hairDirection || ''
      },
      productBenefits: {
        durability: product.productBenefits?.durability || 5,
        comfort: product.productBenefits?.comfort || 5,
        appearance: product.productBenefits?.appearance || 5,
        maintenance: product.productBenefits?.maintenance || 4
      },
      cutToSize: {
        cutByStylist: product.cutToSize?.cutByStylist || false,
        cutToMySize: product.cutToSize?.cutToMySize || true
      },
      haircut: {
        price: product.hairCut?.price || 0,
        sendEmailToHairStore: product.hairCut?.sendEmailToHairStore || true,
        uploadImageHairStyle: product.hairCut?.uploadImageHairStyle || true,
        orderHairLength: {
          height: product.hairCut?.orderHairLength?.height || 8,
          width: product.hairCut?.orderHairLength?.width || 6
        }
      },
      additionalInformation: product.additionalInformation || '',
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      tags: (product.tags || []).join(', ')
    });
    setProductImages([]);
    setProductImagesPreview(product.productImages || []);
    setSelectedColors(product.colors || []);
    setSelectedHaircuts(product.hairCut?.chooseYourHairStyle || []);
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductImages([]);
    setProductImagesPreview([]);
    setSelectedColors([]);
    setSelectedHaircuts([]);
  };

  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        const [parent, child] = parts;
        setProductFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
          }
        }));
      } else if (parts.length === 3) {
        const [parent, child, grandchild] = parts;
        setProductFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: type === 'number' ? parseFloat(value) || 0 : value
            }
          }
        }));
      }
    } else {
      setProductFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
      }));
    }
  };

  const handleMainCategoryChange = (e) => {
    const mainCategory = e.target.value;
    setProductFormData(prev => ({
      ...prev,
      mainCategory,
      subCategory: mainCategory === 'Accessories' ? '' : 'Skin'
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + productImages.length + productImagesPreview.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setProductImages([...productImages, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagesPreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    if (index < productImagesPreview.length - productImages.length) {
      setProductImagesPreview(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - (productImagesPreview.length - productImages.length);
      setProductImages(prev => prev.filter((_, i) => i !== newIndex));
      setProductImagesPreview(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = {
        ...productFormData,
        stock: parseInt(productFormData.stock) || 0,
        pricing: {
          priceForIndividual: parseFloat(productFormData.pricing.priceForIndividual) || 0,
          discountedPriceForIndividual: parseFloat(productFormData.pricing.discountedPriceForIndividual) || 0,
          priceForBusiness: parseFloat(productFormData.pricing.priceForBusiness) || 0,
          discountedPriceForBusiness: parseFloat(productFormData.pricing.discountedPriceForBusiness) || 0
        },
        productBenefits: {
          durability: parseInt(productFormData.productBenefits.durability) || 5,
          comfort: parseInt(productFormData.productBenefits.comfort) || 5,
          appearance: parseInt(productFormData.productBenefits.appearance) || 5,
          maintenance: parseInt(productFormData.productBenefits.maintenance) || 4
        },
        haircut: {
          ...productFormData.haircut,
          price: parseFloat(productFormData.haircut.price) || 0,
          orderHairLength: {
            height: parseInt(productFormData.haircut.orderHairLength.height) || 8,
            width: parseInt(productFormData.haircut.orderHairLength.width) || 6
          },
          chooseYourHairStyle: selectedHaircuts
        },
        tags: productFormData.tags ? productFormData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        productDetails: {
          ...productFormData.productDetails,
          productCode: productFormData.productCode
        },
        colors: selectedColors,
        mainCategorySlug: productFormData.mainCategory === 'Hair Systems' ? 'hair-systems' : 'accessories'
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, formDataToSend);
        if (productImages.length > 0) {
          const uploadFormData = new FormData();
          productImages.forEach(file => {
            uploadFormData.append('images', file);
          });
          await api.post(`/admin/products/${editingProduct._id}/images`, uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        alert('Product updated successfully');
      } else {
        const response = await api.post('/admin/products', formDataToSend);
        if (productImages.length > 0) {
          const uploadFormData = new FormData();
          productImages.forEach(file => {
            uploadFormData.append('images', file);
          });
          await api.post(`/admin/products/${response.data.data._id}/images`, uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        alert('Product created successfully');
      }
      
      handleCloseProductModal();
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await api.delete(`/admin/products/${productId}`);
      if (response.data.success) {
        alert('Product deleted successfully');
        fetchProducts();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const columns = [
    { key: 'image', title: 'Image' },
    { key: 'name', title: 'Product Name' },
    { key: 'code', title: 'Code' },
    { key: 'price', title: 'Price' },
    { key: 'stock', title: 'Stock' },
    { key: 'status', title: 'Status' },
    { key: 'actions', title: 'Actions' }
  ];

  const tableData = products.map(product => ({
    id: product._id,
    image: (
      <img 
        src={product.productImages?.[0] || '/placeholder.jpg'} 
        alt={product.productName}
        className="product-thumb"
      />
    ),
    name: product.productName,
    code: product.productDetails?.productCode || 'N/A',
    price: `$${product.productPrice?.regular || 0}`,
    stock: product.stock || 0,
    status: (
      <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
        {product.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
    actions: (
      <div className="actions-cell">
        <button 
          className="btn-icon btn-primary" 
          onClick={() => handleEditProduct(product)}
          title="Edit"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button 
          className="btn-icon btn-danger" 
          onClick={() => handleDelete(product._id)}
          title="Delete"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    )
  }));

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <h2>Product Management</h2>
        <button className="btn-primary" onClick={handleCreateProduct}>
          <FontAwesomeIcon icon={faPlus} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group" style={{ flex: 2 }}>
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by name, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={isActiveFilter}
            onChange={(e) => setIsActiveFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
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
        columns={columns}
        data={tableData}
        loading={loading}
        emptyMessage="No products found"
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

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal-overlay" onClick={handleCloseProductModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Create Product'}</h3>
              <button className="btn-icon" onClick={handleCloseProductModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmitProduct} className="modal-body">
              {/* Basic Information */}
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="productName"
                    value={productFormData.productName}
                    onChange={handleProductInputChange}
                    required
                    className="form-input"
                    placeholder="e.g., Premium Skin Hair System"
                  />
                </div>
                <div className="form-group">
                  <label>Product Short Title</label>
                  <input
                    type="text"
                    name="productShortTitle"
                    value={productFormData.productShortTitle}
                    onChange={handleProductInputChange}
                    className="form-input"
                    placeholder="e.g., Skin System - Ultra Natural"
                  />
                </div>
                <div className="form-group">
                  <label>Product Description *</label>
                  <textarea
                    name="productDescription"
                    value={productFormData.productDescription}
                    onChange={handleProductInputChange}
                    required
                    rows="4"
                    className="form-input"
                    placeholder="Detailed product description..."
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Main Category *</label>
                    <select
                      name="mainCategory"
                      value={productFormData.mainCategory}
                      onChange={handleMainCategoryChange}
                      required
                      className="form-input"
                    >
                      <option value="Hair Systems">Hair Systems</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sub Category *</label>
                    <select
                      name="subCategory"
                      value={productFormData.subCategory}
                      onChange={handleProductInputChange}
                      required
                      className="form-input"
                    >
                      {productFormData.mainCategory === 'Hair Systems' ? (
                        <>
                          <option value="Skin">Skin</option>
                          <option value="French Mono">French Mono</option>
                          <option value="Mono">Mono</option>
                          <option value="Hybrid">Hybrid</option>
                        </>
                      ) : (
                        <>
                          <option value="Adhesives">Adhesives</option>
                          <option value="Tapes">Tapes</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Styling">Styling</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Code *</label>
                    <input
                      type="text"
                      name="productCode"
                      value={productFormData.productCode}
                      onChange={handleProductInputChange}
                      required
                      className="form-input"
                      placeholder="e.g., HS-SKIN-001"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock"
                      value={productFormData.stock}
                      onChange={handleProductInputChange}
                      min="0"
                      required
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={productFormData.tags}
                    onChange={handleProductInputChange}
                    className="form-input"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="form-section">
                <h4>Pricing</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price for Individual *</label>
                    <input
                      type="number"
                      name="pricing.priceForIndividual"
                      value={productFormData.pricing.priceForIndividual || ''}
                      onChange={handleProductInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Discounted Price for Individual</label>
                    <input
                      type="number"
                      name="pricing.discountedPriceForIndividual"
                      value={productFormData.pricing.discountedPriceForIndividual || ''}
                      onChange={handleProductInputChange}
                      min="0"
                      step="0.01"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price for Business *</label>
                    <input
                      type="number"
                      name="pricing.priceForBusiness"
                      value={productFormData.pricing.priceForBusiness || ''}
                      onChange={handleProductInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Discounted Price for Business</label>
                    <input
                      type="number"
                      name="pricing.discountedPriceForBusiness"
                      value={productFormData.pricing.discountedPriceForBusiness || ''}
                      onChange={handleProductInputChange}
                      min="0"
                      step="0.01"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Flags */}
              <div className="form-section">
                <h4>Flags & Status</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="bestSelling"
                        checked={productFormData.bestSelling}
                        onChange={handleProductInputChange}
                      />
                      <span className="toggle-slider"></span>
                      Best Selling
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="premiumProduct"
                        checked={productFormData.premiumProduct}
                        onChange={handleProductInputChange}
                      />
                      <span className="toggle-slider"></span>
                      Premium Product
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={productFormData.isActive}
                        onChange={handleProductInputChange}
                      />
                      <span className="toggle-slider"></span>
                      Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="form-section">
                <h4>Product Images (Max 5)</h4>
                <div className="image-upload-area">
                  <label className="file-label">
                    <FontAwesomeIcon icon={faUpload} /> Choose Images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {productImagesPreview.length > 0 && (
                  <div className="image-preview-grid">
                    {productImagesPreview.map((preview, idx) => (
                      <div key={idx} className="image-preview-item">
                        <img src={preview} alt={`Preview ${idx + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => handleRemoveImage(idx)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="form-section">
                <h4>Product Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Base Design</label>
                    <input
                      type="text"
                      name="productDetails.baseDesign"
                      value={productFormData.productDetails.baseDesign}
                      onChange={handleProductInputChange}
                      className="form-input"
                      placeholder="e.g., Skin Base"
                    />
                  </div>
                  <div className="form-group">
                    <label>Base Size</label>
                    <input
                      type="text"
                      name="productDetails.baseSize"
                      value={productFormData.productDetails.baseSize}
                      onChange={handleProductInputChange}
                      className="form-input"
                      placeholder="e.g., 8x10"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Front Contour</label>
                    <input
                      type="text"
                      name="productDetails.frontContour"
                      value={productFormData.productDetails.frontContour}
                      onChange={handleProductInputChange}
                      className="form-input"
                      placeholder="e.g., Natural Hairline"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bleach Knots</label>
                    <input
                      type="text"
                      name="productDetails.bleachKnots"
                      value={productFormData.productDetails.bleachKnots}
                      onChange={handleProductInputChange}
                      className="form-input"
                      placeholder="e.g., Yes, No"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Knot Types</label>
                    <input
                      type="text"
                      name="productDetails.knotTypes"
                      value={productFormData.productDetails.knotTypes}
                      onChange={handleProductInputChange}
                      className="form-input"
                      placeholder="e.g., Single Knot"
                    />
                  </div>
                  <div className="form-group">
                    <label>Hair Type</label>
                    <input
                      type="text"
                      name="productDetails.hairType"
                      value={productFormData.productDetails.hairType}
                      onChange={handleProductInputChange}
                      className="form-input"
                      placeholder="e.g., Human Hair"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hair Length</label>
                    <input
                      type="text"
                      name="productDetails.hairLength"
                      value={productFormData.productDetails.hairLength}
                      onChange={handleProductInputChange}
                      className="form-input"
                      placeholder="e.g., 6 inches"
                    />
                  </div>
                  <div className="form-group">
                    <label>Hair Wave/Curl</label>
                    <input
                      type="text"
                      name="productDetails.hairWaveCurl"
                      value={productFormData.productDetails.hairWaveCurl}
                      onChange={handleProductInputChange}
                      className="form-input"
                      placeholder="e.g., Straight"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hair Density</label>
                    <input
                      type="text"
                      name="productDetails.hairDensity"
                      value={productFormData.productDetails.hairDensity}
                      onChange={handleProductInputChange}
                      className="form-input"
                      placeholder="e.g., Medium"
                    />
                  </div>
                  <div className="form-group">
                    <label>Hair Colour</label>
                    <input
                      type="text"
                      name="productDetails.hairColour"
                      value={productFormData.productDetails.hairColour}
                      onChange={handleProductInputChange}
                      className="form-input"
                      placeholder="e.g., Natural Black"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Hair Direction</label>
                  <input
                    type="text"
                    name="productDetails.hairDirection"
                    value={productFormData.productDetails.hairDirection}
                    onChange={handleProductInputChange}
                    className="form-input"
                    placeholder="e.g., Forward"
                  />
                </div>
              </div>

              {/* Product Benefits */}
              <div className="form-section">
                <h4>Product Benefits (Rating 1-5)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Durability</label>
                    <input
                      type="number"
                      name="productBenefits.durability"
                      value={productFormData.productBenefits.durability}
                      onChange={handleProductInputChange}
                      min="1"
                      max="5"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Comfort</label>
                    <input
                      type="number"
                      name="productBenefits.comfort"
                      value={productFormData.productBenefits.comfort}
                      onChange={handleProductInputChange}
                      min="1"
                      max="5"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Appearance</label>
                    <input
                      type="number"
                      name="productBenefits.appearance"
                      value={productFormData.productBenefits.appearance}
                      onChange={handleProductInputChange}
                      min="1"
                      max="5"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Maintenance</label>
                    <input
                      type="number"
                      name="productBenefits.maintenance"
                      value={productFormData.productBenefits.maintenance}
                      onChange={handleProductInputChange}
                      min="1"
                      max="5"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Cut to Size */}
              <div className="form-section">
                <h4>Cut to Size Options</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="cutToSize.cutByStylist"
                        checked={productFormData.cutToSize.cutByStylist}
                        onChange={handleProductInputChange}
                      />
                      <span className="toggle-slider"></span>
                      Cut by Stylist
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="cutToSize.cutToMySize"
                        checked={productFormData.cutToSize.cutToMySize}
                        onChange={handleProductInputChange}
                      />
                      <span className="toggle-slider"></span>
                      Cut to My Size
                    </label>
                  </div>
                </div>
              </div>

              {/* Haircut Options */}
              {productFormData.mainCategory === 'Hair Systems' && (
                <div className="form-section">
                  <h4>Haircut Options</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Haircut Price</label>
                      <input
                        type="number"
                        name="haircut.price"
                        value={productFormData.haircut.price || ''}
                        onChange={handleProductInputChange}
                        min="0"
                        step="0.01"
                        className="form-input"
                        placeholder="e.g., 35.49"
                      />
                    </div>
                    <div className="form-group">
                      <label>Order Hair Length Height (inches)</label>
                      <input
                        type="number"
                        name="haircut.orderHairLength.height"
                        value={productFormData.haircut.orderHairLength.height || ''}
                        onChange={handleProductInputChange}
                        min="1"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Order Hair Length Width (inches)</label>
                      <input
                        type="number"
                        name="haircut.orderHairLength.width"
                        value={productFormData.haircut.orderHairLength.width || ''}
                        onChange={handleProductInputChange}
                        min="1"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="haircut.sendEmailToHairStore"
                          checked={productFormData.haircut.sendEmailToHairStore}
                          onChange={handleProductInputChange}
                        />
                        <span className="toggle-slider"></span>
                        Send Email to Hair Store
                      </label>
                    </div>
                    <div className="form-group">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="haircut.uploadImageHairStyle"
                          checked={productFormData.haircut.uploadImageHairStyle}
                          onChange={handleProductInputChange}
                        />
                        <span className="toggle-slider"></span>
                        Upload Image Hair Style
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <small><em>Note: Hair Colors and Haircut Styles can be managed after product creation</em></small>
                  </div>
                </div>
              )}

              {/* Additional Information & SEO */}
              <div className="form-section">
                <h4>Additional Information & SEO</h4>
                <div className="form-group">
                  <label>Additional Information</label>
                  <textarea
                    name="additionalInformation"
                    value={productFormData.additionalInformation}
                    onChange={handleProductInputChange}
                    rows="3"
                    className="form-input"
                    placeholder="Custom measurements and styling available..."
                  />
                </div>
                <div className="form-group">
                  <label>SEO Title</label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={productFormData.seoTitle}
                    onChange={handleProductInputChange}
                    className="form-input"
                    placeholder="Optional - defaults to product name"
                  />
                </div>
                <div className="form-group">
                  <label>SEO Description</label>
                  <textarea
                    name="seoDescription"
                    value={productFormData.seoDescription}
                    onChange={handleProductInputChange}
                    rows="2"
                    className="form-input"
                    placeholder="Optional - defaults to product description"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseProductModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FontAwesomeIcon icon={faSave} /> {editingProduct ? 'Update' : 'Create'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

