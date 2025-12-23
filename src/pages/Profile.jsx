import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import './Profile.css'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    userType: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        userType: user.userType || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await authService.updateProfile({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        userType: formData.userType
      })

      if (response.success) {
        updateUser(response.data.user)
        setSuccess('Profile updated successfully!')
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-content">
        <Container>
          <div className="page-header">
            <h1
              className="page-title"
             
            >
              Manage Account
            </h1>
            <p
              className="page-subtitle"
             
            >
              Update your personal information and account settings
            </p>
          </div>
          
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="profile-card">
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    {error && (
                      <Alert variant="danger" className="mb-4">
                        {error}
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert variant="success" className="mb-4">
                        {success}
                      </Alert>
                    )}

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="disabled-field"
                          />
                          <Form.Text className="text-muted">
                            <span>
                              Email cannot be changed
                            </span>
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Phone Number
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            User Type
                          </Form.Label>
                          <Form.Select
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            required
                          >
                            <option
                              value="consumer"
                             
                            >
                              Consumer
                            </option>
                            <option
                              value="business"
                             
                            >
                              Business
                            </option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="form-actions">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg"
                        disabled={isLoading}
                        className="update-btn"
                      >
                        <span>
                          {isLoading ? 'Updating...' : 'Update Profile'}
                        </span>
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default Profile
