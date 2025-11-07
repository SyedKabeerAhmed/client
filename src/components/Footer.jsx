import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <div className="footer-content">
          <Row>
            {/* Brand Section */}
            <Col lg={4} md={6} className="footer-brand-section">
              <h2 className="footer-brand">Hair Store</h2>
              <p className="footer-description">
                we turn ideas into powerful digital solutions. innovative software to reliable IT support, 
                we help businesses in a connected world.
              </p>
              <Link to="/contact" className="contact-btn">
                Contact Us
              </Link>
            </Col>

            {/* Categories */}
            <Col lg={2} md={6} className="footer-links-section">
              <h3 className="footer-heading">Categories</h3>
              <ul className="footer-links">
                <li><Link to="/shop">Mono Hair System</Link></li>
                <li><Link to="/shop">Mono Hair System</Link></li>
                <li><Link to="/shop">Mono Hair System</Link></li>
                <li><Link to="/shop">Mono Hair System</Link></li>
              </ul>
            </Col>

            {/* Hair Systems */}
            <Col lg={2} md={6} className="footer-links-section">
              <h3 className="footer-heading">Hair Systems</h3>
              <ul className="footer-links">
                <li><Link to="/accessories">Accessories</Link></li>
              </ul>
            </Col>

            {/* Quick Links Column 1 */}
            <Col lg={2} md={6} className="footer-links-section">
              <h3 className="footer-heading">Custom Hair System</h3>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
              </ul>
              <h3 className="footer-heading mt-4">Beginners Guide</h3>
            </Col>

            {/* Quick Links Column 2 */}
            <Col lg={2} md={6} className="footer-links-section">
              <h3 className="footer-heading">Help</h3>
            </Col>
          </Row>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <Link to="/terms" className="footer-bottom-link">Terms & Conditions</Link>
            <span className="footer-copyright">© 2025. All rights reserved.</span>
            <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

