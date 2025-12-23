import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AuthPages.css'
import { authService } from '../services/authService'

const OTPVerification = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('resetEmail')
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // If no email found, redirect to forgot password
      navigate('/forgot-password')
    }
  }, [navigate])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Clear error when user starts typing
    if (error) setError('')

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Store OTP for reset password page
      localStorage.setItem('resetOTP', otpCode)
      // Redirect to reset password page
      navigate('/reset-password')
    } catch (error) {
      setError(error.message || 'OTP verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    setError('')

    try {
      await authService.forgotPassword(email)
      setOtp(['', '', '', '', '', ''])
      // Focus first input
      const firstInput = document.getElementById('otp-0')
      if (firstInput) firstInput.focus()
    } catch (error) {
      setError(error.message || 'Failed to resend OTP. Please try again.')
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
              <Link to="/forgot-password" className="back-arrow">←</Link>
              <h1
                className="form-title"
               
              >
                Verify OTP
              </h1>
            </div>
            
            <p className="form-description">
              <span>
                We've sent a 6-digit verification code to
              </span>{' '}
              <strong>{email}</strong>
              <span>
                . Please enter the code below.
              </span>
            </p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">
                  <span>
                    Verification Code
                  </span>{' '}
                  <span className="required">*</span>
                </label>
                <div className="otp-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="otp-input"
                      maxLength="1"
                      required
                    />
                  ))}
                </div>
              </div>

              <button type="submit" className="auth-button" disabled={isLoading}>
                <span>
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </span>
              </button>
            </form>

            <div className="form-footer">
              <p className="footer-text">
                <span>
                  Didn't receive the code?
                </span>{' '}
                <button
                  onClick={handleResend}
                  className="footer-link"
                  disabled={isLoading}
                 
                >
                  {isLoading ? 'Sending...' : 'Resend Code'}
                </button>
              </p>
              <p className="footer-text">
                <Link
                  to="/login"
                  className="footer-link"
                 
                >
                  Back to Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
