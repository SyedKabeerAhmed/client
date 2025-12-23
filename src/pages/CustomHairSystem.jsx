import React, { useState } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import Banner from '../components/Banner'
import Newsletter from '../components/Newsletter'
import { useNavigate } from 'react-router-dom'
import './CustomHairSystem.css'

const CustomHairSystem = () => {
  const { t } = useTranslation()
  // Modal state for template selection
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const navigate = useNavigate()
  // Template size options
  const templateOptions = [
    {
      id: 'partial',
      name: t('customHairSystem.template.partial'),
      description: t('customHairSystem.template.partialDesc'),
      price: 0,
      image: '/src/assets/images/template-partial.png'
    },
    {
      id: 'regular',
      name: t('customHairSystem.template.regular'),
      description: t('customHairSystem.template.regularDesc'),
      price: 40,
      image: '/src/assets/images/template-regular.png'
    },
    {
      id: 'oversize',
      name: t('customHairSystem.template.oversize'),
      description: t('customHairSystem.template.oversizeDesc'),
      price: 90,
      image: '/src/assets/images/template-oversize.png'
    },
    {
      id: 'fullcap',
      name: t('customHairSystem.template.fullcap'),
      description: t('customHairSystem.template.fullcapDesc'),
      price: 150,
      image: '/src/assets/images/template-fullcap.png'
    }
  ]





   // Handle product click
   const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  const features = [
    {
      title: t('customHairSystem.feature1.title'),
      description: t('customHairSystem.feature1.description'),
      image: '/src/assets/images/Frame_97.png'
    },
    {
      title: t('customHairSystem.feature2.title'),
      description: t('customHairSystem.feature2.description'),
      image: '/src/assets/images/Frame_2147226869.png'
    },
    {
      title: t('customHairSystem.feature3.title'),
      description: t('customHairSystem.feature3.description'),
      image: '/src/assets/images/Frame_97_(1).png'
    },
    {
      title: t('customHairSystem.feature4.title'),
      description: t('customHairSystem.feature4.description'),
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
        badge={t('customHairSystem.badge')}
        title={t('customHairSystem.title')}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis."
        backgroundImage="/src/assets/images/scandinavian-interior-mockup-wall-decal-background_2.png"
      />

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="section-title">
              {t('customHairSystem.featuresTitle')}
            </h2>
            <p className="section-subtitle">
              {t('customHairSystem.featuresSubtitle')}
            </p>
          </div>
          
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} lg={3} key={index}>
                <div className="feature-card">
                  <div className="feature-icon">
                    <img src={feature.image} alt={feature.title} />
                  </div>
                  <h4 className="feature-title">
                    {feature.title}
                  </h4>
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
                  <h2 className="design-title">
                    {t('customHairSystem.designTitle')}
                  </h2>
                  <p className="design-description">
                    {t('customHairSystem.designDescription')}
                  </p>
                  <Button variant="primary" size="lg" className="design-btn" onClick={() => routeToCustomizeHairSystem()}>
                    <span>
                      {t('customHairSystem.createButton')}
                    </span>
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
            <h2 className="section-title">
              {t('customHairSystem.beforeAfterTitle')}
            </h2>
            <p className="section-subtitle">
              {t('customHairSystem.beforeAfterSubtitle')}
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
