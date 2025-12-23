import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './TopBar.css'

const TopBar = () => {
  return (
    <div className="top-bar">
      <Container fluid>
        <Row className="align-items-center">
          <Col xs={12} md={8}>
            <div className="promo-text">
              Save Up To $70 With All Hair Systems. Shop Now →
            </div>
          </Col>
          <Col xs={12} md={4} className="text-end">
            <div className="top-bar-actions">
              <span className="shopping-bag me-3">
                <i className="fas fa-shopping-bag"></i>
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default TopBar
