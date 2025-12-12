import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Navbar, Nav, Container, NavDropdown, Row, Col } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faBell } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import api from '../config/api'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { itemCount, loading } = useCart()
  const dropdownRef = useRef(null)
  const notificationDropdownRef = useRef(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsLoading, setNotificationsLoading] = useState(false)

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
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Determine user role for API endpoint
  const getUserRole = () => {
    if (!user) return null
    if (user.role === 'admin') return 'admin'
    if (user.role === 'subadmin') return 'subadmin'
    if (user.role === 'factory') return 'factory'
    return 'user' // Regular consumer/business user
  }

  // NOTE: Navigation is only used on public website pages (Home, About, Help, Custom Hair, etc.).
  // We intentionally do NOT show notifications here; notifications are handled in the dashboard header only.

  const toggleNotificationDropdown = async () => {
    // No-op: notifications are not shown on website pages
    return
  }

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation()
    
    const userRole = getUserRole()
    if (!userRole) return
    
    try {
      await api.put(`/${userRole}/notifications/${notificationId}/read`)
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      const userRole = getUserRole()
      if (userRole) {
        try {
          await api.put(`/${userRole}/notifications/${notification._id}/read`)
          setNotifications(prev => prev.map(n => 
            n._id === notification._id ? { ...n, isRead: true } : n
          ))
          setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
          console.error('Failed to mark notification as read:', error)
        }
      }
    }

    // Close dropdown
    setNotificationDropdownOpen(false)

    // Navigate if actionUrl exists
    if (notification.actionUrl) {
      if (notification.actionUrl.startsWith('http')) {
        window.open(notification.actionUrl, '_blank')
      } else {
        navigate(notification.actionUrl)
      }
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

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
                  
                  {/* Notification Bell - hidden on website pages; notifications are only in dashboard header */}
                  {false && isAuthenticated && (
                    <div className="notification-wrapper me-3" ref={notificationDropdownRef}>
                      <button 
                        className="notification-btn" 
                        onClick={toggleNotificationDropdown}
                        title="Notifications"
                      >
                        <FontAwesomeIcon icon={faBell} />
                        {unreadCount > 0 && (
                          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                        )}
                      </button>
                      
                      {notificationDropdownOpen && (
                        <div className="notification-dropdown">
                          <div className="notification-dropdown-header">
                            <h3>Notifications</h3>
                            {unreadCount > 0 && (
                              <span className="unread-count">{unreadCount} unread</span>
                            )}
                          </div>
                          
                          <div className="notification-list">
                            {notificationsLoading ? (
                              <div className="notification-loading">Loading...</div>
                            ) : notifications.length === 0 ? (
                              <div className="notification-empty">No notifications</div>
                            ) : (
                              notifications.map((notification) => (
                                <div
                                  key={notification._id}
                                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  <div className="notification-content">
                                    <div className="notification-title">{notification.title}</div>
                                    <div className="notification-message">{notification.message}</div>
                                    <div className="notification-time">{formatTimeAgo(notification.createdAt)}</div>
                                  </div>
                                  {!notification.isRead && (
                                    <button
                                      className="notification-mark-read"
                                      onClick={(e) => handleMarkAsRead(notification._id, e)}
                                      title="Mark as read"
                                    >
                                      <i className="fas fa-circle"></i>
                                    </button>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                          
                          {notifications.length > 0 && (
                            <div className="notification-footer">
                              <button 
                                className="view-all-notifications"
                                onClick={() => {
                                  setNotificationDropdownOpen(false)
                                  navigate('/dashboard')
                                }}
                              >
                                View All
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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
