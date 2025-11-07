import React, { useState, useRef, useEffect } from 'react'
import { Navbar, Nav, Container, NavDropdown, Row, Col } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import './Navigation.css'

const Navigation = () => {
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
                <span className="flag-icon">🇺🇸</span>
                <span className="language-text">English</span>
              </div>
              <div className="currency-selector">
                <span className="currency-icon">$</span>
                <span className="currency-text">USD</span>
              </div>
            </div>
          </Col>
          <Col xs={4}>
            <div className="brand">
              <Link to="/" className="brand-link">
                <span className="brand-text">Hair Store</span>
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
                            Dashboard
                          </Link>
                          <Link to="/profile" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                            <i className="fas fa-user-cog me-2"></i>
                            Manage Account
                          </Link>
                          <div className="dropdown-divider"></div>
                          <button onClick={() => { logout(); setUserDropdownOpen(false); }} className="dropdown-item logout-item">
                            <i className="fas fa-sign-out-alt me-2"></i>
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to="/login" className="login-register">Login/Register</Link>
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
                      <NavDropdown title="Hair Systems" id="hair-systems-dropdown">
                        <NavDropdown.Item as={Link} to="/shop?category=hair-systems">All Hair Systems</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/shop?category=skin">Skin Systems</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/shop?category=lace">Lace Systems</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/shop?category=hybrid">Hybrid Systems</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/shop?category=mono">Mono Systems</NavDropdown.Item>
                      </NavDropdown>
                  
                      <NavDropdown title="Accessories" id="accessories-dropdown">
                        <NavDropdown.Item as={Link} to="/shop?category=accessories">All Accessories</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/shop?category=adhesive">Adhesives</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/shop?category=glue">Glues</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/shop?category=tools">Tools</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/shop?category=care-products">Care Products</NavDropdown.Item>
                      </NavDropdown>
                  
                      <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
                      <Nav.Link as={Link} to="/beginners-guide">Beginners Guide</Nav.Link>
                      <Nav.Link as={Link} to="/custom-hair-system">Custom Hair System</Nav.Link>
                      <Nav.Link as={Link} to="/about">About Us</Nav.Link>
                      <Nav.Link as={Link} to="/help">Help</Nav.Link>
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
