import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './BestSellingSection.css'

const BestSellingSection = ({ 
  title = "Our Best Selling Hair Systems",
  subtitle = "Discover The Most Trusted And Popular Systems, Chosen By Clients For Their Natural Look, Comfort, And Durability.",
  products = []
}) => {
  return (
    <div className="best-selling-section">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        
        <Row className="g-4">
          {products.map((product, index) => (
            <Col lg={3} md={6} key={index}>
              <div className="best-selling-card">
                <div className="best-selling-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="img-fluid"
                  />
                </div>
                <div className="best-selling-content">
                  <h4 className="best-selling-name">{product.name}</h4>
                  <p className="best-selling-category">{product.category}</p>
                  
                  {product.price && (
                    <div className="best-selling-price">{product.price}</div>
                  )}
                  
                  {product.description && (
                    <p className="best-selling-description">{product.description}</p>
                  )}
                  
                  {product.ratings && (
                    <div className="best-selling-ratings">
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
                  
                  <button className="best-selling-button">
                    {product.buttonText || "SHOP NOW"}
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

export default BestSellingSection
