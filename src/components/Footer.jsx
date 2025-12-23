import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Footer.css'

const Footer = () => {
  const { t } = useTranslation()
  
  return (
    <footer className="footer">
      <Container>
        <div className="footer-content">
          <Row>
            {/* Brand Section */}
            <Col lg={4} md={6} className="footer-brand-section">
              <h2 className="footer-brand">
                {t('nav.brand')}
              </h2>
              <p className="footer-description">
                {t('footer.description')}
              </p>
              <Link
                to="/contact"
                className="contact-btn"
              >
                {t('footer.contactUs')}
              </Link>
            </Col>

            {/* Categories */}
            <Col lg={2} md={6} className="footer-links-section">
              <h3 className="footer-heading">
                {t('footer.categories')}
              </h3>
              <ul className="footer-links">
                <li>
                  <Link to="/shop">
                    Mono Hair System
                  </Link>
                </li>
                <li>
                  <Link to="/shop">
                    Mono Hair System
                  </Link>
                </li>
                <li>
                  <Link to="/shop">
                    Mono Hair System
                  </Link>
                </li>
                <li>
                  <Link to="/shop">
                    Mono Hair System
                  </Link>
                </li>
              </ul>
            </Col>

            {/* Hair Systems */}
            <Col lg={2} md={6} className="footer-links-section">
              <h3 className="footer-heading">
                {t('footer.hairSystems')}
              </h3>
              <ul className="footer-links">
                <li>
                  <Link to="/accessories">
                    {t('nav.accessories')}
                  </Link>
                </li>
              </ul>
            </Col>

            {/* Quick Links Column 1 */}
            <Col lg={2} md={6} className="footer-links-section">
              <h3 className="footer-heading">
                {t('footer.customHairSystem')}
              </h3>
              <ul className="footer-links">
                <li>
                  <Link to="/about">
                    {t('nav.aboutUs')}
                  </Link>
                </li>
              </ul>
              <h3 className="footer-heading mt-4">
                {t('footer.beginnersGuide')}
              </h3>
            </Col>

            {/* Quick Links Column 2 */}
            <Col lg={2} md={6} className="footer-links-section">
              <h3 className="footer-heading">
                {t('footer.help')}
              </h3>
            </Col>
          </Row>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <Link
              to="/terms"
              className="footer-bottom-link"
            >
              {t('footer.termsAndConditions')}
            </Link>
            <span className="footer-copyright">
              {t('footer.copyright')}
            </span>
            <Link
              to="/privacy"
              className="footer-bottom-link"
            >
              {t('footer.privacyPolicy')}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

