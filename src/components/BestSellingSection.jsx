import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './BestSellingSection.css'

const BestSellingSection = ({ 
  title = "Our Best Selling Hair Systems",
  subtitle = "Discover The Most Trusted And Popular Systems, Chosen By Clients For Their Natural Look, Comfort, And Durability.",
  products = [],
  loading = false
}) => {
  const navigate = useNavigate()

  // Helper function to format price
  const formatPrice = (price) => {
    if (!price) return null
    return `£${price.toFixed(2)}`
  }

  // Helper function to get product image
  const getProductImage = (product) => {
    if (product.productImages && product.productImages.length > 0) {
      return product.productImages[0]
    }
    // Fallback for legacy format
    return product.image || '/src/assets/images/image_108.png'
  }

  // Helper function to get product name
  const getProductName = (product) => {
    return product.productName || product.name || 'Product'
  }

  // Helper function to get category
  const getCategory = (product) => {
    if (product.mainCategory && typeof product.mainCategory === 'object') {
      return product.mainCategory.name || product.subCategory || 'Hair Systems'
    }
    return product.subCategory || product.category || 'Hair Systems'
  }

  // Helper function to get price
  const getPrice = (product) => {
    if (product.pricing?.discountedPriceForIndividual) {
      return formatPrice(product.pricing.discountedPriceForIndividual)
    }
    if (product.pricing?.priceForIndividual) {
      return formatPrice(product.pricing.priceForIndividual)
    }
    return product.price || null
  }

  // Helper function to get description
  const getDescription = (product) => {
    return product.productDescription || product.description || ''
  }

  // Helper function to get ratings (from productBenefits)
  const getRatings = (product) => {
    if (product.productBenefits) {
      return {
        Durability: product.productBenefits.durability || 0,
        Comfort: product.productBenefits.comfort || 0,
        Appearance: product.productBenefits.appearance || 0,
        Maintenance: product.productBenefits.maintenance || 0
      }
    }
    return product.ratings || null
  }

  // Handle product click
  const handleProductClick = (product) => {
    const productId = product._id || product.id
    if (productId) {
      navigate(`/product/${productId}`)
    }
  }

  if (loading) {
    return (
      <div className="best-selling-section">
        <Container>
          <div className="best-selling-section-header text-center mb-5">
            <h2 className="best-selling-section-title">{title}</h2>
            <p className="best-selling-section-subtitle">{subtitle}</p>
          </div>
          <div className="text-center py-5">
            <p>Loading best selling products...</p>
          </div>
        </Container>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="best-selling-section">
      <Container>
        <div className="best-selling-section-header text-center mb-5">
          <h2 className="best-selling-section-title">{title}</h2>
          <p className="best-selling-section-subtitle">{subtitle}</p>
        </div>
        
        <Row className="g-4">
          {products.map((product, index) => {
            const productImage = getProductImage(product)
            const productName = getProductName(product)
            const category = getCategory(product)
            const price = getPrice(product)
            const description = getDescription(product)
            const ratings = getRatings(product)

            return (
              <Col lg={3} md={6} key={product._id || product.id || index}>
                <div className="best-selling-card" onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                  <div className="best-selling-image">
                    <img 
                      src={productImage} 
                      alt={productName}
                      className="img-fluid"
                      onError={(e) => {
                        e.target.src = '/src/assets/images/image_108.png'
                      }}
                    />
                  </div>
                  <div className="best-selling-content">
                    <h4 className="best-selling-name">{productName}</h4>
                    <p className="best-selling-category">{category}</p>
                    
                    {price && (
                      <div className="best-selling-price">{price}</div>
                    )}
                    
                    {description && (
                      <p className="best-selling-description">
                        {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                      </p>
                    )}
                    
                    {ratings && (
                      <div className="best-selling-ratings">
                        {Object.entries(ratings).map(([key, rating]) => (
                          <div key={key} className="best-selling-rating-item">
                            <span className="best-selling-rating-label">{key}:</span>
                            <div className="best-selling-rating-stars">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`best-selling-rating-star ${i < rating ? 'filled' : ''}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <button className="best-selling-button">
                      {product.buttonText || "SHOP NOW"}
                    </button>
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
      </Container>
    </div>
  )
}

export default BestSellingSection
