import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faEye, 
  faCheck, 
  faTimes, 
  faSyncAlt, 
  faExclamationCircle,
  faExclamationTriangle,
  faPlus,
  faSave,
  faUpload,
  faStar,
  faCrown,
  faToggleOn,
  faToggleOff,
  faCheckCircle,
  faListUl,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import Layout from '../shared/Layout';
import StatsCard from '../shared/StatsCard';
import DataTable from '../shared/DataTable';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import { allColors, allHaircuts } from '../../utils/productConstants';
import './SubAdminDashboard.css';

const SubAdminDashboard = () => {
  const { user, logout } = useAuth();
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
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });
  
  // Order detail drawer state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);
  const [statusHistoryLoading, setStatusHistoryLoading] = useState(false);
  
  // Products page state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [productFilters, setProductFilters] = useState({
    mainCategory: 'all',
    subCategory: 'all',
    isActive: 'all',
    bestSelling: 'all',
    premiumProduct: 'all',
    search: ''
  });
  const [productsPagination, setProductsPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });
  
  // Product modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    productName: '',
    productShortTitle: '',
    productDescription: '',
    mainCategory: 'Hair Systems',
    subCategory: 'Skin',
    productCode: '',
    pricing: {
      priceForIndividual: 0,
      discountedPriceForIndividual: 0,
      priceForBusiness: 0,
      discountedPriceForBusiness: 0,
      actualBasePrice: 0
    },
    bestSelling: false,
    premiumProduct: false,
    isActive: true,
    stock: 0,
    tags: '',
    // Product Details
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
    // Product Benefits
    productBenefits: {
      durability: 5,
      comfort: 5,
      appearance: 5,
      maintenance: 5
    },
    // Cut to Size
    cutToSize: {
      cutByStylist: false,
      cutToMySize: false
    },
    // Haircut
    haircut: {
      price: 0,
      sendEmailToHairStore: false,
      orderHairLength: {
        height: 8,
        width: 6
      },
      uploadImageHairStyle: false
    },
    // Additional & SEO
    additionalInformation: '',
    seoTitle: '',
    seoDescription: ''
  });
  const [productImages, setProductImages] = useState([]);
  const [productImagesPreview, setProductImagesPreview] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedHaircuts, setSelectedHaircuts] = useState([]);
  
  // Categories page state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  const [categoryFilters, setCategoryFilters] = useState({
    isActive: 'all',
    search: ''
  });
  const [categoriesPagination, setCategoriesPagination] = useState({ current: 1, pages: 1, total: 0, limit: 10 });
  
  // Category modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activePage === 'orders') {
      fetchOrders({ page: 1 });
    } else if (activePage === 'products') {
      fetchProducts({ page: 1 });
    } else if (activePage === 'categories') {
      fetchCategories({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subadmin/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Sub-admin dashboard fetch error:', error);
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

  // Fetch orders with filters
  const fetchOrders = async ({ page = 1, status, paymentMethod, search, dateFrom, dateTo } = {}) => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', pagination.limit);
      
      // Use provided values or current filter state
      const filterSearch = search !== undefined ? search : orderFilters.search;
      const filterStatus = status !== undefined ? status : orderFilters.status;
      const filterPaymentMethod = paymentMethod !== undefined ? paymentMethod : orderFilters.paymentMethod;
      const filterDateFrom = dateFrom !== undefined ? dateFrom : orderFilters.dateFrom;
      const filterDateTo = dateTo !== undefined ? dateTo : orderFilters.dateTo;
      
      if (filterSearch) params.append('search', filterSearch);
      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPaymentMethod && filterPaymentMethod !== 'all') params.append('paymentMethod', filterPaymentMethod);
      if (filterDateFrom) params.append('dateFrom', filterDateFrom);
      if (filterDateTo) params.append('dateTo', filterDateTo);

      const response = await api.get(`/subadmin/orders?${params.toString()}`);
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
        setPagination(response.data.data.pagination || { current: 1, pages: 1, total: 0, limit: 10 });
      } else {
        setOrdersError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Sub-admin orders fetch error:', error);
      setOrdersError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Handle status update
  const handleUpdateStatus = async (orderId, nextStatus) => {
    if (!window.confirm(`Update order status to "${nextStatus}"?`)) return;
    try {
      await api.put(`/subadmin/orders/${orderId}/status`, { status: nextStatus });
      await fetchOrders({ page: pagination.current });
      // Refresh drawer if open
      if (showOrderDrawer && selectedOrder?._id === orderId) {
        await fetchStatusHistory(orderId);
        const updatedOrder = orders.find(o => o._id === orderId);
        if (updatedOrder) {
          setSelectedOrder({ ...updatedOrder, status: nextStatus });
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Open order detail drawer
  const handleOpenOrderDrawer = async (order) => {
    setSelectedOrder(order);
    setShowOrderDrawer(true);
    await fetchStatusHistory(order._id);
  };

  // Close order detail drawer
  const handleCloseOrderDrawer = () => {
    setShowOrderDrawer(false);
    setSelectedOrder(null);
    setStatusHistory([]);
  };

  // Fetch status history for an order
  const fetchStatusHistory = async (orderId) => {
    try {
      setStatusHistoryLoading(true);
      // Since there's no dedicated endpoint, we'll fetch from the order data
      // and create a simple history based on order.createdAt and order.estimatedDelivery
      // For now, we'll just show the current status
      const order = orders.find(o => o._id === orderId);
      if (order) {
        // Create a simple status history entry
        setStatusHistory([
          {
            status: order.status,
            updatedAt: order.updatedAt || order.createdAt,
            note: 'Current status'
          }
        ]);
      }
    } catch (error) {
      console.error('Fetch status history error:', error);
    } finally {
      setStatusHistoryLoading(false);
    }
  };

  // Get next statuses for order workflow
  const getNextStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return ['confirmed', 'in_queue'];
      case 'confirmed':
        return ['in_queue', 'in_process'];
      case 'in_queue':
        return ['in_process', 'ready_to_ship'];
      case 'in_process':
        return ['ready_to_ship'];
      case 'ready_to_ship':
        return [];
      default:
        return [];
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { class: 'pending', label: 'Pending' },
      'confirmed': { class: 'confirmed', label: 'Confirmed' },
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

  // ============ PRODUCTS MANAGEMENT FUNCTIONS ============
  
  // Fetch products with filters
  const fetchProducts = async ({ page = 1, mainCategory, subCategory, isActive, bestSelling, premiumProduct, search } = {}) => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', productsPagination.limit);
      
      const filterSearch = search !== undefined ? search : productFilters.search;
      const filterMainCategory = mainCategory !== undefined ? mainCategory : productFilters.mainCategory;
      const filterSubCategory = subCategory !== undefined ? subCategory : productFilters.subCategory;
      const filterIsActive = isActive !== undefined ? isActive : productFilters.isActive;
      const filterBestSelling = bestSelling !== undefined ? bestSelling : productFilters.bestSelling;
      const filterPremiumProduct = premiumProduct !== undefined ? premiumProduct : productFilters.premiumProduct;
      
      if (filterSearch) params.append('search', filterSearch);
      if (filterMainCategory && filterMainCategory !== 'all') params.append('mainCategory', filterMainCategory);
      if (filterSubCategory && filterSubCategory !== 'all') params.append('subCategory', filterSubCategory);
      if (filterIsActive && filterIsActive !== 'all') params.append('isActive', filterIsActive === 'true');
      if (filterBestSelling && filterBestSelling !== 'all') params.append('bestSelling', filterBestSelling === 'true');
      if (filterPremiumProduct && filterPremiumProduct !== 'all') params.append('premiumProduct', filterPremiumProduct === 'true');

      const response = await api.get(`/subadmin/products?${params.toString()}`);
      if (response.data.success) {
        setProducts(response.data.data.products || []);
        setProductsPagination(response.data.data.pagination || { current: 1, pages: 1, total: 0, limit: 10 });
      } else {
        setProductsError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Products fetch error:', error);
      setProductsError(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setProductsLoading(false);
    }
  };

  // Handle inline toggle (best selling, premium, active)
  const handleToggleProductFlag = async (productId, flag, currentValue) => {
    try {
      await api.put(`/subadmin/products/${productId}`, { [flag]: !currentValue });
      await fetchProducts({ page: productsPagination.current });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update product');
    }
  };

  // Open create product modal
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      productName: '',
      productShortTitle: '',
      productDescription: '',
      mainCategory: 'Hair Systems',
      subCategory: 'Skin',
      productCode: '',
      pricing: {
        priceForIndividual: 0,
        discountedPriceForIndividual: 0,
        priceForBusiness: 0,
        discountedPriceForBusiness: 0,
        actualBasePrice: 0
      },
      bestSelling: false,
      premiumProduct: false,
      isActive: true,
      stock: 0,
      tags: '',
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
        maintenance: 5
      },
      cutToSize: {
        cutByStylist: false,
        cutToMySize: false
      },
      haircut: {
        price: 0,
        sendEmailToHairStore: false,
        orderHairLength: {
          height: 8,
          width: 6
        },
        uploadImageHairStyle: false
      },
      additionalInformation: '',
      seoTitle: '',
      seoDescription: ''
    });
    setProductImages([]);
    setProductImagesPreview([]);
    // Initialize with all available colors and haircuts for new products
    setSelectedColors([...allColors]);
    setSelectedHaircuts([...allHaircuts]);
    setShowProductModal(true);
  };

  // Open edit product modal
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductFormData({
      productName: product.productName || '',
      productShortTitle: product.productShortTitle || '',
      productDescription: product.productDescription || '',
      mainCategory: product.mainCategory || 'Hair Systems',
      subCategory: product.subCategory || 'Skin',
      productCode: product.productDetails?.productCode || '',
      pricing: {
        priceForIndividual: product.pricing?.priceForIndividual || 0,
        discountedPriceForIndividual: product.pricing?.discountedPriceForIndividual || 0,
        priceForBusiness: product.pricing?.priceForBusiness || 0,
        discountedPriceForBusiness: product.pricing?.discountedPriceForBusiness || 0,
        actualBasePrice: product.pricing?.actualBasePrice || 0
      },
      bestSelling: product.bestSelling || false,
      premiumProduct: product.premiumProduct || false,
      isActive: product.isActive !== undefined ? product.isActive : true,
      stock: product.stock || 0,
      tags: (product.tags || []).join(', '),
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
        maintenance: product.productBenefits?.maintenance || 5
      },
      cutToSize: {
        cutByStylist: product.cutToSize?.cutByStylist || false,
        cutToMySize: product.cutToSize?.cutToMySize || false
      },
      haircut: {
        price: product.hairCut?.price || 0,
        sendEmailToHairStore: product.hairCut?.sendEmailToHairStore || false,
        orderHairLength: {
          height: product.hairCut?.orderHairLength?.height || 8,
          width: product.hairCut?.orderHairLength?.width || 6
        },
        uploadImageHairStyle: product.hairCut?.uploadImageHairStyle || false
      },
      additionalInformation: product.additionalInformation || '',
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || ''
    });
    setProductImages([]);
    setProductImagesPreview(product.productImages || []);
    setSelectedColors(product.colors || []);
    setSelectedHaircuts(product.hairCut?.chooseYourHairStyle || []);
    setShowProductModal(true);
  };

  // Close product modal
  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductImages([]);
    setProductImagesPreview([]);
    setSelectedColors([]);
    setSelectedHaircuts([]);
  };

  // Handle product form input change
  const handleProductInputChange = (field, value) => {
    if (field.includes('.')) {
      const parts = field.split('.');
      if (parts.length === 2) {
        const [parent, child] = parts;
        setProductFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
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
              [grandchild]: value
            }
          }
        }));
      }
    } else {
      setProductFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle main category change (affects sub category)
  const handleMainCategoryChange = (mainCategory) => {
    handleProductInputChange('mainCategory', mainCategory);
    // Reset sub category when switching to Accessories
    if (mainCategory === 'Accessories') {
      handleProductInputChange('subCategory', '');
    } else if (mainCategory === 'Hair Systems') {
      handleProductInputChange('subCategory', 'Skin');
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + productImages.length + productImagesPreview.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setProductImages([...productImages, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagesPreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const handleRemoveImage = (index) => {
    // Remove from both arrays
    if (index < productImagesPreview.length - productImages.length) {
      // Existing image (preview only)
      setProductImagesPreview(prev => prev.filter((_, i) => i !== index));
    } else {
      // New image (in both arrays)
      const newIndex = index - (productImagesPreview.length - productImages.length);
      setProductImages(prev => prev.filter((_, i) => i !== newIndex));
      setProductImagesPreview(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Submit product form
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = {
        ...productFormData,
        tags: productFormData.tags.split(',').map(t => t.trim()).filter(t => t),
        productDetails: {
          ...productFormData.productDetails,
          productCode: productFormData.productCode
        },
        colors: selectedColors,
        hairCut: {
          ...productFormData.haircut,
          chooseYourHairStyle: selectedHaircuts
        },
        mainCategorySlug: productFormData.mainCategory === 'Hair Systems' ? 'hair-systems' : 'accessories'
      };

      if (editingProduct) {
        // Update existing product
        await api.put(`/subadmin/products/${editingProduct._id}`, formDataToSend);
        
        // Upload new images if any
        if (productImages.length > 0) {
          const uploadFormData = new FormData();
          productImages.forEach(file => {
            uploadFormData.append('images', file);
          });
          await api.post(`/subadmin/products/${editingProduct._id}/images`, uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        alert('Product updated successfully');
      } else {
        // Create new product
        const response = await api.post('/subadmin/products', formDataToSend);
        
        // Upload images if any
        if (productImages.length > 0) {
          const uploadFormData = new FormData();
          productImages.forEach(file => {
            uploadFormData.append('images', file);
          });
          await api.post(`/subadmin/products/${response.data.data._id}/images`, uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        alert('Product created successfully');
      }
      
      handleCloseProductModal();
      await fetchProducts({ page: productsPagination.current });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  // ============ CATEGORIES MANAGEMENT FUNCTIONS ============
  
  // Fetch categories with filters
  const fetchCategories = async ({ page = 1, isActive, search } = {}) => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', categoriesPagination.limit);
      
      const filterSearch = search !== undefined ? search : categoryFilters.search;
      const filterIsActive = isActive !== undefined ? isActive : categoryFilters.isActive;
      
      if (filterSearch) params.append('search', filterSearch);
      if (filterIsActive && filterIsActive !== 'all') params.append('isActive', filterIsActive === 'true');

      const response = await api.get(`/subadmin/categories?${params.toString()}`);
      if (response.data.success) {
        setCategories(response.data.data.categories || []);
        setCategoriesPagination(response.data.data.pagination || { current: 1, pages: 1, total: 0, limit: 10 });
      } else {
        setCategoriesError('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Categories fetch error:', error);
      setCategoriesError(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Open create category modal
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

  // Open edit category modal
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

  // Close category modal
  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  // Handle category form input change
  const handleCategoryInputChange = (field, value) => {
    setCategoryFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Submit category form
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update existing category
        await api.put(`/subadmin/categories/${editingCategory._id}`, categoryFormData);
        alert('Category updated successfully');
      } else {
        // Create new category
        await api.post('/subadmin/categories', categoryFormData);
        alert('Category created successfully');
      }
      
      handleCloseCategoryModal();
      await fetchCategories({ page: categoriesPagination.current });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save category');
    }
  };

  // Toggle category active status
  const handleToggleCategoryFlag = async (categoryId, currentStatus) => {
    try {
      await api.put(`/subadmin/categories/${categoryId}`, {
        isActive: !currentStatus
      });
      await fetchCategories({ page: categoriesPagination.current });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update category');
    }
  };

  if (loading) {
    return (
      <Layout
        activePage={activePage}
        onPageChange={handlePageChange}
        user={user}
        userRole="subadmin"
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
        userRole="subadmin"
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
      <div className="subadmin-dashboard">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Sub-Admin Dashboard</h2>
          <p>Manage products and process orders</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatsCard
            title="Total Products"
            value={dashboardData.stats.totalProducts}
            icon="fas fa-cube"
            color="purple"
          />
          <StatsCard
            title="Total Orders"
            value={dashboardData.stats.totalOrders}
            icon="fas fa-box"
            color="blue"
          />
          <StatsCard
            title="Pending Orders"
            value={dashboardData.stats.pendingOrders}
            icon="fas fa-clock"
            color="yellow"
          />
          <StatsCard
            title="Processing Orders"
            value={dashboardData.stats.processingOrders}
            icon="fas fa-cog"
            color="blue"
          />
          <StatsCard
            title="Ready to Ship"
            value={dashboardData.stats.readyToShip}
            icon="fas fa-check-circle"
            color="green"
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
              { key: 'customer', title: 'Customer' },
              { key: 'products', title: 'Products' },
              { key: 'total', title: 'Total' },
              { key: 'status', title: 'Status' },
              { key: 'date', title: 'Order Date' }
            ]}
            data={dashboardData.recentOrders.map(order => ({
              id: order._id,
              orderNumber: order.orderNumber,
              customer: (
                <div className="customer-info">
                  <p className="customer-name">{order.user?.fullName || 'N/A'}</p>
                  <p className="customer-email">{order.user?.email || 'N/A'}</p>
                </div>
              ),
              products: `${order.items.length} item(s)`,
              total: `$${order.pricing?.total || 0}`,
              status: getStatusBadge(order.status),
              date: new Date(order.createdAt).toLocaleDateString()
            }))}
            emptyMessage="No orders found"
          />
        </div>
      </div>
    );
  };

  const renderProducts = () => {
    const columns = [
      { key: 'name', title: 'Name' },
      { key: 'code', title: 'Code' },
      { key: 'category', title: 'Category' },
      { key: 'stock', title: 'Stock' },
      { key: 'price', title: 'Price' },
      { key: 'bestSelling', title: 'Best Selling' },
      { key: 'premium', title: 'Premium' },
      { key: 'status', title: 'Status' }
    ];

    const tableData = (products || []).map((product) => ({
      id: product._id,
      name: product.productName,
      code: product.productDetails?.productCode || 'N/A',
      category: `${product.mainCategory} - ${product.subCategory || 'N/A'}`,
      stock: product.stock || 0,
      price: `$${product.pricing?.priceForIndividual || 0}`,
      bestSelling: (
        <div className="tooltip-wrapper">
          <button
            className={`toggle-switch ${product.bestSelling ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleProductFlag(product._id, 'bestSelling', product.bestSelling);
            }}
          >
            <FontAwesomeIcon icon={product.bestSelling ? faCheck : faTimes} />
          </button>
          <span className="tooltip-text">
            {product.bestSelling ? 'Remove from Best Selling' : 'Mark as Best Selling'}
          </span>
        </div>
      ),
      premium: (
        <div className="tooltip-wrapper">
          <button
            className={`toggle-switch ${product.premiumProduct ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleProductFlag(product._id, 'premiumProduct', product.premiumProduct);
            }}
          >
            <FontAwesomeIcon icon={product.premiumProduct ? faCheck : faTimes} />
          </button>
          <span className="tooltip-text">
            {product.premiumProduct ? 'Remove from Premium' : 'Set as Premium'}
          </span>
        </div>
      ),
      status: (
        <div className="tooltip-wrapper">
          <button
            className={`toggle-switch ${product.isActive ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleProductFlag(product._id, 'isActive', product.isActive);
            }}
          >
            <FontAwesomeIcon icon={product.isActive ? faCheck : faTimes} />
          </button>
          <span className="tooltip-text">
            {product.isActive ? 'Deactivate Product' : 'Activate Product'}
          </span>
        </div>
      )
    }));

    // Subcategories for dropdown
    const getSubCategories = (mainCategory) => {
      if (mainCategory === 'Hair Systems') {
        return ['Skin', 'Lace', 'Mono', 'Hybrid'];
      } else if (mainCategory === 'Accessories') {
        return ['Adhesive', 'Glue'];
      }
      return [];
    };

    return (
      <div className="subadmin-products">
        <div className="section-header">
          <h3>Products</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="btn-primary" onClick={handleCreateProduct}>
              <FontAwesomeIcon icon={faPlus} /> Create Product
            </button>
          </div>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={productFilters.search}
            onChange={(e) => setProductFilters({ ...productFilters, search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts({ page: 1 })}
            className="filter-input"
          />
          <select
            value={productFilters.mainCategory}
            onChange={(e) => {
              const newCategory = e.target.value;
              setProductFilters({ ...productFilters, mainCategory: newCategory, subCategory: 'all' });
              fetchProducts({ page: 1, mainCategory: newCategory, subCategory: 'all' });
            }}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="Hair Systems">Hair Systems</option>
            <option value="Accessories">Accessories</option>
          </select>
          {productFilters.mainCategory !== 'all' && (
            <select
              value={productFilters.subCategory}
              onChange={(e) => {
                const newSub = e.target.value;
                setProductFilters({ ...productFilters, subCategory: newSub });
                fetchProducts({ page: 1, subCategory: newSub });
              }}
              className="filter-select"
            >
              <option value="all">All Sub Categories</option>
              {getSubCategories(productFilters.mainCategory).map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          )}
          <select
            value={productFilters.isActive}
            onChange={(e) => {
              setProductFilters({ ...productFilters, isActive: e.target.value });
              fetchProducts({ page: 1, isActive: e.target.value });
            }}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={productFilters.bestSelling}
            onChange={(e) => {
              setProductFilters({ ...productFilters, bestSelling: e.target.value });
              fetchProducts({ page: 1, bestSelling: e.target.value });
            }}
            className="filter-select"
          >
            <option value="all">All Products</option>
            <option value="true">Best Selling Only</option>
          </select>
          <select
            value={productFilters.premiumProduct}
            onChange={(e) => {
              setProductFilters({ ...productFilters, premiumProduct: e.target.value });
              fetchProducts({ page: 1, premiumProduct: e.target.value });
            }}
            className="filter-select"
          >
            <option value="all">All Products</option>
            <option value="true">Premium Only</option>
          </select>
          <button className="btn-primary" onClick={() => fetchProducts({ page: 1 })}>
            <FontAwesomeIcon icon={faSyncAlt} /> Refresh
          </button>
        </div>

        {productsError && (
          <div className="error-banner">
            <FontAwesomeIcon icon={faExclamationCircle} />
            {productsError}
          </div>
        )}

        <DataTable
          columns={columns}
          data={tableData}
          loading={productsLoading}
          actions={(row) => {
            const original = (products || []).find(p => p._id === row.id);
            return (
              <div className="actions-cell">
                <div className="tooltip-wrapper">
                  <button
                    className="action-btn action-btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (original) handleEditProduct(original);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <span className="tooltip-text">Edit Product</span>
                </div>
                <div className="tooltip-wrapper">
                  <button
                    className="action-btn action-btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (original && window.confirm(`Are you sure you want to delete "${original.productName}"?`)) {
                        // Add delete handler here if needed
                        alert('Delete functionality will be implemented');
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <span className="tooltip-text">Delete Product</span>
                </div>
                <div className="tooltip-wrapper">
                  <button
                    className="action-btn action-btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (original) {
                        // Navigate to product view or open details modal
                        window.open(`/product/${original._id}`, '_blank');
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <span className="tooltip-text">View Product</span>
                </div>
              </div>
            );
          }}
        />

        {productsPagination.pages > 1 && (
          <div className="pagination-controls">
            <button
              className="btn-secondary"
              disabled={productsPagination.current <= 1}
              onClick={() => fetchProducts({ page: productsPagination.current - 1 })}
            >
              Prev
            </button>
            <span className="page-info">Page {productsPagination.current} of {productsPagination.pages}</span>
            <button
              className="btn-secondary"
              disabled={productsPagination.current >= productsPagination.pages}
              onClick={() => fetchProducts({ page: productsPagination.current + 1 })}
            >
              Next
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
              <form onSubmit={handleSubmitProduct}>
                <div className="modal-body">
                  <div className="form-section">
                    <h4>Basic Information</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Product Name *</label>
                        <input
                          type="text"
                          value={productFormData.productName}
                          onChange={(e) => handleProductInputChange('productName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Short Title *</label>
                        <input
                          type="text"
                          value={productFormData.productShortTitle}
                          onChange={(e) => handleProductInputChange('productShortTitle', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={productFormData.productDescription}
                        onChange={(e) => handleProductInputChange('productDescription', e.target.value)}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Main Category *</label>
                        <select
                          value={productFormData.mainCategory}
                          onChange={(e) => handleMainCategoryChange(e.target.value)}
                          required
                        >
                          <option value="Hair Systems">Hair Systems</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Sub Category *</label>
                        {productFormData.mainCategory === 'Accessories' ? (
                          <select
                            value={productFormData.subCategory}
                            onChange={(e) => handleProductInputChange('subCategory', e.target.value)}
                            required
                          >
                            <option value="Adhesive">Adhesive</option>
                            <option value="Glue">Glue</option>
                          </select>
                        ) : (
                          <select
                            value={productFormData.subCategory}
                            onChange={(e) => handleProductInputChange('subCategory', e.target.value)}
                            required
                          >
                            <option value="Skin">Skin</option>
                            <option value="Lace">Lace</option>
                            <option value="Mono">Mono</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Product Code *</label>
                      <input
                        type="text"
                        value={productFormData.productCode}
                        onChange={(e) => handleProductInputChange('productCode', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={productFormData.tags}
                        onChange={(e) => handleProductInputChange('tags', e.target.value)}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Pricing</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price for Individual *</label>
                        <input
                          type="number"
                          value={productFormData.pricing.priceForIndividual}
                          onChange={(e) => handleProductInputChange('pricing.priceForIndividual', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Discounted Price for Individual *</label>
                        <input
                          type="number"
                          value={productFormData.pricing.discountedPriceForIndividual}
                          onChange={(e) => handleProductInputChange('pricing.discountedPriceForIndividual', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price for Business *</label>
                        <input
                          type="number"
                          value={productFormData.pricing.priceForBusiness}
                          onChange={(e) => handleProductInputChange('pricing.priceForBusiness', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Discounted Price for Business *</label>
                        <input
                          type="number"
                          value={productFormData.pricing.discountedPriceForBusiness}
                          onChange={(e) => handleProductInputChange('pricing.discountedPriceForBusiness', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Actual Base Price *</label>
                      <input
                        type="number"
                        value={productFormData.pricing.actualBasePrice}
                        onChange={(e) => handleProductInputChange('pricing.actualBasePrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Flags & Stock</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Stock Quantity *</label>
                        <input
                          type="number"
                          value={productFormData.stock}
                          onChange={(e) => handleProductInputChange('stock', parseInt(e.target.value) || 0)}
                          min="0"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={productFormData.bestSelling}
                            onChange={(e) => handleProductInputChange('bestSelling', e.target.checked)}
                          />
                          Best Selling Product
                        </label>
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={productFormData.premiumProduct}
                            onChange={(e) => handleProductInputChange('premiumProduct', e.target.checked)}
                          />
                          Premium Product
                        </label>
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={productFormData.isActive}
                            onChange={(e) => handleProductInputChange('isActive', e.target.checked)}
                          />
                          Active (Visible to customers)
                        </label>
                      </div>
                    </div>
                  </div>

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

                  {/* Product Details Section */}
                  <div className="form-section">
                    <h4>Product Details</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Base Design *</label>
                        <input
                          type="text"
                          value={productFormData.productDetails.baseDesign}
                          onChange={(e) => handleProductInputChange('productDetails.baseDesign', e.target.value)}
                          placeholder="e.g., Skin Base, French Mono Base"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Base Size *</label>
                        <input
                          type="text"
                          value={productFormData.productDetails.baseSize}
                          onChange={(e) => handleProductInputChange('productDetails.baseSize', e.target.value)}
                          placeholder="e.g., 8x10"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Front Contour *</label>
                        <input
                          type="text"
                          value={productFormData.productDetails.frontContour}
                          onChange={(e) => handleProductInputChange('productDetails.frontContour', e.target.value)}
                          placeholder="e.g., Natural Hairline, Traditional Hairline"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Bleach Knots *</label>
                        <input
                          type="text"
                          value={productFormData.productDetails.bleachKnots}
                          onChange={(e) => handleProductInputChange('productDetails.bleachKnots', e.target.value)}
                          placeholder="e.g., Yes, No"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Knot Types *</label>
                        <input
                          type="text"
                          value={productFormData.productDetails.knotTypes}
                          onChange={(e) => handleProductInputChange('productDetails.knotTypes', e.target.value)}
                          placeholder="e.g., Single Knot, Double Knot"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Hair Type *</label>
                        <input
                          type="text"
                          value={productFormData.productDetails.hairType}
                          onChange={(e) => handleProductInputChange('productDetails.hairType', e.target.value)}
                          placeholder="e.g., Human Hair"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Hair Length *</label>
                        <input
                          type="text"
                          value={productFormData.productDetails.hairLength}
                          onChange={(e) => handleProductInputChange('productDetails.hairLength', e.target.value)}
                          placeholder="e.g., 6 inches, 7 inches"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Hair Wave/Curl *</label>
                        <input
                          type="text"
                          value={productFormData.productDetails.hairWaveCurl}
                          onChange={(e) => handleProductInputChange('productDetails.hairWaveCurl', e.target.value)}
                          placeholder="e.g., Straight, Wavy, Curly"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Hair Density *</label>
                        <input
                          type="text"
                          value={productFormData.productDetails.hairDensity}
                          onChange={(e) => handleProductInputChange('productDetails.hairDensity', e.target.value)}
                          placeholder="e.g., Medium, Light, Heavy"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Hair Colour *</label>
                        <input
                          type="text"
                          value={productFormData.productDetails.hairColour}
                          onChange={(e) => handleProductInputChange('productDetails.hairColour', e.target.value)}
                          placeholder="e.g., Natural Black"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Hair Direction *</label>
                      <input
                        type="text"
                        value={productFormData.productDetails.hairDirection}
                        onChange={(e) => handleProductInputChange('productDetails.hairDirection', e.target.value)}
                        placeholder="e.g., Forward, Backward"
                        required
                      />
                    </div>
                  </div>

                  {/* Product Benefits Section */}
                  <div className="form-section">
                    <h4>Product Benefits (Rating 1-5)</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Durability (1-5) *</label>
                        <input
                          type="number"
                          value={productFormData.productBenefits.durability}
                          onChange={(e) => handleProductInputChange('productBenefits.durability', parseInt(e.target.value) || 5)}
                          min="1"
                          max="5"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Comfort (1-5) *</label>
                        <input
                          type="number"
                          value={productFormData.productBenefits.comfort}
                          onChange={(e) => handleProductInputChange('productBenefits.comfort', parseInt(e.target.value) || 5)}
                          min="1"
                          max="5"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Appearance (1-5) *</label>
                        <input
                          type="number"
                          value={productFormData.productBenefits.appearance}
                          onChange={(e) => handleProductInputChange('productBenefits.appearance', parseInt(e.target.value) || 5)}
                          min="1"
                          max="5"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Maintenance (1-5) *</label>
                        <input
                          type="number"
                          value={productFormData.productBenefits.maintenance}
                          onChange={(e) => handleProductInputChange('productBenefits.maintenance', parseInt(e.target.value) || 5)}
                          min="1"
                          max="5"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cut to Size Section */}
                  <div className="form-section">
                    <h4>Cut to Size Options</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={productFormData.cutToSize.cutByStylist}
                            onChange={(e) => handleProductInputChange('cutToSize.cutByStylist', e.target.checked)}
                          />
                          Cut by Stylist
                        </label>
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={productFormData.cutToSize.cutToMySize}
                            onChange={(e) => handleProductInputChange('cutToSize.cutToMySize', e.target.checked)}
                          />
                          Cut to My Size
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Haircut Options Section */}
                  {productFormData.mainCategory === 'Hair Systems' && (
                    <div className="form-section">
                      <h4>Haircut Options</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Haircut Price</label>
                          <input
                            type="number"
                            value={productFormData.haircut.price}
                            onChange={(e) => handleProductInputChange('haircut.price', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            placeholder="e.g., 35.49"
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={productFormData.haircut.sendEmailToHairStore}
                              onChange={(e) => handleProductInputChange('haircut.sendEmailToHairStore', e.target.checked)}
                            />
                            Send Email to Hair Store
                          </label>
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={productFormData.haircut.uploadImageHairStyle}
                              onChange={(e) => handleProductInputChange('haircut.uploadImageHairStyle', e.target.checked)}
                            />
                            Upload Image Hair Style
                          </label>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Order Hair Length Height (inches)</label>
                          <input
                            type="number"
                            value={productFormData.haircut.orderHairLength.height}
                            onChange={(e) => handleProductInputChange('haircut.orderHairLength.height', parseInt(e.target.value) || 8)}
                            min="1"
                          />
                        </div>
                        <div className="form-group">
                          <label>Order Hair Length Width (inches)</label>
                          <input
                            type="number"
                            value={productFormData.haircut.orderHairLength.width}
                            onChange={(e) => handleProductInputChange('haircut.orderHairLength.width', parseInt(e.target.value) || 6)}
                            min="1"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>
                          <em>Note: Hair Colors and Haircut Styles will be added after product creation</em>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Additional Information & SEO */}
                  <div className="form-section">
                    <h4>Additional Information & SEO</h4>
                    <div className="form-group">
                      <label>Additional Information</label>
                      <textarea
                        value={productFormData.additionalInformation}
                        onChange={(e) => handleProductInputChange('additionalInformation', e.target.value)}
                        rows={3}
                        placeholder="Custom measurements and styling available. Professional consultation included."
                      />
                    </div>
                    <div className="form-group">
                      <label>SEO Title</label>
                      <input
                        type="text"
                        value={productFormData.seoTitle}
                        onChange={(e) => handleProductInputChange('seoTitle', e.target.value)}
                        placeholder="Optional - defaults to product name"
                      />
                    </div>
                    <div className="form-group">
                      <label>SEO Description</label>
                      <textarea
                        value={productFormData.seoDescription}
                        onChange={(e) => handleProductInputChange('seoDescription', e.target.value)}
                        rows={2}
                        placeholder="Optional - defaults to product description"
                      />
                    </div>
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

  const renderOrders = () => {
    const columns = [
      { key: 'orderNumber', title: 'Order #' },
      { key: 'customer', title: 'Customer' },
      { key: 'products', title: 'Products' },
      { key: 'quantity', title: 'Qty' },
      { key: 'payment', title: 'Payment' },
      { key: 'total', title: 'Total' },
      { key: 'status', title: 'Status' },
      { key: 'date', title: 'Date' }
    ];

    const tableData = (orders || []).map((order) => ({
      id: order._id,
      orderNumber: order.orderNumber,
      customer: (
        <div className="customer-info">
          <p className="customer-name">{order.user?.fullName || 'N/A'}</p>
          <p className="customer-email">{order.user?.email || 'N/A'}</p>
        </div>
      ),
      products: `${(order.items || []).length} item(s)`,
      quantity: (order.items || []).reduce((sum, it) => sum + (it.quantity || 0), 0),
      payment: order.payment?.method === 'cash_on_delivery' ? 'COD' : 'Card',
      total: `$${order.pricing?.total || 0}`,
      status: getStatusBadge(order.status),
      date: new Date(order.createdAt).toLocaleDateString()
    }));

    return (
      <div className="subadmin-orders">
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
                fetchOrders({ page: 1, status: newStatus });
              }}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_queue">In Queue</option>
              <option value="in_process">In Process</option>
              <option value="ready_to_ship">Ready to Ship</option>
            </select>
            <select
              value={orderFilters.paymentMethod}
              onChange={(e) => {
                const newMethod = e.target.value;
                setOrderFilters({ ...orderFilters, paymentMethod: newMethod });
                fetchOrders({ page: 1, paymentMethod: newMethod });
              }}
              className="filter-select"
            >
              <option value="all">All Payment Methods</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
              <option value="card_payment">Card Payment</option>
            </select>
            <input
              type="date"
              placeholder="From"
              value={orderFilters.dateFrom}
              onChange={(e) => setOrderFilters({ ...orderFilters, dateFrom: e.target.value })}
              className="filter-input"
              style={{ width: '140px' }}
            />
            <input
              type="date"
              placeholder="To"
              value={orderFilters.dateTo}
              onChange={(e) => setOrderFilters({ ...orderFilters, dateTo: e.target.value })}
              className="filter-input"
              style={{ width: '140px' }}
            />
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
          onRowClick={(row) => {
            const original = (orders || []).find(o => o._id === row.id);
            if (original) handleOpenOrderDrawer(original);
          }}
          actions={(row) => {
            const original = (orders || []).find(o => o._id === row.id);
            const nextStatuses = getNextStatuses(original?.status);
            return (
              <div className="actions-cell">
                {nextStatuses.map((st) => {
                  // Get appropriate icon and tooltip text based on status
                  let icon, tooltip;
                  if (st === 'confirmed') {
                    icon = faCheckCircle;
                    tooltip = 'Confirm Order';
                  } else if (st === 'in_queue') {
                    icon = faListUl;
                    tooltip = 'Move to Queue';
                  } else if (st === 'in_process') {
                    icon = faCog;
                    tooltip = 'Start Processing';
                  } else if (st === 'ready_to_ship') {
                    icon = faCheckCircle;
                    tooltip = 'Mark Ready to Ship';
                  } else {
                    icon = faCheckCircle;
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

        {/* Order Detail Drawer */}
        {showOrderDrawer && selectedOrder && (
          <div className="drawer-overlay" onClick={handleCloseOrderDrawer}>
            <div className="drawer" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-header">
                <h3>Order Details - {selectedOrder.orderNumber}</h3>
                <button className="btn-icon" onClick={handleCloseOrderDrawer}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="drawer-body">
                {/* Order Info */}
                <div className="detail-section">
                  <h4>Order Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Order Number:</label>
                      <span>{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="detail-item">
                      <label>Order Date:</label>
                      <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span>{getStatusBadge(selectedOrder.status)}</span>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div className="detail-item">
                        <label>Estimated Delivery:</label>
                        <span>{new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="detail-section">
                  <h4>Customer Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Name:</label>
                      <span>{selectedOrder.user?.fullName || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedOrder.user?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedOrder.user?.phoneNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="detail-section">
                  <h4>Shipping Address</h4>
                  <div className="address-box">
                    <p>{selectedOrder.shippingAddress?.fullName || 'N/A'}</p>
                    <p>{selectedOrder.shippingAddress?.address || ''}</p>
                    <p>{selectedOrder.shippingAddress?.city || ''}, {selectedOrder.shippingAddress?.state || ''} {selectedOrder.shippingAddress?.zipCode || ''}</p>
                    <p>{selectedOrder.shippingAddress?.country || ''}</p>
                    <p>Phone: {selectedOrder.shippingAddress?.phoneNumber || 'N/A'}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="detail-section">
                  <h4>Order Items</h4>
                  <div className="items-list">
                    {(selectedOrder.items || []).map((item, idx) => (
                      <div key={idx} className="item-row">
                        <div className="item-image">
                          {item.product?.productImages?.[0] ? (
                            <img src={item.product.productImages[0]} alt={item.productName} />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                        </div>
                        <div className="item-details">
                          <p className="item-name">{item.productName || 'N/A'}</p>
                          <p className="item-code">Code: {item.productCode || 'N/A'}</p>
                          {item.selectedColor && (
                            <p className="item-color">Color: {item.selectedColor.colorType} ({item.selectedColor.colorCode})</p>
                          )}
                          {item.selectedHairCut && (
                            <p className="item-cut">Haircut: {item.selectedHairCut.hairCutCode}</p>
                          )}
                        </div>
                        <div className="item-quantity">Qty: {item.quantity}</div>
                        <div className="item-price">${item.unitPrice} × {item.quantity} = ${item.totalPrice}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="detail-section">
                  <h4>Payment Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Method:</label>
                      <span>{selectedOrder.payment?.method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card Payment'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Payment Status:</label>
                      <span>{selectedOrder.payment?.status || 'N/A'}</span>
                    </div>
                    {selectedOrder.payment?.transactionId && (
                      <div className="detail-item">
                        <label>Transaction ID:</label>
                        <span>{selectedOrder.payment.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="detail-section">
                  <h4>Order Totals</h4>
                  <div className="totals-box">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.pricing?.subtotal || 0}</span>
                    </div>
                    {selectedOrder.pricing?.tax > 0 && (
                      <div className="total-row">
                        <span>Tax:</span>
                        <span>${selectedOrder.pricing.tax}</span>
                      </div>
                    )}
                    {selectedOrder.pricing?.shipping > 0 && (
                      <div className="total-row">
                        <span>Shipping:</span>
                        <span>${selectedOrder.pricing.shipping}</span>
                      </div>
                    )}
                    {selectedOrder.pricing?.discount > 0 && (
                      <div className="total-row">
                        <span>Discount:</span>
                        <span>-${selectedOrder.pricing.discount}</span>
                      </div>
                    )}
                    <div className="total-row total-final">
                      <span>Total:</span>
                      <span>${selectedOrder.pricing?.total || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                <div className="detail-section">
                  <h4>Status History</h4>
                  {statusHistoryLoading ? (
                    <p>Loading status history...</p>
                  ) : statusHistory.length > 0 ? (
                    <div className="status-timeline">
                      {statusHistory.map((history, idx) => (
                        <div key={idx} className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <div className="timeline-status">{getStatusBadge(history.status)}</div>
                            <div className="timeline-date">{new Date(history.updatedAt).toLocaleString()}</div>
                            {history.note && <div className="timeline-note">{history.note}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No status history available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCategories = () => {
    const columns = [
      { key: 'name', title: 'Name' },
      { key: 'slug', title: 'Slug' },
      { key: 'description', title: 'Description' },
      { key: 'sortOrder', title: 'Sort Order' },
      { key: 'status', title: 'Status' }
    ];

    const tableData = (categories || []).map((category) => ({
      id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description || 'No description',
      sortOrder: category.sortOrder,
      status: (
        <div className="tooltip-wrapper">
          <button
            className={`toggle-switch ${category.isActive ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleCategoryFlag(category._id, category.isActive);
            }}
          >
            <FontAwesomeIcon icon={category.isActive ? faCheck : faTimes} />
          </button>
          <span className="tooltip-text">
            {category.isActive ? 'Deactivate Category' : 'Activate Category'}
          </span>
        </div>
      )
    }));

    return (
      <div className="subadmin-categories">
        <div className="section-header">
          <h3>Categories</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="btn-primary" onClick={handleCreateCategory}>
              <FontAwesomeIcon icon={faPlus} /> Create Category
            </button>
          </div>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search categories..."
            value={categoryFilters.search}
            onChange={(e) => setCategoryFilters({ ...categoryFilters, search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && fetchCategories({ page: 1 })}
            className="filter-input"
          />
          <select
            value={categoryFilters.isActive}
            onChange={(e) => {
              const newStatus = e.target.value;
              setCategoryFilters({ ...categoryFilters, isActive: newStatus });
              fetchCategories({ isActive: newStatus, page: 1 });
            }}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {categoriesError && (
          <div className="error-banner">
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span>{categoriesError}</span>
          </div>
        )}

        <DataTable
          columns={columns}
          data={tableData}
          loading={categoriesLoading}
          emptyMessage="No categories found"
          actions={(row) => {
            const original = (categories || []).find(c => c._id === row.id);
            return (
              <div className="actions-cell">
                <div className="tooltip-wrapper">
                  <button
                    className="action-btn action-btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (original) {
                        handleEditCategory(original);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <span className="tooltip-text">Edit Category</span>
                </div>
              </div>
            );
          }}
        />

        {categoriesPagination.pages > 1 && (
          <div className="pagination-controls">
            <button
              className="btn-secondary"
              disabled={categoriesPagination.current <= 1}
              onClick={() => fetchCategories({ page: categoriesPagination.current - 1 })}
            >
              Prev
            </button>
            <span className="page-info">Page {categoriesPagination.current} of {categoriesPagination.pages}</span>
            <button
              className="btn-secondary"
              disabled={categoriesPagination.current >= categoriesPagination.pages}
              onClick={() => fetchCategories({ page: categoriesPagination.current + 1 })}
            >
              Next
            </button>
          </div>
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <div className="modal-overlay" onClick={handleCloseCategoryModal}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
                <button className="btn-icon" onClick={handleCloseCategoryModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <form onSubmit={handleSubmitCategory}>
                <div className="modal-body">
                  <div className="form-section">
                    <h4>Category Information</h4>
                    <div className="form-group">
                      <label>Category Name *</label>
                      <input
                        type="text"
                        value={categoryFormData.name}
                        onChange={(e) => handleCategoryInputChange('name', e.target.value)}
                        required
                        placeholder="e.g., Hair Systems, Accessories"
                      />
                      <small style={{ color: '#6b7280', fontStyle: 'italic', display: 'block', marginTop: '4px' }}>
                        Slug will be auto-generated from name
                      </small>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={categoryFormData.description}
                        onChange={(e) => handleCategoryInputChange('description', e.target.value)}
                        rows={3}
                        placeholder="Optional description for the category"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Sort Order</label>
                        <input
                          type="number"
                          value={categoryFormData.sortOrder}
                          onChange={(e) => handleCategoryInputChange('sortOrder', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={categoryFormData.isActive}
                            onChange={(e) => handleCategoryInputChange('isActive', e.target.checked)}
                          />
                          Active (Visible to customers)
                        </label>
                      </div>
                    </div>
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

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProducts();
      case 'orders':
        return renderOrders();
      case 'categories':
        return renderCategories();
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout
      activePage={activePage}
      onPageChange={handlePageChange}
      user={user}
      userRole="subadmin"
      onLogout={handleLogout}
      title={activePage.charAt(0).toUpperCase() + activePage.slice(1)}
    >
      {renderPage()}
    </Layout>
  );
};

export default SubAdminDashboard;
