import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './Newsletter.css'

const Newsletter = ({ 
  title = "Join Our Mailing List",
  subtitle = "Sign up to receive inspiration, product updates, and special offers from our team.",
  placeholder = "example@gmail.com",
  buttonText = "Submit"
}) => {
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
      <div className="newsletter-container">
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="newsletter-content">
              <h2 className="newsletter-title">{title}</h2>
              <p className="newsletter-subtitle">{subtitle}</p>
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
                      placeholder={placeholder}
                      className="newsletter-input"
                      required
                    />
                    <button 
                      type="submit" 
                      className="newsletter-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : buttonText}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <p>Thank you for subscribing!</p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Newsletter
