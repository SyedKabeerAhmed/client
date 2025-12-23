import React, { useState, useRef, useEffect } from 'react'
import { Navbar, Nav, Container, NavDropdown, Row, Col } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import LanguageSwitcher from './LanguageSwitcher'
import './Navigation.css'

const Navigation = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { itemCount, loading } = useCart()
  const dropdownRef = useRef(null)

  // Check if we're on a dashboard route
  const isDashboardRoute = 
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin/dashboard') ||
    location.pathname.startsWith('/subadmin/dashboard') ||
    location.pathname.startsWith('/factory/dashboard')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen)
  }

  return (
    <div className="navigation-wrapper">
      <Container>
        {/* Top Row - Logo, Language/Currency, Login */}
        <Row className="top-row align-items-center">
          <Col xs={4} className="text-start">
            <div className="language-currency">
              <div className="language-selector me-3">
                <LanguageSwitcher />
              </div>
              <div className="currency-selector">
                <span className="currency-icon">$</span>
                <span className="currency-text">
                  {t('common.usd')}
                </span>
              </div>
            </div>
          </Col>
          <Col xs={4}>
            <div className="brand">
              <Link to="/" className="brand-link">
                <span className="brand-text">
                  {t('nav.brand')}
                </span>
              </Link>
            </div>
          </Col>
              <Col xs={4} className="text-end">
                <div className="user-actions">
                  {/* Hide cart in dashboard routes */}
                  {!isDashboardRoute && (
                    <Link to="/cart" className="shopping-cart me-3">
                      <FontAwesomeIcon icon={faShoppingCart} />
                      {loading ? (
                        <span className="cart-loading"></span>
                      ) : itemCount > 0 ? (
                        <span className="cart-count">{itemCount}</span>
                      ) : null}
                    </Link>
                  )}
                  
                  {isAuthenticated ? (
                    <div className="user-dropdown-container" ref={dropdownRef}>
                      <div className="user-toggle" onClick={toggleDropdown}>
                        <div className="user-info">
                          <div className="user-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <span className="user-name">{user?.fullName || 'User'}</span>
                          <i className={`fas fa-chevron-${userDropdownOpen ? 'up' : 'down'} dropdown-arrow`}></i>
                        </div>
                      </div>
                      
                      {userDropdownOpen && (
                        <div className="user-dropdown-menu">
                          <Link to="/dashboard" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                            <i className="fas fa-tachometer-alt me-2"></i>
                            <span>
                              {t('common.dashboard')}
                            </span>
                          </Link>
                          <Link to="/profile" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                            <i className="fas fa-user-cog me-2"></i>
                            <span>
                              {t('common.manageAccount')}
                            </span>
                          </Link>
                          <div className="dropdown-divider"></div>
                          <button onClick={() => { logout(); setUserDropdownOpen(false); }} className="dropdown-item logout-item">
                            <i className="fas fa-sign-out-alt me-2"></i>
                            <span>
                              {t('common.logout')}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="login-register"
                    >
                      {t('common.loginRegister')}
                    </Link>
                  )}
                </div>
              </Col>
        </Row>
        
        {/* Bottom Row - Navigation Menu */}
        <Row>
          <Col>
            <Navbar expand="lg" className="custom-navbar" expanded={expanded}>
              <Navbar.Toggle 
                aria-controls="basic-navbar-nav" 
                onClick={() => setExpanded(expanded ? false : true)}
                className="custom-toggler"
              />
              
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto">
                      <NavDropdown
                        title={<span>{t('nav.hairSystems')}</span>}
                        id="hair-systems-dropdown"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="/shop?category=hair-systems"
                        >
                          {t('nav.allHairSystems')}
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                          as={Link}
                          to="/shop?category=skin"
                        >
                          {t('nav.skinSystems')}
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={Link}
                          to="/shop?category=lace"
                        >
                          {t('nav.laceSystems')}
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={Link}
                          to="/shop?category=hybrid"
                        >
                          {t('nav.hybridSystems')}
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={Link}
                          to="/shop?category=mono"
                        >
                          {t('nav.monoSystems')}
                        </NavDropdown.Item>
                      </NavDropdown>
                  
                      <NavDropdown
                        title={<span>{t('nav.accessories')}</span>}
                        id="accessories-dropdown"
                      >
                        <NavDropdown.Item
                          as={Link}
                          to="/shop?category=accessories"
                        >
                          {t('nav.allAccessories')}
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                          as={Link}
                          to="/shop?category=adhesive"
                        >
                          {t('nav.adhesives')}
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={Link}
                          to="/shop?category=glue"
                        >
                          {t('nav.glues')}
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={Link}
                          to="/shop?category=tools"
                        >
                          {t('nav.tools')}
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={Link}
                          to="/shop?category=care-products"
                        >
                          {t('nav.careProducts')}
                        </NavDropdown.Item>
                      </NavDropdown>
                  
                      <Nav.Link
                        as={Link}
                        to="/shop"
                      >
                        {t('common.shop')}
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/beginners-guide"
                      >
                        {t('nav.beginnersGuide')}
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/custom-hair-system"
                      >
                        {t('nav.customHairSystem')}
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/about"
                      >
                        {t('nav.aboutUs')}
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/help"
                      >
                        {t('nav.help')}
                      </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Navigation
