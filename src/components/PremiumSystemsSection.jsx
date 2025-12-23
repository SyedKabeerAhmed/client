import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import './PremiumSystemsSection.css'

const PremiumSystemsSection = ({ 
  title,
  subtitle,
  products = []
}) => {
  const { t } = useTranslation()
  return (
    <div className="premium-systems-section">
      <Container>
        <div className="premium-section-header text-center mb-5">
          <h2 className="premium-section-title">
            {title || t('home.premiumSystems.title')}
          </h2>
          <p className="premium-section-subtitle">
            {subtitle || t('home.premiumSystems.subtitle')}
          </p>
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
                    <span className="premium-button-arrow" alt={product.buttonText || "Explore"}>↗</span>
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
