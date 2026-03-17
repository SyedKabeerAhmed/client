import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTimes, faCreditCard, faLock } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../services/orderService'
import { cartService } from '../services/cartService'
import { installmentService } from '../services/installmentService'
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
  const [installmentMonths, setInstallmentMonths] = useState(12) // Default 12 months
  const [couponCode, setCouponCode] = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountError, setDiscountError] = useState('')
  const [discountSuccess, setDiscountSuccess] = useState('')
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [formErrors, setFormErrors] = useState({})

  // Simulated Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/26',
    cvc: '123',
    nameOnCard: user?.fullName || ''
  })
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

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
      // Prepare shipping address
      const shippingAddress = {
        fullName: formData.firstName,
        address: formData.streetAddress,
        city: formData.townCity,
        state: formData.townCity,
        zipCode: '00000',
        country: formData.country || 'United States',
        phoneNumber: formData.phoneNumber
      }

      if (paymentMethod === 'installment') {
        setShowPaymentModal(true)
        return
      }

      setOrderLoading(true)
      setOrderError('')

      // Prepare order data
      const orderData = {
        shippingAddress,
        paymentMethod,
        notes: formData.apartment ? `Apartment/Floor: ${formData.apartment}` : ''
      }
      const response = await orderService.createOrder(orderData)

      if (response.success) {
        navigate('/dashboard?tab=orders')
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

  const handleMockPaymentSubmit = async (e) => {
    e.preventDefault()
    setIsProcessingPayment(true)
    setOrderError('')

    try {
      // Prepare shipping address
      const shippingAddress = {
        fullName: formData.firstName,
        address: formData.streetAddress,
        city: formData.townCity,
        state: formData.townCity,
        zipCode: '00000',
        country: formData.country || 'United States',
        phoneNumber: formData.phoneNumber
      }

      const installmentData = {
        items: cart.items.map(item => {
          // Robust mapping: handle populated object or plain ID string
          const prodObj = typeof item.product === 'object' ? item.product : null;
          const prodId = prodObj?._id || (typeof item.product === 'string' ? item.product : item.productId);

          // Final fallback to ensure validation doesn't fail on backend
          const resolvedProductId = prodId || (item.isCustomHairSystem ? '507f1f77bcf86cd799439011' : '000000000000000000000000');

          return {
            ...item,
            product: resolvedProductId,
            productName: prodObj?.productName || item.product?.productName || item.productName || (item.isCustomHairSystem ? 'Custom Hair System' : 'Regular Product'),
            productCode: prodObj?.productDetails?.productCode || item.product?.productDetails?.productCode || item.productCode || (item.isCustomHairSystem ? 'CHS-CUSTOM' : 'SKU-GEN'),
            unitPrice: item.unitPrice || item.itemPrice || (item.totalPrice / (item.quantity || 1)) || 0,
            totalPrice: item.totalPrice,
            quantity: item.quantity
          };
        }),
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod: 'installment',
        totalInstallments: installmentMonths,
        totalAmount: cart.total
      }

      // 1. Create the plan
      const response = await installmentService.createInstallmentOrder(installmentData)

      if (response.success) {
        // 2. Automatically record the 1st payment to simulate "Initial Payment during checkout"
        const planId = response.data.plan._id
        const firstPaymentAmount = response.data.plan.installmentAmount

        await installmentService.recordPayment({
          planId,
          amount: firstPaymentAmount
        })

        setShowPaymentModal(false)
        navigate('/dashboard?tab=orders')
      } else {
        setOrderError(response.message || 'Failed to create installment plan')
        setShowPaymentModal(false)
      }
    } catch (error) {
      console.error('Payment Simulation Error:', error)
      setOrderError(error.message || 'Payment failed. Please try again.')
      setShowPaymentModal(false)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const renderPaymentModal = () => (
    <Modal show={showPaymentModal} onHide={() => !isProcessingPayment && setShowPaymentModal(false)} centered>
      <Modal.Header closeButton={!isProcessingPayment}>
        <Modal.Title>Complete Initial Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="payment-simulation-box p-3">
          <Alert variant="info" className="mb-4">
            <FontAwesomeIcon icon={faLock} className="me-2" />
            This is a <strong>simulated payment</strong> for development purposes. Total Due Now: <strong>{formatPrice(cart.total / installmentMonths)}</strong>
          </Alert>

          <Form onSubmit={handleMockPaymentSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name on Card</Form.Label>
              <Form.Control
                type="text"
                value={paymentData.nameOnCard}
                onChange={(e) => setPaymentData({ ...paymentData, nameOnCard: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  required
                />
                <FontAwesomeIcon icon={faCreditCard} className="position-absolute" style={{ right: '10px', top: '12px', color: '#666' }} />
              </div>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MM/YY"
                    value={paymentData.expiry}
                    onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>CVC</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123"
                    value={paymentData.cvc}
                    onChange={(e) => setPaymentData({ ...paymentData, cvc: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="primary"
              type="submit"
              className="w-100 py-2 mt-3"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? <Spinner animation="border" size="sm" /> : `Pay ${formatPrice(cart.total / installmentMonths)}`}
            </Button>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  )

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
            <span>
              Your cart is empty.
            </span>{' '}
            <a href="/cart">
              Return to cart
            </a>
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
                <a href="/">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a href="/cart">
                  Cart
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <span>
                  Checkout
                </span>
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
                <h2
                  className="billing-title"

                >
                  Billing Details
                </h2>

                <Form onSubmit={handlePlaceOrder}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span>
                        First Name
                      </span>{' '}
                      <span className="required">*</span>
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
                    <Form.Label>
                      Company Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span>
                        Street Address
                      </span>{' '}
                      <span className="required">*</span>
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
                    <Form.Label>
                      Apartment, floor, etc. (optional)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span>
                        Town/City
                      </span>{' '}
                      <span className="required">*</span>
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
                      <span>
                        Phone Number
                      </span>{' '}
                      <span className="required">*</span>
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
                      <span>
                        Email Address
                      </span>{' '}
                      <span className="required">*</span>
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
                <h5
                  className="order-summary-title"

                >
                  Order Summary
                </h5>

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
                    <span>
                      Subtotal:
                    </span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="cost-row">
                    <span>
                      Shipping:
                    </span>
                    <span>{formatPrice(cart.shipping)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="cost-row discount">
                      <span>
                        Discount:
                      </span>
                      <span>-{formatPrice(cart.discount)}</span>
                    </div>
                  )}
                  <div className="cost-row total">
                    <span>
                      Total:
                    </span>
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

                {/* Installment Option for All Users */}
                {user && (
                  <div className={`payment-option-item ${paymentMethod === 'installment' ? 'selected' : ''}`} style={{ marginTop: '1rem', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      id="installment-plan"
                      label={
                        <span>
                          Installment Plan <span style={{ fontSize: '0.8em', color: '#666' }}>(Release per payment)</span>
                        </span>
                      }
                      value="installment"
                      checked={paymentMethod === 'installment'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="payment-radio"
                    />

                    {paymentMethod === 'installment' && (
                      <div className="installment-details mt-3 ms-4">
                        <Form.Label>Select Duration:</Form.Label>
                        <Form.Select
                          value={installmentMonths}
                          onChange={(e) => setInstallmentMonths(parseInt(e.target.value))}
                          className="mb-2"
                        >
                          <option value="2">2 Months</option>
                          <option value="4">4 Months</option>
                          <option value="8">8 Months</option>
                          <option value="12">12 Months</option>
                        </Form.Select>
                        <div className="installment-summary p-2 bg-light rounded">
                          <small>
                            Monthly Payment: <strong>{formatPrice(cart.total / installmentMonths)}</strong>
                            <br />
                            Total Payments: {installmentMonths}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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
                      <span>
                        Placing Order...
                      </span>
                    </>
                  ) : (
                    <span>
                      Place Order
                    </span>
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
      {renderPaymentModal()}
    </div>
  )
}

export default Checkout

