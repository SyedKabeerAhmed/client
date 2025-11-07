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
        <div className="section-header text-center mb-5">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        
        <Row className="g-4">
          {products.map((product, index) => (
            <Col lg={4} md={6} key={index}>
              <div className="product-card">
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="img-fluid"
                  />
                </div>
                <div className="product-content">
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-category">{product.category}</p>
                  
                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}
                  
                  {showPrice && (
                    <div className="product-price">{product.price}</div>
                  )}
                  
                  {showRatings && product.ratings && (
                    <div className="product-ratings">
                      {Object.entries(product.ratings).map(([key, rating]) => (
                        <div key={key} className="rating-item">
                          <span className="rating-label">{key}:</span>
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`star ${i < rating ? 'filled' : ''}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button className="product-button">
                    {product.buttonText || buttonText}
                    {!beginnersGuide && (
                      <span className="button-arrow">↗</span>
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
