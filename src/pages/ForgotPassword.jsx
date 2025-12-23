import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AuthPages.css'
import { authService } from '../services/authService'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await authService.forgotPassword(formData.email)

      if (response.success) {
        setSuccess(true)
        // Store email for OTP verification
        localStorage.setItem('resetEmail', formData.email)
        // Redirect to OTP page after a short delay
        setTimeout(() => {
          navigate('/otp-verification')
        }, 2000)
      }
    } catch (error) {
      setError(error.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Image */}
        <div className="auth-image-section">
          <div className="image-container">
            <img 
              src="/src/assets/images/Frame_221.png" 
              alt="Barber Shop" 
              className="auth-image"
            />
            <div className="image-overlay">
              <div className="overlay-content">
                <p
                  className="overlay-text"
                 
                >
                  Sign in to your account to discover exclusive deals and manage your orders.
                </p>
                <p
                  className="overlay-author"
                 
                >
                  -- Mathew
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="form-container">
            <div className="form-header">
              <Link to="/login" className="back-arrow">←</Link>
              <h1
                className="form-title"
               
              >
                Forgot Password
              </h1>
            </div>
            
            <p
              className="form-description"
             
            >
              Enter your email address and we'll send you a verification code to reset your password.
            </p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <span>
                  OTP sent successfully! Redirecting to verification page...
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span>
                    Email
                  </span>{' '}
                  <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Please enter your email address"
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="auth-button" disabled={isLoading || success}>
                <span>
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </span>
              </button>
            </form>

            <div className="form-footer">
              <p className="footer-text">
                <span>
                  Remember your password?
                </span>{' '}
                <Link
                  to="/login"
                  className="footer-link"
                 
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
