import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './StylesSection.css'
import image from '../assets/images/Frame 871.png'

const StylesSection = () => {
  const [activeTab, setActiveTab] = useState(0)

  const steps = [
    {
      number: "1",
      title: "Selecting Your Perfect Base",
      description: "Carefully select your perfect balance of style, comfort, and a natural look.",
      image: image,
      mainTitle: "Selecting Your Perfect Base",
      mainDescription: "Carefully select your perfect balance of style, comfort, and a natural look."
    },
    {
      number: "2", 
      title: "Customizing Your Style",
      description: "Personalize your hair system to match your unique preferences and lifestyle needs.",
      image: image,
      mainTitle: "Customizing Your Style",
      mainDescription: "Personalize your hair system to match your unique preferences and lifestyle needs."
    },
    {
      number: "3",
      title: "Professional Installation", 
      description: "Get expert guidance and professional installation for the perfect fit and natural look.",
      image: image,
      mainTitle: "Professional Installation",
      mainDescription: "Get expert guidance and professional installation for the perfect fit and natural look."
    }
  ]

  return (
    <div className="styles-section">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title">Styles That Redefine Confidence</h2>
          <p className="section-subtitle">
            Explore Our Most Sought After Hair Systems, To Give You The Perfect Balance Of Style, Comfort, And A Natural Look.
          </p>
        </div>
        
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="steps-container">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`step-item ${activeTab === index ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  <div className="step-number">{step.number}</div>
                  <div className="step-content">
                    <div className="step-image">
                      <img 
                        src={step.image} 
                        alt={`Step ${step.number}`}
                        className="img-fluid"
                      />
                    </div>
                    <div className="step-text">
                      <h4 className="step-title">{step.title}</h4>
                      <p className="step-description">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          
          <Col lg={6}>
            <div className="main-content">
              <div className="main-image-container">
                <img 
                  src={steps[activeTab].image} 
                  alt="Hair Systems Selection"
                  className="img-fluid main-image"
                />
                <div className="play-button">
                  <div className="play-icon">▶</div>
                </div>
              </div>
              <div className="main-text">
                <h4 className="main-title">{steps[activeTab].mainTitle}</h4>
                <p className="main-description">
                  {steps[activeTab].mainDescription}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default StylesSection
