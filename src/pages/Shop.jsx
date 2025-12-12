import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'
import './Shop.css'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [filterCategory, setFilterCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [searchInfo, setSearchInfo] = useState(null)

  // Helper function to get display name for category
  const getCategoryDisplayName = (categorySlug) => {
    const categoryNames = {
      'all': 'Our Hair Systems & Accessories',
      'hair-systems': 'Hair Systems',
      'accessories': 'Accessories',
      'skin': 'Skin Hair Systems',
      'lace': 'Lace Hair Systems', 
      'hybrid': 'Hybrid Hair Systems',
      'mono': 'Mono Hair Systems',
      'adhesive': 'Adhesives',
      'glue': 'Glues',
      'tools': 'Tools',
      'care-products': 'Care Products'
    }
    return categoryNames[categorySlug] || 'Our Hair Systems & Accessories'
  }

  // Helper function to get subtitle for category
  const getCategorySubtitle = (categorySlug) => {
    const subtitles = {
      'all': 'Explore Our Most Sought-After Hair Systems, Carefully Selected To Give You The Perfect Balance Of Style, Comfort, And A Natural Look',
      'hair-systems': 'Explore Our Complete Range Of Hair Systems, Designed To Provide The Perfect Balance Of Style, Comfort, And Natural Appearance',
      'accessories': 'Discover Essential Accessories And Tools To Maintain And Style Your Hair Systems With Professional Results',
      'skin': 'Experience The Ultimate In Comfort And Natural Appearance With Our Premium Skin Hair Systems',
      'lace': 'Discover The Perfect Blend Of Breathability And Natural Look With Our High-Quality Lace Hair Systems',
      'hybrid': 'Get The Best Of Both Worlds With Our Innovative Hybrid Hair Systems Combining Multiple Base Materials',
      'mono': 'Enjoy Superior Durability And Easy Maintenance With Our Monofilament Hair Systems',
      'adhesive': 'Professional-Grade Adhesives For Secure And Long-Lasting Hair System Attachment',
      'glue': 'High-Quality Glues And Bonding Solutions For Reliable Hair System Installation',
      'tools': 'Essential Tools And Equipment For Professional Hair System Application And Maintenance',
      'care-products': 'Premium Care Products To Keep Your Hair Systems Looking Fresh And Natural'
    }
    return subtitles[categorySlug] || 'Explore Our Most Sought-After Hair Systems, Carefully Selected To Give You The Perfect Balance Of Style, Comfort, And A Natural Look'
  }

  // Helper function to get parent category for subcategories
  const getParentCategoryForSubcategory = (subCategorySlug) => {
    const subcategoryToParentMap = {
      'skin': 'hair-systems',
      'lace': 'hair-systems', 
      'hybrid': 'hair-systems',
      'mono': 'hair-systems',
      'adhesive': 'accessories',
      'glue': 'accessories',
      'tools': 'accessories',
      'care-products': 'accessories'
    }
    return subcategoryToParentMap[subCategorySlug] || 'hair-systems'
  }

  // Load categories on component mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Load products on component mount and when filters change
  useEffect(() => {
    loadProducts()
  }, [filterCategory, sortBy, currentPage])

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setFilterCategory(categoryFromUrl)
    }
  }, [searchParams])

  // Load categories function
  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories()
      
      // Debug: Log the response to understand the structure
      console.log('Categories API Response:', response)
      console.log('Response type:', typeof response)
      console.log('Is Array:', Array.isArray(response))
      
      // Handle different response formats
      let categoriesData = []
      
      // Check if response is directly an array
      if (Array.isArray(response)) {
        categoriesData = response
      }
      // Check if response has a data property with array
      else if (response && response.data && Array.isArray(response.data)) {
        categoriesData = response.data
      }
      // Check if response has a categories property with array
      else if (response && response.categories && Array.isArray(response.categories)) {
        categoriesData = response.categories
      }
      // Check if response has a result property with array
      else if (response && response.result && Array.isArray(response.result)) {
        categoriesData = response.result
      }
      // Check if response is a single object (wrap in array)
      else if (response && typeof response === 'object' && response.slug) {
        categoriesData = [response]
      }
      // If none of the above, log error and use fallback
      else {
        console.error('Unexpected categories response format:', response)
        throw new Error('Invalid response format')
      }
      
      console.log('Processed categories data:', categoriesData)
      
      // Ensure categoriesData is an array before setting
      if (Array.isArray(categoriesData)) {
        // Normalize categories to enforce your structure
        const normalized = categoriesData.map(cat => {
          if (cat.slug === 'hair-systems') {
            return {
              ...cat,
              subCategories: [
                { name: 'Skin', slug: 'skin' },
                { name: 'Lace', slug: 'lace' },
                { name: 'Mono', slug: 'mono' },
                { name: 'Hybrid', slug: 'hybrid' }
              ]
            }
          }
          if (cat.slug === 'accessories') {
            return { ...cat, subCategories: [] } // No subcategories for accessories
          }
          return cat
        })
        setCategories(normalized)
        
        // Find hair systems category and set its subcategories
        const hairSystemsCategory = normalized.find(cat => cat.slug === 'hair-systems')
        if (hairSystemsCategory && hairSystemsCategory.subCategories) {
          setSubcategories(hairSystemsCategory.subCategories)
        }
      } else {
        throw new Error('Categories data is not an array')
      }
    } catch (err) {
      console.error('Error loading categories:', err)
      // Set fallback categories if API fails
      const fallbackCategories = [
        {
          _id: 'hair-systems',
          name: 'Hair Systems',
          slug: 'hair-systems',
          subCategories: [
            { name: 'Skin', slug: 'skin' },
            { name: 'Lace', slug: 'lace' },
            { name: 'Hybrid', slug: 'hybrid' },
            { name: 'Mono', slug: 'mono' }
          ]
        },
        {
          _id: 'accessories',
          name: 'Accessories',
          slug: 'accessories',
          subCategories: [] // No subcategories for accessories
        }
      ]
      setCategories(fallbackCategories)
    }
  }

  // Load products function
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      setSearchInfo(null) // Clear search info when loading regular products

      let response
      const params = {
        page: currentPage,
        limit: 12,
        sortBy: sortBy,
        sortOrder: sortBy === 'pricing.priceForIndividual' ? 'asc' : 'desc'
      }

      if (filterCategory !== 'all') {
        // Determine if this is a main category or subcategory
        const isMainCategory = ['hair-systems', 'accessories'].includes(filterCategory)
        
        if (isMainCategory) {
          // Use main category endpoint
          response = await productService.getProductsByMainCategory(filterCategory, params)
        } else {
          // Use subcategory endpoint - determine parent category
          const parentCategory = getParentCategoryForSubcategory(filterCategory)
          console.log('🔍 Using Subcategory:', parentCategory, '->', filterCategory)
          response = await productService.getProductsByCategoryAndSubcategory(parentCategory, filterCategory, params)
        }
      } else {
        // Use general products endpoint for all products
        response = await productService.getProducts(params)
      }

      console.log('🔍 API Response Received:', response)

      if (response.success && response.data) {
        console.log('🔍 Processing Success Response:', response.data)
        if (currentPage === 1) {
          setProducts(response.data.products)
        } else {
          setProducts(prev => [...prev, ...response.data.products])
        }
        setHasMore(response.data.pagination?.hasNext || false)
      } else {
        console.log('🔍 Processing Direct Response:', response)
        // Handle direct response format (without success wrapper)
        if (currentPage === 1) {
          setProducts(response.products || [])
        } else {
          setProducts(prev => [...prev, ...(response.products || [])])
        }
        setHasMore(response.pagination?.hasNext || false)
      }
    } catch (err) {
      setError(err.message || 'Failed to load products')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Search products function
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadProducts()
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Use the new unified search API
      const response = await productService.searchProducts(searchQuery, {
        page: 1,
        limit: 12
      })

      console.log('🔍 Search API Response:', response)

      if (response.success && response.data) {
        setProducts(response.data.products)
        setHasMore(response.data.pagination?.totalPages > 1)
        setCurrentPage(1)
        
        // Store search information
        setSearchInfo({
          query: response.data.query,
          searchType: response.data.searchType,
          totalResults: response.data.pagination?.totalProducts || response.data.products.length
        })
        
        // Show search type info
        console.log(`🔍 Search Type: ${response.data.searchType}`)
        console.log(`🔍 Found ${response.data.products.length} products for query: "${response.data.query}"`)
      } else {
        // Handle direct response format (without success wrapper)
        setProducts(response.products || [])
        setHasMore(false)
        setCurrentPage(1)
        setSearchInfo({
          query: searchQuery,
          searchType: 'general',
          totalResults: response.products?.length || 0
        })
      }
    } catch (err) {
      setError(err.message || 'Search failed')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load more products
  const loadMoreProducts = () => {
    setCurrentPage(prev => prev + 1)
  }

  // Handle filter change
  const handleFilterChange = (e) => {
    const newCategory = e.target.value
    setFilterCategory(newCategory)
    setCurrentPage(1)
    
    // Update URL parameters
    if (newCategory === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: newCategory })
    }
  }

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    setCurrentPage(1)
  }

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
          ★
        </span>
      )
    }
    return stars
  }

  return (
    <div className="shop-page">
      <div className="shop-content">
        <Container>
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">{getCategoryDisplayName(filterCategory)}</h1>
            <p className="page-subtitle">
              {getCategorySubtitle(filterCategory)}
            </p>
          </div>

          {/* Search Bar */}
          <div className="search-section mb-4">
            <Form onSubmit={handleSearch}>
              <Row className="align-items-center">
                <Col md={8}>
                      <Form.Control
                        type="text"
                        placeholder="Search by product name or code (e.g., HS-SKIN-003)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                </Col>
                <Col md={4}>
                  <Button type="submit" className="search-button">
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>

          {/* Filters and Sort */}
          <div className="shop-controls">
            <Row className="align-items-center">
              <Col md={6}>
                <div className="filter-section">
                  <Form.Select 
                    value={filterCategory} 
                    onChange={handleFilterChange}
                    className="filter-select"
                  >
                    <option value="all">All Categories</option>
                    {categories && Array.isArray(categories) && categories.map((category) => (
                      <optgroup key={category._id} label={category.name}>
                        {category.subCategories && category.subCategories.length > 0 ? (
                          // Show subcategories if they exist (only for Hair Systems)
                          category.subCategories.map((subcategory) => (
                            <option key={subcategory.slug} value={subcategory.slug}>
                              {subcategory.name}
                            </option>
                          ))
                        ) : (
                          // Show main category option if no subcategories (for Accessories)
                          <option value={category.slug}>{category.name}</option>
                        )}
                      </optgroup>
                    ))}
                  </Form.Select>
                </div>
              </Col>
              <Col md={6} className="text-md-end">
                <div className="sort-section">
                  <Form.Select 
                    value={sortBy} 
                    onChange={handleSortChange}
                    className="sort-select"
                  >
                    <option value="createdAt">Featured</option>
                    <option value="pricing.priceForIndividual">Price: Low to High</option>
                    <option value="pricing.priceForIndividual">Price: High to Low</option>
                    <option value="createdAt">Newest</option>
                    <option value="productReviews.averageReviewRating">Highest Rated</option>
                  </Form.Select>
                </div>
              </Col>
            </Row>
          </div>

              {/* Search Results Info */}
              {searchInfo && (
                <div className="search-results-info mb-4">
                  <div className="alert alert-info d-flex justify-content-between align-items-center">
                    <div>
                      <i className="fas fa-search me-2"></i>
                      <strong>Search Results:</strong> Found {searchInfo.totalResults} product{searchInfo.totalResults !== 1 ? 's' : ''} for "{searchInfo.query}"
                      {searchInfo.searchType === 'product_code' && (
                        <span className="ms-2 badge bg-primary">Product Code Search</span>
                      )}
                      {searchInfo.searchType === 'general' && (
                        <span className="ms-2 badge bg-secondary">General Search</span>
                      )}
                    </div>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => {
                        setSearchQuery('')
                        setSearchInfo(null)
                        loadProducts()
                      }}
                    >
                      <i className="fas fa-times me-1"></i>
                      Clear Search
                    </Button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

          {/* Loading Spinner */}
          {loading && currentPage === 1 && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading products...</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className="products-section">
              <Row className="g-4">
                {products.map((product) => (
                  <Col lg={3} md={6} key={product._id}>
                    <Card className="product-card">
                      <div className="product-image-container">
                        <img 
                          src={product.productImages?.[0] || '/src/assets/images/image_108.png'} 
                          alt={product.productName}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = '/src/assets/images/image_108.png'
                          }}
                        />
                        {product.bestSelling && (
                          <div className="best-selling-badge">
                            Best Selling
                          </div>
                        )}
                        {product.premiumProduct && (
                          <div className="premium-badge">
                            Premium
                          </div>
                        )}
                      </div>
                      
                      <Card.Body className="product-content">
                        <h5 className="product-name">{product.productName}</h5>
                        <p className="product-short-title">{product.productShortTitle}</p>
                        <p className="product-price">
                          £{product.pricing?.priceForIndividual || product.pricing?.actualBasePrice || 'N/A'}
                          {product.pricing?.discountedPriceForIndividual && (
                            <span className="discounted-price">
                              £{product.pricing.discountedPriceForIndividual}
                            </span>
                          )}
                        </p>
                        <p className="product-description">{product.productDescription}</p>
                        
                        {/* Product Benefits */}
                        {product.productBenefits && (
                          <div className="product-benefits">
                            <div className="benefit-item">
                              <span className="benefit-label">Durability:</span>
                              <div className="benefit-stars">
                                {renderStars(product.productBenefits.durability)}
                              </div>
                            </div>
                            <div className="benefit-item">
                              <span className="benefit-label">Comfort:</span>
                              <div className="benefit-stars">
                                {renderStars(product.productBenefits.comfort)}
                              </div>
                            </div>
                            <div className="benefit-item">
                              <span className="benefit-label">Appearance:</span>
                              <div className="benefit-stars">
                                {renderStars(product.productBenefits.appearance)}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Product Reviews */}
                        {product.productReviews && (
                          <div className="product-rating">
                            <div className="rating-stars">
                              {renderStars(Math.round(product.productReviews.averageReviewRating))}
                            </div>
                            <span className="rating-text">({product.productReviews.totalReviewers} reviews)</span>
                          </div>
                        )}
                        
                        {/* Product Code */}
                        <div className="product-code">
                          <small>Code: {product.productDetails?.productCode}</small>
                        </div>
                        
                            <Button 
                              className="shop-now-button"
                              onClick={() => handleProductClick(product._id)}
                            >
                              SHOP NOW
                            </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* No Products Message */}
          {!loading && products.length === 0 && !error && (
            <div className="text-center py-5">
              <h4>No products found</h4>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="load-more-section text-center">
              <Button 
                variant="outline-primary" 
                size="lg" 
                className="load-more-btn"
                onClick={loadMoreProducts}
              >
                Load More Products
              </Button>
            </div>
          )}

          {/* Loading More Spinner */}
          {loading && currentPage > 1 && (
            <div className="text-center py-3">
              <Spinner animation="border" variant="primary" size="sm" />
              <span className="ms-2">Loading more products...</span>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}

export default Shop
