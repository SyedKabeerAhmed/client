import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './ProductSection.css'

const ProductSection = ({ 
  title, 
  subtitle, 
  products, 
  showRatings = false,
  showPrice = false,
  buttonText = "SHOP NOW",
  beginnersGuide,

}) => {
  return (
    <div className="product-section">
      <Container>
        <div className="product-section-header text-center mb-5">
          <h2 className="product-section-title">{title}</h2>
          <p className="product-section-subtitle">{subtitle}</p>
        </div>
        
        <Row className="g-4">
          {products.map((product, index) => (
            <Col lg={4} md={6} key={index}>
              <div className="product-section-card">
                <div className="product-section-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="img-fluid"
                  />
                </div>
                <div className="product-section-content">
                  <h4 className="product-section-name">{product.name}</h4>
                  <p className="product-section-category">{product.category}</p>
                  
                  {product.description && (
                    <p className="product-section-description">{product.description}</p>
                  )}
                  
                  {showPrice && (
                    <div className="product-section-price">{product.price}</div>
                  )}
                  
                  {showRatings && product.ratings && (
                    <div className="product-section-ratings">
                      {Object.entries(product.ratings).map(([key, rating]) => (
                        <div key={key} className="product-section-rating-item">
                          <span className="product-section-rating-label">{key}:</span>
                          <div className="product-section-rating-stars">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`product-section-rating-star ${i < rating ? 'filled' : ''}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button className="product-section-button">
                    {product.buttonText || buttonText}
                    {!beginnersGuide && (
                      <span className="product-section-button-arrow">↗</span>
                    )}
                   
                  </button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default ProductSection
