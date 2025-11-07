import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './PremiumSystemsSection.css'

const PremiumSystemsSection = ({ 
  title = "Explore Our Premium Hair Systems",
  subtitle = "Choose The Perfect System Tailored To Your Lifestyle, Comfort, And Natural Look.",
  products = []
}) => {
  return (
    <div className="premium-systems-section">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        
        <Row className="g-4">
          {products.map((product, index) => (
            <Col lg={3} md={6} key={index}>
              <div className="premium-card">
                <div className="premium-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="img-fluid"
                  />
                </div>
                <div className="premium-content-button">
                <div className="premium-content">
                  <h4 className="premium-name">{product.name}</h4>
                  <p className="premium-category">{product.category}</p>
                  </div>
                  <button className="premium-button" >
                    <span className="button-arrow" alt={product.buttonText || "Explore"}>↗</span>
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

export default PremiumSystemsSection
