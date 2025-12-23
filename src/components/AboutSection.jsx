import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './AboutSection.css'

const AboutSection = ({ 
  badge,
  title, 
  description,
  image,
  imageAlt,
  reverse = false
}) => {
  return (
    <div className="about-section">
      <Container>
        <Row className={`align-items-center ${reverse ? 'flex-row-reverse' : ''}`}>
          <Col lg={6}>
            <div className="about-content">
              <div
                className="about-badge"
               
              >
                {badge}
              </div>
              <h2
                className="about-title"
               
              >
                {title}
              </h2>
              <p
                className="about-description"
               
              >
                {description}
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <div className="about-image">
              <img 
                src={image} 
                alt={imageAlt}
                className="img-fluid"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AboutSection
