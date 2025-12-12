import React, { useState } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import Banner from '../components/Banner'
import Newsletter from '../components/Newsletter'
import { useNavigate } from 'react-router-dom'
import './CustomHairSystem.css'

const CustomHairSystem = () => {
  // Modal state for template selection
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const navigate = useNavigate()
  // Template size options
  const templateOptions = [
    {
      id: 'partial',
      name: 'Partial',
      description: '(size ≤ 7"x10", or area ≤ 70 square inches)',
      price: 0,
      image: '/src/assets/images/template-partial.png' // Placeholder - will be replaced later
    },
    {
      id: 'regular',
      name: 'Regular',
      description: '(7"x10" < size ≤ 8"x10", or 70 square inches < area ≤ 80 square inches)',
      price: 40,
      image: '/src/assets/images/template-regular.png' // Placeholder - will be replaced later
    },
    {
      id: 'oversize',
      name: 'Oversize',
      description: '(8"x10" < size ≤ 10"x10", or 80 square inches < area ≤ 100 square inches)',
      price: 90,
      image: '/src/assets/images/template-oversize.png' // Placeholder - will be replaced later
    },
    {
      id: 'fullcap',
      name: 'Full cap',
      description: '(size > 10"x10", or area > 100 square inches)',
      price: 150,
      image: '/src/assets/images/template-fullcap.png' // Placeholder - will be replaced later
    }
  ]





   // Handle product click
   const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  const features = [
    {
      title: 'Easy One-Click Ordering',
      description: 'Production starts immediately after payment—no confirmations, no emails, no salon visits.',
      image: '/src/assets/images/Frame_97.png'
    },
    {
      title: 'Designed for the Perfect Fit',
      description: 'Diverse options to suit all ethnicities, hair textures, and lifestyles.',
      image: '/src/assets/images/Frame_2147226869.png'
    },
    {
      title: 'Fast and Reliable Rush Service',
      description: 'Get your order faster with our expedited processing and delivery options.',
      image: '/src/assets/images/Frame_97_(1).png'
    },
    {
      title: 'Exquisite Hand-Knotted Artistry',
      description: 'Each piece is expertly hand-knotted by artisans with 10+ years of experience.',
      image: '/src/assets/images/Frame_97_(1).png'
    }
  ]
   // route to customize hair system
   const routeToCustomizeHairSystem = () => {
    navigate(`/hair-customization`)
  }

  return (
    <div className="custom-hair-system-page">
      
      {/* Hero Section */}
      <Banner 
        badge="Custom Hair System"
        title="Make Your Custom Hair System"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis."
        backgroundImage="/src/assets/images/scandinavian-interior-mockup-wall-decal-background_2.png"
      />

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Our Custom Hair Systems Features</h2>
            <p className="section-subtitle">
              Explore Our Most Bought After Hair Systems, Carefully Selected To Give You The Perfect Balance Of Style, Comfort, And A Natural Look
            </p>
          </div>
          
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} lg={3} key={index}>
                <div className="feature-card">
                  <div className="feature-icon">
                    <img src={feature.image} alt={feature.title} />
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">
                    {feature.description}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Design Section */}
      <section className="design-section">
        <Container>
          <div className="design-banner">
            <Row className="align-items-center">
              <Col lg={6}>
                <div className="design-content">
                  <h2 className="design-title">Design Your Ideal Hair System</h2>
                  <p className="design-description">
                    Over 16 customizable features to ensure a perfect hair system with custom bases, diverse hair textures, and accurate color matching.
                  </p>
                  <Button variant="primary" size="lg" className="design-btn" onClick={() => routeToCustomizeHairSystem()}>
                    CREATE YOUR CUSTOM HAIR SYSTEM
                  </Button>
                </div>
              </Col>
              <Col lg={6}>
                <div className="design-image">
                  <img src="/src/assets/images/Frame_97_(2).png" alt="Hair System Design" />
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* Before After Section */}
      <section className="before-after-section">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Our Custom Hair Systems Features</h2>
            <p className="section-subtitle">
              Explore Our Most Bought After Hair Systems, Carefully Selected To Give You The Perfect Balance Of Style, Comfort, And A Natural Look
            </p>
          </div>
          
          <Row className="g-4">
            <Col md={6} lg={4}>
              <div className="before-after-card">
                <img src="/src/assets/images/Frame_2147226906.png" alt="Hair System Result" />
              </div>
            </Col>
            
            <Col md={6} lg={4}>
              <div className="before-after-card">
                <img src="/src/assets/images/Frame_2147226906.png" alt="Hair System Result" />
              </div>
            </Col>
            
            <Col md={6} lg={4}>
              <div className="before-after-card">
                <img src="/src/assets/images/Frame_2147226906.png" alt="Hair System Result" />
              </div>
            </Col>
            
            <Col md={6} lg={4}>
              <div className="before-after-card">
                <img src="/src/assets/images/Frame_2147226906.png" alt="Hair System Result" />
              </div>
            </Col>
            
            <Col md={6} lg={4}>
              <div className="before-after-card">
                <img src="/src/assets/images/Frame_2147226906.png" alt="Hair System Result" />
              </div>
            </Col>
            
            <Col md={6} lg={4}>
              <div className="before-after-card">
                <img src="/src/assets/images/Frame_2147226906.png" alt="Hair System Result" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

       
    </div>
  )
}

export default CustomHairSystem
