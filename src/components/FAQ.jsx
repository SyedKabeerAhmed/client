import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { lordhairFaqs } from '../data/faqs'
import './FAQ.css'

const FAQ = ({ 
  title,
  subtitle,
  faqs = []
}) => {
  const { t } = useTranslation()
  
  const defaultFAQs = lordhairFaqs

  const [expandedItem, setExpandedItem] = useState(1)
  const displayFAQs = faqs.length > 0 ? faqs : defaultFAQs

  const toggleExpanded = (id) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  return (
    <div className="faq-section">
      <Container>
        <div className="faq-section-header text-center mb-5">
          <h2 className="faq-section-title">
            {title || t('faq.title')}
          </h2>
          <p className="faq-section-subtitle">
            {subtitle || "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Ut Et Massa Mi. Aliquam In Hendrerit Urna."}
          </p>
        </div>
        
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="faq-container">
              {displayFAQs.map((faq, index) => (
                <div key={faq.id} className="faq-item">
                  <div 
                    className={`faq-question ${expandedItem === faq.id ? 'expanded' : ''}`}
                    onClick={() => toggleExpanded(faq.id)}
                  >
                    <div className="question-content">
                      <span className="question-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="question-text">
                        {faq.question}
                      </span>
                    </div>
                    <div className="question-arrow">
                      <span className={`arrow ${expandedItem === faq.id ? 'rotated' : ''}`}>
                        →
                      </span>
                    </div>
                  </div>
                  
                  {expandedItem === faq.id && (
                    <div className="faq-answer">
                      <p>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FAQ
