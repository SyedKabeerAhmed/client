import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      
      <div className="dashboard-content">
        <Container>
          <div className="page-header">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome to your personal dashboard</p>
          </div>
          
          <Row className="g-4">
            <Col lg={4} md={6}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="card-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <h5 className="card-title">Profile</h5>
                  <p className="card-text">Manage your personal information and account settings</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="card-icon">
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <h5 className="card-title">Orders</h5>
                  <p className="card-text">View and track your recent orders</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="card-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                  <h5 className="card-title">Wishlist</h5>
                  <p className="card-text">Your saved items and favorites</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="card-icon">
                    <i className="fas fa-cog"></i>
                  </div>
                  <h5 className="card-title">Settings</h5>
                  <p className="card-text">Account preferences and notifications</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="card-icon">
                    <i className="fas fa-question-circle"></i>
                  </div>
                  <h5 className="card-title">Support</h5>
                  <p className="card-text">Get help and contact support</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} md={6}>
              <Card className="dashboard-card">
                <Card.Body>
                  <div className="card-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <h5 className="card-title">Reviews</h5>
                  <p className="card-text">Leave reviews and ratings</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default Dashboard
