import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../services/orderService'
import { cartService } from '../services/cartService'
import Newsletter from '../components/Newsletter'
import './Checkout.css'

const Checkout = () => {
  const { cart, loading: cartLoading, applyDiscount, refreshCart, updateCartItem, removeFromCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: user?.fullName?.split(' ')[0] || '',
    companyName: '',
    streetAddress: '',
    apartment: '',
    townCity: '',
    country: 'United States',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
    saveInfo: true
  })
  
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [couponCode, setCouponCode] = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountError, setDiscountError] = useState('')
  const [discountSuccess, setDiscountSuccess] = useState('')
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (cart.items.length === 0 && !cartLoading) {
      navigate('/cart')
    }
  }, [isAuthenticated, cart.items.length, cartLoading, navigate])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    if (!formData.streetAddress.trim()) {
      errors.streetAddress = 'Street address is required'
    }
    if (!formData.townCity.trim()) {
      errors.townCity = 'Town/City is required'
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required'
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number'
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required'
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    try {
      setDiscountLoading(true)
      setDiscountError('')
      await applyDiscount(couponCode.trim())
      setDiscountSuccess('Coupon applied successfully!')
      setCouponCode('')
      await refreshCart()
      setTimeout(() => setDiscountSuccess(''), 3000)
    } catch (error) {
      setDiscountError(error.message)
    } finally {
      setDiscountLoading(false)
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (!paymentMethod) {
      setOrderError('Please select a payment method')
      return
    }

    try {
      setOrderLoading(true)
      setOrderError('')

      // Prepare shipping address
      const shippingAddress = {
        fullName: formData.firstName,
        address: formData.streetAddress,
        city: formData.townCity,
        state: formData.townCity, // Use townCity as state
        zipCode: '00000', // Default zipCode
        country: formData.country || 'United States',
        phoneNumber: formData.phoneNumber
      }

      // Prepare order data
      const orderData = {
        shippingAddress,
        paymentMethod,
        notes: formData.apartment ? `Apartment/Floor: ${formData.apartment}` : ''
      }

      // Create order
      const response = await orderService.createOrder(orderData)
      
      if (response.success) {
        // Redirect to order confirmation or dashboard
        navigate(`/dashboard?order=${response.data.order.orderNumber}`)
      } else {
        setOrderError(response.message || 'Failed to place order')
      }
    } catch (error) {
      console.error('Order error:', error)
      setOrderError(error.message || 'Failed to place order. Please try again.')
    } finally {
      setOrderLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getImagePath = (product) => {
    if (product && product.productImages && product.productImages.length > 0) {
      return `/src/${product.productImages[0]}`
    }
    return '/src/assets/images/image_108.png'
  }

  const getProductDisplayInfo = (item) => {
    // Handle custom hair systems
    if (item.isCustomHairSystem) {
      return {
        type: 'Custom Hair System',
        name: item.customHairSystem?.baseDesign 
          ? `Custom ${item.customHairSystem.baseDesign}` 
          : 'Custom Hair System',
        price: item.itemPrice || item.unitPrice || item.totalPrice
      }
    }
    
    // Handle regular products
    if (item.product) {
      return {
        type: item.product.productShortTitle || item.product.subCategory?.name || 'Hair System',
        name: item.product.productName || 'Hair System',
        price: item.itemPrice || item.unitPrice || item.totalPrice
      }
    }
    
    // Fallback for items without product reference
    return {
      type: 'Hair System',
      name: 'Customized Product',
      price: item.itemPrice || item.unitPrice || item.totalPrice
    }
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await updateCartItem(itemId, newQuantity)
      await refreshCart()
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId)
      await refreshCart()
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  if (!isAuthenticated || cartLoading) {
    return (
      <div className="checkout-page">
        <Container>
          <div className="checkout-loading">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading...</p>
          </div>
        </Container>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <Container>
          <Alert variant="warning">
            Your cart is empty. <a href="/cart">Return to cart</a>
          </Alert>
        </Container>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <Container>
        {/* Breadcrumb */}
        <div className="breadcrumb-section">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/cart">Cart</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Checkout
              </li>
            </ol>
          </nav>
        </div>

        {/* Error Alert */}
        {orderError && (
          <Alert variant="danger" className="mt-3" dismissible onClose={() => setOrderError('')}>
            {orderError}
          </Alert>
        )}

        <Row className="g-4">
          {/* Billing Details Section */}
          <Col lg={7}>
            <Card className="billing-details-card">
              <Card.Body>
                <h2 className="billing-title">Billing Details</h2>
                
                <Form onSubmit={handlePlaceOrder}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      First Name <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.firstName}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Street Address <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.streetAddress}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.streetAddress}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Apartment, floor, etc. (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Town/City <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="townCity"
                      value={formData.townCity}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.townCity}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.townCity}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Phone Number <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.phoneNumber}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.phoneNumber}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Email Address <span className="required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.email}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      label="Save this information for faster check-out next time"
                    />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary Section */}
          <Col lg={5}>
            <Card className="order-summary-card">
              <Card.Body>
                <h5 className="order-summary-title">Order Summary</h5>
                
                {/* Product List */}
                <div className="order-products">
                  {cart.items.map((item) => {
                    const productInfo = getProductDisplayInfo(item)
                    return (
                      <div key={item._id} className="order-product-item">
                        <div className="product-image-wrapper">
                          <img 
                            src={getImagePath(item.product)} 
                            alt={productInfo.name}
                            className="product-image"
                            onError={(e) => {
                              e.target.src = '/src/assets/images/image_108.png'
                            }}
                          />
                        </div>
                        <div className="product-info">
                          <p className="product-type">{productInfo.type}</p>
                          <p className="product-name">{productInfo.name}</p>
                          <p className="product-price">{formatPrice(productInfo.price)}</p>
                        </div>
                      <div className="product-quantity-controls">
                        <div className="quantity-selector">
                          <span className="quantity-value">{item.quantity}</span>
                          <div className="quantity-arrows">
                            <button 
                              type="button"
                              className="quantity-arrow-btn up"
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              disabled={cartLoading}
                              aria-label="Increase quantity"
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                            <button 
                              type="button"
                              className="quantity-arrow-btn down"
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={cartLoading || item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        type="button"
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={cartLoading}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                    )
                  })}
                </div>

                {/* Cost Breakdown */}
                <div className="cost-breakdown">
                  <div className="cost-row">
                    <span>Subtotal:</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="cost-row">
                    <span>Shipping:</span>
                    <span>{formatPrice(cart.shipping)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="cost-row discount">
                      <span>Discount:</span>
                      <span>-{formatPrice(cart.discount)}</span>
                    </div>
                  )}
                  <div className="cost-row total">
                    <span>Total:</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="payment-options">
                  <Form.Group className={`payment-option-item ${paymentMethod === 'card_payment' ? 'selected' : ''}`}>
                    <div className="payment-option-content">
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        id="bank-transfer"
                        label="Bank Transfer"
                        value="card_payment"
                        checked={paymentMethod === 'card_payment'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="payment-radio"
                      />
                      <div className="payment-logos-container">
                        <img 
                          src="/src/assets/images/payment-modes.png" 
                          alt="Payment Methods"
                          className="payment-modes-image"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  </Form.Group>

                  <Form.Group className={`payment-option-item ${paymentMethod === 'cash_on_delivery' ? 'selected' : ''}`}>
                    <div className="payment-option-content">
                      <Form.Check
                        type="radio"
                        name="paymentMethod"
                        id="cash-on-delivery"
                        label="Cash on Delivery"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="payment-radio"
                      />
                    </div>
                  </Form.Group>
                </div>

                {/* Coupon Code */}
                <div className="coupon-section">
                  <Form onSubmit={handleApplyCoupon}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={discountLoading}
                      />
                    </Form.Group>
                    <Button 
                      type="submit" 
                      variant="outline-primary" 
                      className="w-100"
                      disabled={discountLoading || !couponCode.trim()}
                    >
                      {discountLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Applying...
                        </>
                      ) : (
                        'Apply Coupon'
                      )}
                    </Button>
                  </Form>
                  
                  {discountError && (
                    <Alert variant="danger" className="mt-2 mb-0" style={{ fontSize: '0.875rem' }}>
                      {discountError}
                    </Alert>
                  )}
                  
                  {discountSuccess && (
                    <Alert variant="success" className="mt-2 mb-0" style={{ fontSize: '0.875rem' }}>
                      {discountSuccess}
                    </Alert>
                  )}
                </div>

                {/* Place Order Button */}
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="place-order-btn w-100"
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                >
                  {orderLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Email Subscription Section */}
        <div className="newsletter-section-wrapper">
          <Newsletter />
        </div>
      </Container>
    </div>
  )
}

export default Checkout

