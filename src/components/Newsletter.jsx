import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import './Newsletter.css'

const Newsletter = ({ 
  title,
  subtitle,
  placeholder,
  buttonText
}) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setEmail('')
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="newsletter-section">
      <Container className="newsletter-container">
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="newsletter-content">
              <h2 className="newsletter-title">
                {title || t('newsletter.title')}
              </h2>
              <p className="newsletter-subtitle">
                {subtitle || t('newsletter.subtitle')}
              </p>
            </div>
          </Col>
          
          <Col lg={6}>
            <div className="newsletter-form-container">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="newsletter-form">
                  <div className="form-group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={placeholder || t('newsletter.placeholder')}
                      className="newsletter-input"
                      required
                    />
                    <button 
                      type="submit" 
                      className="newsletter-button"
                      disabled={isSubmitting}
                    >
                      <span>
                        {isSubmitting ? t('newsletter.submitting') : (buttonText || t('newsletter.buttonText'))}
                      </span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <p>
                    {t('newsletter.thankYou')}
                  </p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Newsletter
