import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faMinus, faPlus, faShoppingCart, faArrowLeft, faEye } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Cart.css'

const Cart = () => {
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart, applyDiscount, clearError } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [discountCode, setDiscountCode] = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountError, setDiscountError] = useState('')
  const [discountSuccess, setDiscountSuccess] = useState('')
  const [showCustomizationModal, setShowCustomizationModal] = useState(false)
  const [selectedCustomization, setSelectedCustomization] = useState(null)

  useEffect(() => {
    clearError()
  }, [])

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const handleApplyDiscount = async (e) => {
    e.preventDefault()
    if (!discountCode.trim()) return

    try {
      setDiscountLoading(true)
      setDiscountError('')
      await applyDiscount(discountCode.trim())
      setDiscountSuccess('Discount applied successfully!')
      setDiscountCode('')
      setTimeout(() => setDiscountSuccess(''), 3000)
    } catch (error) {
      setDiscountError(error.message)
    } finally {
      setDiscountLoading(false)
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart()
      } catch (error) {
        console.error('Failed to clear cart:', error)
      }
    }
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  const handleViewCustomization = (item) => {
    setSelectedCustomization(item)
    setShowCustomizationModal(true)
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
    // Default image for custom hair systems or when product is null
    return '/src/assets/images/image_108.png'
  }

  const getColorImagePath = (selectedColor) => {
    if (selectedColor?.colorImage) {
      return `/src/assets/images/Hair_Color/all_colors/${selectedColor.colorImage}`
    }
    return null
  }

  const getHaircutImagePath = (selectedHairCut) => {
    if (selectedHairCut?.hairCutImage) {
      if (selectedHairCut.hairCutCode === 'CUSTOM_LENGTH') {
        return '/src/assets/images/image_108.png'
      } else if (selectedHairCut.hairCutCode === 'CUSTOM_IMAGE') {
        return '/src/assets/images/image_108.png'
      } else {
        return `/src/assets/images/Haircut_Images/${selectedHairCut.hairCutCode}/${selectedHairCut.hairCutImage}`
      }
    }
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <Container>
          <div className="cart-empty">
            <FontAwesomeIcon icon={faShoppingCart} className="empty-cart-icon" />
            <h3>
              Please login to view your cart
            </h3>
            <p>
              You need to be logged in to access your shopping cart.
            </p>
            <Button variant="primary" onClick={() => navigate('/login')}>
              <span>
                Login
              </span>
            </Button>
          </div>
        </Container>
      </div>
    )
  }

  if (loading && cart.items.length === 0) {
    return (
      <div className="cart-page">
        <Container>
          <div className="cart-loading">
            <Spinner animation="border" variant="primary" />
            <p
              className="mt-3"
             
            >
              Loading your cart...
            </p>
          </div>
        </Container>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <Container>
          <div className="breadcrumb-section">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <span>
                    Cart
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          <div className="cart-empty">
            <FontAwesomeIcon icon={faShoppingCart} className="empty-cart-icon" />
            <h3>
              Your cart is empty
            </h3>
            <p>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button variant="primary" onClick={() => navigate('/shop')}>
              <span>
                Continue Shopping
              </span>
            </Button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="cart-page">
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
              <li className="breadcrumb-item active" aria-current="page">
                <span>
                  Cart
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        <Row className="g-4">
          {/* Cart Items */}
          <Col lg={8}>
            <Card className="cart-items-card">
              <Card.Body>
                <div className="cart-header">
                  <h4>
                    Shopping Cart
                  </h4>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={handleClearCart}
                    disabled={loading}
                  >
                    <span>
                      Clear Cart
                    </span>
                  </Button>
                </div>

                {/* Cart Items Table */}
                <div className="cart-items-table">
                  <div className="cart-table-header">
                    <div
                      className="col-product"
                     
                    >
                      PRODUCT
                    </div>
                    <div
                      className="col-price"
                     
                    >
                      PRICE
                    </div>
                    <div
                      className="col-quantity"
                     
                    >
                      QUANTITY
                    </div>
                    <div
                      className="col-subtotal"
                     
                    >
                      SUBTOTAL
                    </div>
                  </div>

                  {cart.items.map((item) => (
                    <div key={item._id} className="cart-item">
                      <div className="item-product">
                        <div className="product-image">
                          <img 
                            src={getImagePath(item.product)} 
                            alt={item.product?.productName || 'Product'}
                            onError={(e) => {
                              e.target.src = '/src/assets/images/image_108.png'
                            }}
                          />
                        </div>
                        <div className="product-details">
                          <h6 className="product-name">{item.product?.productName || 'Custom Hair System'}</h6>
                          <p className="product-subtitle">{item.product?.productShortTitle || 'Customized Product'}</p>
                          
                          {/* Basic Product Info - Only show essential details */}
                          <div className="selected-options">
                            {/* Only show basic info, detailed customization will be in modal */}
                            {item.isCustomHairSystem && (
                              <div className="option-item">
                                <span
                                  className="option-label"
                                 
                                >
                                  Type:
                                </span>
                                <span>
                                  Custom Hair System
                                </span>
                              </div>
                            )}
                            
                            {/* Show only essential ProductDetail options */}
                            {item.selectedColor && (
                              <div className="option-item">
                                <span
                                  className="option-label"
                                 
                                >
                                  Color:
                                </span>
                                <div className="color-option">
                                  {getColorImagePath(item.selectedColor) && (
                                    <img 
                                      src={getColorImagePath(item.selectedColor)} 
                                      alt={item.selectedColor.colorType}
                                      className="color-swatch-cart"
                                      onError={(e) => e.target.style.display = 'none'}
                                    />
                                  )}
                                  <span>{item.selectedColor.colorType}</span>
                                </div>
                              </div>
                            )}
                            
                            {item.selectedHairCut && (
                              <div className="option-item">
                                <span
                                  className="option-label"
                                 
                                >
                                  Haircut:
                                </span>
                                <div className="haircut-option">
                                  {getHaircutImagePath(item.selectedHairCut) && (
                                    <img 
                                      src={getHaircutImagePath(item.selectedHairCut)} 
                                      alt={item.selectedHairCut.hairCutCode}
                                      className="haircut-thumbnail"
                                      onError={(e) => e.target.style.display = 'none'}
                                    />
                                  )}
                                  <span>{item.selectedHairCut.hairCutCode}</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Stock Base Size for hair systems */}
                            {(item.customization?.stockBaseSizeLabel || item.stockBaseSizeLabel) && (
                              <div className="option-item">
                                <span
                                  className="option-label"
                                 
                                >
                                  Stock Base Size:
                                </span>
                                <span>
                                  {item.customization?.stockBaseSizeLabel || item.stockBaseSizeLabel}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* View Customization Button */}
                          {(item.isCustomHairSystem || (item.isCustomized && item.customization)) && (
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => handleViewCustomization(item)}
                            >
                              <FontAwesomeIcon icon={faEye} className="me-2" />
                              <span>
                                View Customization Details
                              </span>
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="item-price">
                        {formatPrice(item.unitPrice || item.itemPrice || 0)}
                      </div>

                      <div className="item-quantity">
                        <div className="quantity-controls">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </Button>
                          <span className="quantity-value">{item.quantity}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={loading}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </div>
                      </div>

                      <div className="item-subtotal">
                        {formatPrice(item.totalPrice)}
                      </div>

                      <div className="item-actions">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Bill Summary */}
          <Col lg={4}>
            <Card className="bill-summary-card">
              <Card.Body>
                <h5
                  className="bill-summary-title"
                 
                >
                  Bill Summary
                </h5>
                
                <div className="bill-details">
                  <div className="bill-row">
                    <span>
                      Subtotal:
                    </span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="bill-row">
                    <span>
                      GST:
                    </span>
                    <span>{formatPrice(cart.tax)}</span>
                  </div>
                  <div className="bill-row">
                    <span>
                      Shipping Fee:
                    </span>
                    <span>{formatPrice(cart.shipping)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="bill-row discount">
                      <span>
                        Discount:
                      </span>
                      <span>-{formatPrice(cart.discount)}</span>
                    </div>
                  )}
                  <div className="bill-row total">
                    <span>
                      Total:
                    </span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="coupon-section">
                  <Form onSubmit={handleApplyDiscount}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Coupon Code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        disabled={discountLoading}
                      />
                    </Form.Group>
                    <Button 
                      type="submit" 
                      variant="outline-primary" 
                      className="w-100"
                      disabled={discountLoading || !discountCode.trim()}
                    >
                      {discountLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          <span>
                            Applying...
                          </span>
                        </>
                      ) : (
                        <span>
                          Apply Coupon
                        </span>
                      )}
                    </Button>
                  </Form>
                  
                  {discountError && (
                    <Alert variant="danger" className="mt-2">
                      {discountError}
                    </Alert>
                  )}
                  
                  {discountSuccess && (
                    <Alert variant="success" className="mt-2">
                      {discountSuccess}
                    </Alert>
                  )}
                </div>

                {/* Checkout Button */}
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="checkout-btn w-100"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  <span>
                    Checkout
                  </span>
                </Button>

                {/* Continue Shopping */}
                <Button 
                  variant="outline-secondary" 
                  className="continue-shopping-btn w-100 mt-2"
                  onClick={() => navigate('/shop')}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  <span>
                    Continue Shopping
                  </span>
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Customization Details Modal */}
      <Modal show={showCustomizationModal} onHide={() => setShowCustomizationModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Customization Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="customization-modal-body">
          {selectedCustomization && (
            <div className="customization-details">
              {/* HairCustomization Details */}
              {selectedCustomization.isCustomHairSystem && selectedCustomization.customHairSystem && (
                <div className="customization-section">
                  <h5
                    className="cart-customization-title"
                   
                  >
                    Custom Hair System Details
                  </h5>
                  {Object.entries(selectedCustomization.customHairSystem).map(([key, value]) => {
                    if (!value || value === '') return null
                    
                    // Format the key to be more readable
                    const formattedKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())
                    
                    return (
                      <div key={key} className="customization-item">
                        <h6>{formattedKey}</h6>
                        <p>{value}</p>
                      </div>
                    )
                  })}
                </div>
              )}
              
              {/* ProductDetail Customization */}
              {selectedCustomization.customization && (
                <div className="customization-section">
                  <h5
                    className="cart-customization-title"
                   
                  >
                    Product Customization Details
                  </h5>
                  {Object.entries(selectedCustomization.customization).map(([key, value]) => {
                    // Skip: Stock Base Size Id, Size (merged into Cut to Size), hairLengths, uploadedImages
                    if (key === 'hairLengths' || key === 'uploadedImages' || key === 'stockBaseSizeId' || key === 'size') return null
                    if (!value && key !== 'cutToSize') return null

                    const cust = selectedCustomization.customization

                    // Cut to Size: show "No", or the size value under it (size row removed)
                    if (key === 'cutToSize') {
                      let displayValue = 'No'
                      if (value === true) {
                        const sz = cust.size
                        if (sz) {
                          const num = parseFloat(String(sz))
                          displayValue = !Number.isNaN(num) ? `${sz} inch = ${(num * 2.54).toFixed(2)} cm` : `${sz} inch`
                        } else {
                          displayValue = 'Yes'
                        }
                      }
                      return (
                        <div key={key} className="customization-item">
                          <h6>Cut to Size</h6>
                          <p>{displayValue}</p>
                        </div>
                      )
                    }

                    // Format the key to be more readable
                    const formattedKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())

                    return (
                      <div key={key} className="customization-item">
                        <h6>{formattedKey}</h6>
                        <p>{value}</p>
                      </div>
                    )
                  })}
                  
                  {selectedCustomization.customization.hairLengths && (
                    <div className="customization-item">
                      <h6>
                        Hair Lengths
                      </h6>
                      <div className="hair-lengths-grid">
                        {Object.entries(selectedCustomization.customization.hairLengths).map(([part, length]) => (
                          <div key={part} className="length-item">
                            <span className="part-name">{part.charAt(0).toUpperCase() + part.slice(1)}:</span>
                            <span className="length-value">{length}"</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Additional Notes */}
              {selectedCustomization.additionalNotes && (
                <div className="customization-section">
                  <h5
                    className="cart-customization-title"
                   
                  >
                    Additional Notes
                  </h5>
                  <div className="customization-item">
                    <p>{selectedCustomization.additionalNotes}</p>
                  </div>
                </div>
              )}
              
              <div className="customization-item total-price-item">
                <h6>Total Price</h6>
                <p className="total-price">{formatPrice(selectedCustomization.totalPrice || selectedCustomization.unitPrice || selectedCustomization.itemPrice || 0)}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCustomizationModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Cart
