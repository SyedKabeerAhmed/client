import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './Banner.css'
// import backgroundImage from '../assets/images/scandinavian-interior-mockup-wall-decal-background_2.png'

const Banner = ({ 
  badge,
  title,
  description ,
  backgroundImage,
  imageAlt = "Banner Image"
}) => {
  return (
    <div className="banner-section">
      <div 
        className="banner-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="banner-overlay">
          <Container>
            <Row className="align-items-center min-vh-50">
              <Col lg={6} md={8}>
                <div className="banner-content">
                  <div className="banner-badge">
                    {badge}
                  </div>
                  <h1 className="banner-title">
                    {title}
                  </h1>
                  <p className="banner-description">
                    {description}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  )
}

export default Banner
