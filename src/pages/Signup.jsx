import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './AuthPages.css'
import { useAuth } from '../contexts/AuthContext'
import { formatPhoneNumber } from '../utils/phoneFormatter'

const Signup = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    userType: 'Individual User',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'))
      setIsLoading(false)
      return
    }

    // Format phone number using utility function
    const formattedPhoneNumber = formatPhoneNumber(formData.phoneNumber)

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formattedPhoneNumber,
        password: formData.password,
        userType: formData.userType === 'Individual User' ? 'consumer' : 'business'
      })
      
      // Redirect to home page
      navigate('/')
    } catch (error) {
      setError(error.message || t('auth.registrationFailed'))
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
                  {t('auth.signInToAccount')}
                </p>
                <p className="overlay-author">
                  {t('auth.author')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="form-container">
            <div className="form-header">
              <Link to="/" className="back-arrow">←</Link>
              <h1 className="form-title">
                {t('auth.signUp')}
              </h1>
            </div>
            
            <p className="form-description">
              {t('auth.signInToAccount')}
            </p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  <span>
                    {t('auth.fullName')}
                  </span>{' '}
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t('auth.fullNamePlaceholder')}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="userType" className="form-label">
                  <span>
                    {t('auth.userType')}
                  </span>{' '}
                  <span className="required">*</span>
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="Individual User">
                    {t('auth.individualUser')}
                  </option>
                  <option value="Business User">
                    {t('auth.businessUser')}
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span>
                    {t('auth.email')}
                  </span>{' '}
                  <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('auth.emailPlaceholder')}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber" className="form-label">
                  <span>
                    {t('auth.phoneNumber')}
                  </span>{' '}
                  <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={t('auth.phonePlaceholder')}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span>
                    {t('auth.password')}
                  </span>{' '}
                  <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <span>
                    {t('auth.confirmPassword')}
                  </span>{' '}
                  <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-label">
                    {t('auth.rememberMe')}
                  </span>
                </label>
                
                <Link
                  to="/forgot-password"
                  className="forgot-link"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              <button type="submit" className="auth-button" disabled={isLoading}>
                <span>
                  {isLoading ? t('auth.creatingAccount') : t('auth.signUpButton')}
                </span>
              </button>
            </form>

            <div className="form-footer">
              <p className="footer-text">
                <span>
                  {t('auth.alreadyHaveAccount')}
                </span>{' '}
                <Link
                  to="/login"
                  className="footer-link"
                >
                  {t('auth.login')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
