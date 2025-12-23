import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AuthPages.css'
import { authService } from '../services/authService'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Get email and OTP from localStorage
    const storedEmail = localStorage.getItem('resetEmail')
    const storedOTP = localStorage.getItem('resetOTP')
    
    if (!storedEmail || !storedOTP) {
      // If no email or OTP found, redirect to forgot password
      navigate('/forgot-password')
    } else {
      setEmail(storedEmail)
    }
  }, [navigate])

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      setIsLoading(false)
      return
    }

    try {
      const otp = localStorage.getItem('resetOTP')
      const response = await authService.resetPassword({
        email: email,
        otp: otp,
        newPassword: formData.password
      })

      if (response.success) {
        // Clear stored data
        localStorage.removeItem('resetEmail')
        localStorage.removeItem('resetOTP')
        // Redirect to login page
        navigate('/login')
      }
    } catch (error) {
      setError(error.message || 'Password reset failed. Please try again.')
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
                <p className="overlay-text">
                  Sign in to your account to discover exclusive deals and manage your orders.
                </p>
                <p className="overlay-author">-- Mathew</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="form-container">
            <div className="form-header">
              <Link to="/otp-verification" className="back-arrow">←</Link>
              <h1
                className="form-title"
               
              >
                Reset Password
              </h1>
            </div>
            
            <p
              className="form-description"
             
            >
              Enter your new password below. Make sure it's strong and secure.
            </p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span>
                    New Password
                  </span>{' '}
                  <span className="required">*</span>
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Please enter your new password"
                    className="form-input password-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <span>
                    Confirm Password
                  </span>{' '}
                  <span className="required">*</span>
                </label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Please confirm your new password"
                    className="form-input password-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-button" disabled={isLoading}>
                <span>
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
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

export default ResetPassword
