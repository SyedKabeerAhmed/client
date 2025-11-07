import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import DataTable from '../shared/DataTable';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';
import './UserWishlist.css';

const UserWishlist = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState('wishlist');
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/wishlist');
      
      if (response.data.success) {
        setWishlist(response.data.data);
      } else {
        setError('Failed to fetch wishlist');
      }
    } catch (error) {
      console.error('Wishlist fetch error:', error);
      setError('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await api.delete(`/user/wishlist/${productId}`);
      
      if (response.data.success) {
        setWishlist(prev => prev.filter(item => item.product._id !== productId));
      } else {
        setError('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      setError('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      // This would integrate with your cart system
      console.log('Add to cart:', productId);
      // You can implement cart functionality here
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const handleLogout = () => {
    logout();
  };

  const columns = [
    {
      key: 'product',
      title: 'Product',
      className: 'product-column',
      render: (value, item) => (
        <div className="product-info">
          <div className="product-image-container">
            <img 
              src={item.product?.images?.[0] || '/default-product.png'} 
              alt="Product" 
              className="product-image"
            />
            <div className="product-overlay">
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(item.product._id)}
              >
                <i className="fas fa-shopping-cart"></i>
              </button>
            </div>
          </div>
          <div className="product-details">
            <p className="product-name">{item.product?.name || 'Product'}</p>
            <p className="product-category">{item.product?.category?.name || 'Category'}</p>
            <button 
              className="remove-btn"
              onClick={() => handleRemoveFromWishlist(item.product._id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (value, item) => (
        <div className="price-info">
          <span className="current-price">${item.product?.price || 0}</span>
          {item.product?.originalPrice && item.product?.originalPrice > item.product?.price && (
            <span className="original-price">${item.product.originalPrice}</span>
          )}
          {item.product?.discount && (
            <span className="discount-badge">-{item.product.discount}%</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, item) => (
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => handleAddToCart(item.product._id)}
          >
            <i className="fas fa-shopping-cart"></i>
            Add to Cart
          </button>
          <button 
            className="action-btn danger"
            onClick={() => handleRemoveFromWishlist(item.product._id)}
          >
            <i className="fas fa-times"></i>
            Remove
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout
      activePage={activePage}
      onPageChange={handlePageChange}
      user={user}
      userRole="user"
      onLogout={handleLogout}
      title="Wishlist"
    >
      <div className="user-wishlist">
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
        )}
        
        <DataTable
          columns={columns}
          data={wishlist}
          loading={loading}
          emptyMessage="Your wishlist is empty. Start adding products you love!"
        />
      </div>
    </Layout>
  );
};

export default UserWishlist;
