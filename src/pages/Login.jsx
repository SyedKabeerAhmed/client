import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './AuthPages.css'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    try {
      await login({
        email: formData.email,
        password: formData.password
      })
      
      // Redirect to home page
      navigate('/')
    } catch (error) {
      setError(error.message || t('auth.loginFailed'))
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
                {t('auth.signIn')}
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
                  {isLoading ? t('auth.signingIn') : t('auth.signInButton')}
                </span>
              </button>
            </form>

            <div className="form-footer">
              <p className="footer-text">
                <span>
                  {t('auth.dontHaveAccount')}
                </span>{' '}
                <Link
                  to="/signup"
                  className="footer-link"
                >
                  {t('auth.register')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
