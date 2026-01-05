import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'
import { useAuth } from '../contexts/AuthContext'
import { getBasePriceForUser, getDiscountedPriceForUser } from '../utils/pricingUtils'
import './Shop.css'

const Shop = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
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
      'all': t('shop.ourHairSystems'),
      'hair-systems': t('shop.hairSystems'),
      'accessories': t('shop.accessories'),
      'skin': t('shop.skinHairSystems'),
      'lace': t('shop.laceHairSystems'), 
      'hybrid': t('shop.hybridHairSystems'),
      'mono': t('shop.monoHairSystems'),
      'adhesive': t('shop.adhesives'),
      'glue': t('shop.glues'),
      'tools': t('shop.tools'),
      'care-products': t('shop.careProducts')
    }
    return categoryNames[categorySlug] || t('shop.ourHairSystems')
  }

  // Helper function to get subtitle for category
  const getCategorySubtitle = (categorySlug) => {
    const subtitles = {
      'all': t('shop.exploreSubtitle'),
      'hair-systems': t('shop.hairSystemsSubtitle'),
      'accessories': t('shop.accessoriesSubtitle'),
      'skin': t('shop.skinSubtitle'),
      'lace': t('shop.laceSubtitle'),
      'hybrid': t('shop.hybridSubtitle'),
      'mono': t('shop.monoSubtitle'),
      'adhesive': t('shop.adhesiveSubtitle'),
      'glue': t('shop.glueSubtitle'),
      'tools': t('shop.toolsSubtitle'),
      'care-products': t('shop.careProductsSubtitle')
    }
    return subtitles[categorySlug] || t('shop.exploreSubtitle')
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
            <h1
              className="page-title"
             
            >
              {getCategoryDisplayName(filterCategory)}
            </h1>
            <p
              className="page-subtitle"
             
            >
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
                        placeholder={t('common.searchPlaceholder') || "Search by product name or code (e.g., HS-SKIN-003)..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                </Col>
                <Col md={4}>
                  <Button type="submit" className="search-button">
                    <span>
                      {t('common.search')}
                    </span>
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
                    <option value="all">
                      {t('shop.allCategories') || 'All Categories'}
                    </option>
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
                    <option value="createdAt">
                      {t('shop.featured')}
                    </option>
                    <option value="pricing.priceForIndividual">
                      {t('shop.priceLowToHigh') || 'Price: Low to High'}
                    </option>
                    <option value="pricing.priceForIndividual">
                      {t('shop.priceHighToLow') || 'Price: High to Low'}
                    </option>
                    <option value="createdAt">
                      {t('shop.newest')}
                    </option>
                    <option value="productReviews.averageReviewRating">
                      {t('shop.highestRated')}
                    </option>
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
                      <strong>
                        {t('shop.searchResults')}:
                      </strong>{' '}
                      <span>
                        {t('shop.foundResults', { count: searchInfo.totalResults, query: searchInfo.query }) || `Found ${searchInfo.totalResults} product${searchInfo.totalResults !== 1 ? 's' : ''} for "${searchInfo.query}"`}
                      </span>
                      {searchInfo.searchType === 'product_code' && (
                        <span className="ms-2 badge bg-primary">
                          {t('shop.productCodeSearch') || 'Product Code Search'}
                        </span>
                      )}
                      {searchInfo.searchType === 'general' && (
                        <span className="ms-2 badge bg-secondary">
                          {t('shop.generalSearch') || 'General Search'}
                        </span>
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
                      <span>
                        {t('shop.clearSearch') || 'Clear Search'}
                      </span>
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
              <p className="mt-3">
                {t('shop.loadingProducts') || 'Loading products...'}
              </p>
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
                            {t('shop.bestSelling') || 'Best Selling'}
                          </div>
                        )}
                        {product.premiumProduct && (
                          <div className="premium-badge">
                            {t('shop.premium') || 'Premium'}
                          </div>
                        )}
                      </div>
                      
                      <Card.Body className="product-content">
                        <h5 className="product-name">{product.productName}</h5>
                        <p className="product-short-title">{product.productShortTitle}</p>
                        <p className="product-price">
                          £{getBasePriceForUser(product.pricing, user) || 'N/A'}
                          {getDiscountedPriceForUser(product.pricing, user) && (
                            <span className="discounted-price">
                              £{getDiscountedPriceForUser(product.pricing, user)}
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
                              {t('product.shopNow')}
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
              <h4>{t('shop.noProducts')}</h4>
              <p>{t('shop.tryAdjusting') || 'Try adjusting your search or filter criteria'}</p>
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
                {t('shop.loadMore')}
              </Button>
            </div>
          )}

          {/* Loading More Spinner */}
          {loading && currentPage > 1 && (
            <div className="text-center py-3">
              <Spinner animation="border" variant="primary" size="sm" />
              <span className="ms-2">{t('shop.loadingMore') || 'Loading more products...'}</span>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}

export default Shop
