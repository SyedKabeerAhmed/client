import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Spinner, Alert, Accordion, Form, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faChevronRight, faCheck, faLock, faSignInAlt, faPaperPlane, faCheckCircle, faExclamationCircle, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { productService } from '../services/productService'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { addToCart, loading: cartLoading } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Customization state
  const [customization, setCustomization] = useState({
    hairColor: '',
    haircut: '',
    cutToSize: undefined, // undefined = not selected, false = "No", true = "Yes"
    size: '',
    additionalInfo: '',
    uploadedImages: []
  })
  
  // Modal states
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [showHaircutModal, setShowHaircutModal] = useState(false)
  const [showImageUploadModal, setShowImageUploadModal] = useState(false)
  const [showHairLengthModal, setShowHairLengthModal] = useState(false)
  
  // Hair length stepper states
  const [currentStep, setCurrentStep] = useState(0)
  const [hairLengths, setHairLengths] = useState({
    front: '1.00',
    top: '1.00',
    crown: '1.00',
    back: '1.00',
    temples: '1.00',
    sides: '1.00'
  })
  
  // Image upload states
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  
  // Accordion states
  const [activeAccordion, setActiveAccordion] = useState('hairColor')
  
  // Tab states
  const [activeTab, setActiveTab] = useState('overview')
  
  // Review form states
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    reviewDescription: ''
  })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState('')

  // Add to cart states
  const [addToCartLoading, setAddToCartLoading] = useState(false)
  const [addToCartSuccess, setAddToCartSuccess] = useState('')
  const [addToCartError, setAddToCartError] = useState('')

  // Price calculation
  const calculateTotalPrice = () => {
    if (!product) return 0
    
    // Base product price
    const basePrice = product.pricing?.priceForIndividual || product.pricing?.actualBasePrice || 75
    
    let totalPrice = basePrice
    
    // Add haircut price if selected
    if (customization.haircut && customization.haircut !== 'None') {
      totalPrice += 35.49
    }
    
    // Add cut to size price if selected
    if (customization.cutToSize) {
      totalPrice += 13.31
    }
    
    return totalPrice
  }

  // Load product on component mount
  useEffect(() => {
    loadProduct()
  }, [id])

  // Cleanup image preview URLs on component unmount
  useEffect(() => {
    return () => {
      uploadedImages.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview)
        }
      })
    }
  }, [])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await productService.getProductById(id)
      
      if (response.success && response.data) {
        setProduct(response.data.product)
      } else {
        throw new Error('Product not found')
      }
    } catch (err) {
      setError(err.message || 'Failed to load product')
      console.error('Error loading product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomizationChange = (field, value) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSizeSelection = (size) => {
    handleCustomizationChange('size', size)
    handleCustomizationChange('cutToSize', true)  // Set cutToSize to true when size is selected
  }

  const handleSizeConfirm = () => {
    if (customization.size) {
      setShowSizeModal(false)
    }
  }

  const handleHaircutSelection = (haircut) => {
    // Clear all previous haircut-related data when selecting a new option
    setCustomization(prev => {
      const newCustomization = {
        ...prev,
        haircut: haircut,
        uploadedImages: []
      }
      // Remove hairLengths and selectedHairstyle instead of setting to null
      delete newCustomization.hairLengths
      delete newCustomization.selectedHairstyle
      return newCustomization
    })
    setShowHaircutModal(false)
  }

  // Hair length stepper data
  const hairLengthSteps = [
    { key: 'front', label: 'Front', number: 1 },
    { key: 'top', label: 'Top', number: 2 },
    { key: 'crown', label: 'Crown', number: 3 },
    { key: 'back', label: 'Back', number: 4 },
    { key: 'temples', label: 'Temples', number: '5 & 6' },
    { key: 'sides', label: 'Sides', number: '7 & 8' }
  ]

  const lengthOptions = [
    { inch: '1.00', cm: '2.54' },
    { inch: '1.25', cm: '3.17' },
    { inch: '1.50', cm: '3.81' },
    { inch: '1.75', cm: '4.45' },
    { inch: '2.00', cm: '5.08' },
    { inch: '2.25', cm: '5.71' },
    { inch: '2.50', cm: '6.35' },
    { inch: '2.75', cm: '6.99' },
    { inch: '3.00', cm: '7.62' }
  ]

  const sizeOptions = [
    { inch: '1.50', cm: '3.81' },
    { inch: '1.75', cm: '4.45' },
    { inch: '2.00', cm: '5.08' },
    { inch: '2.25', cm: '5.71' },
    { inch: '2.50', cm: '6.35' },
    { inch: '2.75', cm: '6.99' },
    { inch: '3.00', cm: '7.62' },
    { inch: '3.25', cm: '8.26' },
    { inch: '3.50', cm: '8.89' },
    { inch: '3.75', cm: '9.53' },
    { inch: '4.00', cm: '10.16' },
    { inch: '4.25', cm: '10.80' },
    { inch: '4.50', cm: '11.43' },
    { inch: '4.75', cm: '12.07' },
    { inch: '5.00', cm: '12.70' },
    { inch: '5.25', cm: '13.34' },
    { inch: '5.50', cm: '13.97' },
    { inch: '5.75', cm: '14.61' },
    { inch: '6.00', cm: '15.24' },
    { inch: '6.25', cm: '15.88' },
    { inch: '6.50', cm: '16.51' },
    { inch: '6.75', cm: '17.15' },
    { inch: '7.00', cm: '17.78' },
    { inch: '7.25', cm: '18.42' },
    { inch: '7.50', cm: '19.05' },
    { inch: '7.75', cm: '19.69' },
    { inch: '8.00', cm: '20.32' }
  ]

  // Hair length handlers
  const handleHairLengthOpen = () => {
    setShowHairLengthModal(true)
    setCurrentStep(0)
  }

  const handleHairLengthChange = (stepKey, length) => {
    setHairLengths(prev => ({
      ...prev,
      [stepKey]: length
    }))
  }

  const handleNextStep = () => {
    if (currentStep < hairLengthSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleHairLengthConfirm = () => {
    // Clear all previous haircut-related data and set hair length option
    setCustomization(prev => {
      const newCustomization = {
        ...prev,
        haircut: 'I want to order my hair length',
        hairLengths: hairLengths,
        uploadedImages: []
      }
      // Remove selectedHairstyle instead of setting to null
      delete newCustomization.selectedHairstyle
      return newCustomization
    })
    setShowHairLengthModal(false)
    setCurrentStep(0)
  }

  const handleHairLengthCancel = () => {
    setShowHairLengthModal(false)
    setCurrentStep(0)
  }

  // Image upload handlers
  const handleImageUpload = () => {
    setShowImageUploadModal(true)
  }

  const handleImageFileSelect = (event) => {
    const files = Array.from(event.target.files)
    processImageFiles(files)
  }

  const handleImageDrop = (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    processImageFiles(files)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const processImageFiles = (files) => {
    setUploadError('')
    
    // Validate file count - only allow 1 image
    if (uploadedImages.length > 0) {
      setUploadError('Only 1 image is allowed. Please remove the existing image first.')
      return
    }

    if (files.length > 1) {
      setUploadError('Please select only 1 image')
      return
    }

    // Validate the file
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError('Image must be less than 5MB')
      return
    }

    // Create preview URL
    const newImage = {
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }

    setUploadedImages([newImage])
  }

  const removeImage = () => {
    if (uploadedImages.length > 0) {
      URL.revokeObjectURL(uploadedImages[0].preview)
      setUploadedImages([])
    }
  }

  const confirmImageUpload = () => {
    if (uploadedImages.length === 0) {
      setUploadError('Please upload an image')
      return
    }
    
    // Clear all previous haircut-related data and set upload option
    setCustomization(prev => {
      const newCustomization = {
        ...prev,
        haircut: 'Upload hairstyle images you want',
        uploadedImages: uploadedImages
      }
      // Remove hairLengths and selectedHairstyle instead of setting to null
      delete newCustomization.hairLengths
      delete newCustomization.selectedHairstyle
      return newCustomization
    })
    setShowImageUploadModal(false)
  }

  const cancelImageUpload = () => {
    // Clean up preview URLs
    uploadedImages.forEach(image => URL.revokeObjectURL(image.preview))
    setUploadedImages([])
    setUploadError('')
    setShowImageUploadModal(false)
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Validate mandatory selections
    const validationErrors = []
    
    // Validate hair color
    if (!customization.hairColor || customization.hairColor.trim() === '') {
      validationErrors.push('Hair Color')
    }
    
    // Validate haircut - 'None' is a valid option
    if (!customization.haircut || customization.haircut.trim() === '') {
      validationErrors.push('Haircut')
    } else if (customization.haircut !== 'None') {
      // Additional validation for specific haircut options (only if not 'None')
      if (customization.haircut === 'I want to order my hair length' && !customization.hairLengths) {
        validationErrors.push('Haircut (complete hair length selection)')
      } else if (customization.haircut === 'Upload hairstyle images you want' && !customization.uploadedImages?.length) {
        validationErrors.push('Haircut (upload an image)')
      } else if (customization.haircut === 'Choose your hairstyles' && !customization.selectedHairstyle) {
        validationErrors.push('Haircut (select a hairstyle)')
      }
    }
    
    // Validate cut to size - must select either "No" (false) or "Yes" (true with size)
    // cutToSize can be false (No) or true (Yes with size), but must be explicitly set
    if (customization.cutToSize === undefined || customization.cutToSize === null) {
      validationErrors.push('Cut to Size')
    } else if (customization.cutToSize === true && (!customization.size || customization.size.trim() === '')) {
      validationErrors.push('Cut to Size (select a size)')
    }

    if (validationErrors.length > 0) {
      alert(`Please select the mandatory option: ${validationErrors.join(', ')}`)
      return
    }

    try {
      setAddToCartLoading(true)
      setAddToCartSuccess('')
      setAddToCartError('')
      
      const totalPrice = calculateTotalPrice()
      await addToCart(id, customization, 1, totalPrice)
      
      setAddToCartSuccess('Product added to cart successfully!')
      setTimeout(() => {
        setAddToCartSuccess('')
      }, 3000)
      
    } catch (error) {
      console.error('Failed to add to cart:', error)
      const errorMessage = error.message || 'Failed to add product to cart'
      setAddToCartError(errorMessage)
      setTimeout(() => {
        setAddToCartError('')
      }, 5000)
    } finally {
      setAddToCartLoading(false)
    }
  }


  // Handle review form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      setReviewError('Please login to submit a review')
      return
    }

    if (reviewForm.rating === 0) {
      setReviewError('Please select a rating')
      return
    }

    if (!reviewForm.reviewDescription.trim()) {
      setReviewError('Please write a review description')
      return
    }

    try {
      setReviewLoading(true)
      setReviewError('')
      setReviewSuccess('')

      // Debug: Check if token exists
      const token = localStorage.getItem('authToken')
      console.log('Token exists:', !!token)
      console.log('User authenticated:', isAuthenticated)
      console.log('User data:', user)

      const response = await productService.addProductReview(id, {
        rating: reviewForm.rating,
        reviewDescription: reviewForm.reviewDescription.trim()
      })

      if (response.success) {
        setReviewSuccess('Review submitted successfully!')
        setReviewForm({ rating: 0, reviewDescription: '' })
        
        // Reload product to get updated reviews
        await loadProduct()
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setReviewSuccess('')
        }, 3000)
      } else {
        setReviewError(response.message || 'Failed to submit review')
      }
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review')
      console.error('Review submission error:', err)
    } finally {
      setReviewLoading(false)
    }
  }

  // Handle rating selection
  const handleRatingSelect = (rating) => {
    console.log('Rating selected:', rating) // Debug log
    setReviewForm(prev => ({ ...prev, rating }))
  }

  // Handle review description change
  const handleReviewDescriptionChange = (e) => {
    setReviewForm(prev => ({ ...prev, reviewDescription: e.target.value }))
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon 
          key={i} 
          icon={faStar} 
          className={`star ${i < rating ? 'filled' : ''}`}
        />
      )
    }
    return stars
  }

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <Container>
          <Alert variant="danger" className="mt-4">
            {error}
          </Alert>
        </Container>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Container>
          <Alert variant="warning" className="mt-4">
            Product not found
          </Alert>
        </Container>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-content">
        <Container>
          {/* Breadcrumb */}
          <div className="breadcrumb-section">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/shop">Mono Hair Type</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {product.productName}
                </li>
              </ol>
            </nav>
          </div>

          <Row className="g-5">
            {/* Product Images */}
            <Col lg={6}>
              <div className="product-images">
                <div className="main-image">
                  <img 
                    src={product.productImages?.[0] || '/src/assets/images/image_108.png'} 
                    alt={product.productName}
                    className="product-main-image"
                    onError={(e) => {
                      e.target.src = '/src/assets/images/image_108.png'
                    }}
                  />
                  {product.bestSelling && (
                    <div className="best-selling-badge">
                      Best Selling
                    </div>
                  )}
                  {product.premiumProduct && (
                    <div className="premium-badge">
                      Premium
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="thumbnail-gallery">
                  <div className="thumbnail-item active">
                    <img src={product.productImages?.[0] || '/src/assets/images/image_108.png'} alt="Main view" />
                  </div>
                  <div className="thumbnail-item">
                    <img src="/src/assets/images/image_108.png" alt="Base view" />
                  </div>
                  <div className="thumbnail-item">
                    <img src="/src/assets/images/image_108.png" alt="Style 1" />
                  </div>
                  <div className="thumbnail-item">
                    <img src="/src/assets/images/image_108.png" alt="Style 2" />
                  </div>
                  <div className="thumbnail-item">
                    <img src="/src/assets/images/image_108.png" alt="Style 3" />
                  </div>
                </div>
              </div>
            </Col>

            {/* Product Details */}
            <Col lg={6}>
              <div className="product-info">
                <h1 className="product-title">{product.productName || 'Neo Hair System'}</h1>
                <p className="product-subtitle">{product.productShortTitle || 'Premium Antimicrobial Hair Systems for Long Lasting Comfort'}</p>
                
                {/* Product Price */}
                <div className="product-price-section">
                  <div className="price-main">
                    £{product.pricing?.priceForIndividual || product.pricing?.actualBasePrice || '75'}
                  </div>
                  <div className="availability">
                    <span className="in-stock">In Stock</span>
                  </div>
                </div>

                {/* Product Benefits */}
                <div className="product-benefits mb-4">
                  <div className="benefit-item">
                    <span className="benefit-label">Durability:</span>
                    <div className="benefit-stars">
                      {renderStars(product.productBenefits?.durability || 3)}
                    </div>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-label">Comfort:</span>
                    <div className="benefit-stars">
                      {renderStars(product.productBenefits?.comfort || 4)}
                    </div>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-label">Appearance:</span>
                    <div className="benefit-stars">
                      {renderStars(product.productBenefits?.appearance || 3)}
                    </div>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-label">Maintenance:</span>
                    <div className="benefit-stars">
                      {renderStars(5)}
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="product-description mb-4">
                  <h5>Description</h5>
                  <p>{product.productDescription || 'The Neo hair system is a hybrid men\'s hair replacement unit designed to balance realism, comfort, and durability. It features a French lace front and top for a natural-looking hairline and breathability, combined with a skin (PU) perimeter that provides strength and makes bonding easier.'}</p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Customization Section */}
          <Row className="mt-5">
            <Col lg={10} className="mx-auto">
              <Card className="customization-card">
                <Card.Body>
                  <h4 className="customization-title mb-4">Customize Your Hair System</h4>
                  
                  <Accordion activeKey={activeAccordion} onSelect={(e) => setActiveAccordion(e)}>
                    {/* Hair_Color */}
                    <Accordion.Item eventKey="hairColor">
                      <Accordion.Header>
                        <div className="accordion-header-content">
                          <span>Hair_Color</span>
                          {customization.hairColor && (
                            <span className="selected-option">{customization.hairColor}</span>
                          )}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="color-options">
                          <div className="color-categories">
                            {product.colors && Object.entries(
                              product.colors.reduce((acc, color) => {
                                if (!acc[color.category]) {
                                  acc[color.category] = []
                                }
                                acc[color.category].push(color)
                                return acc
                              }, {})
                            ).map(([category, colors]) => (
                              <div key={category} className="color-category">
                                <h6>{category}</h6>
                              <div className="color-grid">
                                  {colors.map((color) => (
                                    <div 
                                      key={color._id}
                                      className={`color-option ${customization.hairColor === color.hair_color ? 'selected' : ''}`}
                                      onClick={() => handleCustomizationChange('hairColor', color.hair_color)}
                                    >
                                      <div className="color-circle-container">
                                        <img 
                                          src={`/src/assets/images/Hair_Color/all_colors/${color.hair_color.replace('#', '')}.png`}
                                          alt={color.hair_color}
                                          className="color-circle"
                                          onError={(e) => {
                                            e.target.style.display = 'none'
                                            e.target.nextSibling.style.display = 'block'
                                          }}
                                        />
                                        <div 
                                          className={`color-circle-fallback color-${color.hair_color.replace('#', '').toLowerCase()}`}
                                          style={{display: 'none'}}
                                        ></div>
                                      </div>
                                      <span className="color-code">{color.hair_color}</span>
                                      <span className="color-subcategory">{color.subcategory}</span>
                                      <span className="color-stock">Stock: {color.qty_total}</span>
                                  </div>
                                ))}
                              </div>
                                  </div>
                                ))}
                          </div>
                          
                          <div className="color-help-text">
                            <small>Need help choosing a color? <a href="#">Find the perfect match for your hair color.</a></small>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* Haircut */}
                    <Accordion.Item eventKey="haircut">
                      <Accordion.Header>
                        <div className="accordion-header-content">
                          <span>Haircut</span>
                          {customization.haircut && (
                            <span className="selected-option">
                              {customization.haircut}
                              {customization.uploadedImages?.length > 0 && (
                                <span className="image-count-badge">
                                  (1 image)
                                </span>
                              )}
                              {customization.hairLengths && (
                                <span className="hair-lengths-badge">
                                  ({Object.keys(customization.hairLengths).length} sections)
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="haircut-options">
                           <div className="haircut-option" onClick={() => setShowHaircutModal(true)}>
                             <span>Choose your hairstyles</span>
                             <span className="price">$35.49</span>
                             <FontAwesomeIcon icon={faChevronRight} />
                           </div>
                          <div className="haircut-option" onClick={handleHairLengthOpen}>
                            <span>I want to order my hair length</span>
                            <span className="price">$35.49</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                          <div className="haircut-option" onClick={() => {
                            setCustomization(prev => {
                              const newCustomization = {
                                ...prev,
                                haircut: "I'll send email to hair store",
                                uploadedImages: []
                              }
                              delete newCustomization.hairLengths
                              delete newCustomization.selectedHairstyle
                              return newCustomization
                            })
                          }}>
                            <span>I'll send email to hair store</span>
                            <span className="price">$35.49</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                          <div className="haircut-option" onClick={handleImageUpload}>
                            <span>Upload hairstyle images you want</span>
                            <span className="price">$35.49</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                          <div className="haircut-option" onClick={() => {
                            setCustomization(prev => {
                              const newCustomization = {
                                ...prev,
                                haircut: 'None',
                                uploadedImages: []
                              }
                              delete newCustomization.hairLengths
                              delete newCustomization.selectedHairstyle
                              return newCustomization
                            })
                          }}>
                            <span>None</span>
                          </div>
                        </div>
                        
                        {/* Display Selected Hair Lengths */}
                        {customization.hairLengths && (
                          <div className="selected-hair-lengths">
                            <h6>Selected Hair Lengths:</h6>
                            <div className="hair-length-list">
                              {Object.entries(customization.hairLengths).map(([section, length]) => {
                                const cmValue = lengthOptions.find(opt => opt.inch === length)?.cm
                                return (
                                  <div key={section} className="hair-length-item">
                                    <span className="section-name">{section.charAt(0).toUpperCase() + section.slice(1)}:</span>
                                    <span className="length-value">{length} inch ({cmValue} cm)</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        <div className="info-note">
                          <small>Kindly note that we need extra 5-7 working days for orders requiring hair-cutting services. The front excess edge will be cut by default.</small>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* Cut to Size */}
                    <Accordion.Item eventKey="cutToSize">
                      <Accordion.Header>
                        <div className="accordion-header-content">
                          <span>Cut to size</span>
                          {customization.cutToSize === true && customization.size && (
                            <span className="selected-option">
                              {customization.size} inch = {sizeOptions.find(opt => opt.inch === customization.size)?.cm} cm
                            </span>
                          )}
                          {customization.cutToSize === true && !customization.size && (
                            <span className="selected-option">Yes, cut to my size</span>
                          )}
                          {customization.cutToSize === false && (
                            <span className="selected-option">No I will have it cut by my stylist</span>
                          )}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="cut-to-size-options">
                          <div 
                            className={`cut-option ${customization.cutToSize === false ? 'selected' : ''}`} 
                            onClick={() => {
                              handleCustomizationChange('cutToSize', false)
                              handleCustomizationChange('size', '') // Clear size when selecting "No"
                            }}
                          >
                            <span>No I will have it cut by my stylist</span>
                            {customization.cutToSize === false && (
                              <FontAwesomeIcon icon={faCheck} className="ms-2" />
                            )}
                          </div>
                           <div 
                             className={`cut-option ${customization.cutToSize === true ? 'selected' : ''}`} 
                             onClick={() => setShowSizeModal(true)}
                           >
                             <span>Yes, cut to my size</span>
                             <span className="price">$13.31</span>
                             <FontAwesomeIcon icon={faChevronRight} />
                           </div>
                        </div>
                        <div className="info-note">
                          <small>Orders requiring our cutting services will also have the excess front edge cut. We require an additional 2-3 days for shipping on these orders.</small>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    {/* Additional Information */}
                    <Accordion.Item eventKey="additionalInfo">
                      <Accordion.Header>
                        <div className="accordion-header-content">
                          <span>Additional Information</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Write any Additional information for us"
                            value={customization.additionalInfo}
                            onChange={(e) => handleCustomizationChange('additionalInfo', e.target.value)}
                          />
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  {/* Add to Cart Success Message */}
                  {addToCartSuccess && (
                    <Alert variant="success" className="mt-3">
                      <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                      {addToCartSuccess}
                    </Alert>
                  )}

                  {/* Add to Cart Error Message */}
                  {addToCartError && (
                    <Alert variant="danger" className="mt-3">
                      <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                      {addToCartError}
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <div className="submit-section mt-4">
                    <div className="action-buttons">
                    <Button 
                      variant="primary" 
                        size="lg" 
                        className="add-to-cart-button"
                        onClick={handleAddToCart}
                        disabled={addToCartLoading || cartLoading}
                      >
                        {addToCartLoading || cartLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Adding to Cart...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Product Specifications & Reviews */}
          <Row className="mt-5">
            <Col lg={12}>
              <Card className="specifications-card">
                <Card.Body>
                  <div className="specifications-tabs">
                    <div className="tab-buttons">
                      <button 
                        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                      >
                        Overview
                      </button>
                      <button 
                        className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                      >
                        Reviews ({product.productReviews?.totalReviewers || 0})
                      </button>
                    </div>
                    
                    <div className="tab-content">
                      {/* Overview Tab */}
                      {activeTab === 'overview' && (
                        <div className="specifications-table">
                          <div className="spec-row">
                            <div className="spec-label">Product Code:</div>
                            <div className="spec-value">{product.productDetails?.productCode || 'N/A'}</div>
                          </div>
                          <div className="spec-row">
                            <div className="spec-label">Base Design:</div>
                            <div className="spec-value">{product.productDetails?.baseDesign || 'N/A'}</div>
                          </div>
                          <div className="spec-row">
                            <div className="spec-label">Base Size:</div>
                            <div className="spec-value">{product.productDetails?.baseSize || 'N/A'}</div>
                          </div>
                          <div className="spec-row">
                            <div className="spec-label">Front Contour:</div>
                            <div className="spec-value">{product.productDetails?.frontContour || 'N/A'}</div>
                          </div>
                          <div className="spec-row">
                            <div className="spec-label">Bleach Knots:</div>
                            <div className="spec-value">{product.productDetails?.bleachKnots || 'N/A'}</div>
                          </div>
                          <div className="spec-row">
                            <div className="spec-label">Knot Type:</div>
                            <div className="spec-value">{product.productDetails?.knotTypes || 'N/A'}</div>
                          </div>
                          <div className="spec-row">
                            <div className="spec-label">Hair Type:</div>
                            <div className="spec-value">{product.productDetails?.hairType || 'N/A'}</div>
                          </div>
                          <div className="spec-row">
                            <div className="spec-label">Hair Length:</div>
                            <div className="spec-value">{product.productDetails?.hairLength || 'N/A'}</div>
                          </div>
                          <div className="spec-row">
                            <div className="spec-label">Hair Wave/Curl:</div>
                            <div className="spec-value">{product.productDetails?.hairWaveCurl || 'N/A'}</div>
                          </div>
                          <div className="spec-row">
                            <div className="spec-label">Hair Density:</div>
                            <div className="spec-value">{product.productDetails?.hairDensity || 'N/A'}</div>
                          </div>
                          <div className="spec-row">
                            <div className="spec-label">Hair_Color:</div>
                            <div className="spec-value">{product.productDetails?.hairColour || 'N/A'}</div>
                          </div>
                          <div className="spec-row">
                            <div className="spec-label">Hair Direction:</div>
                            <div className="spec-value">{product.productDetails?.hairDirection || 'N/A'}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Reviews Tab */}
                      {activeTab === 'reviews' && (
                        <div className="reviews-section">
                          <h4 className="reviews-title mb-4">Product Reviews</h4>
                          
                          {product.productReviews ? (
                            <>
                              {/* Rating Summary */}
                              <div className="rating-summary mb-4">
                                <div className="rating-summary-content">
                                  <div className="rating-overview">
                                    <div className="average-rating">
                                      {product.productReviews.averageReviewRating || 0}
                                    </div>
                                    <div className="rating-stars">
                                      {renderStars(Math.round(product.productReviews.averageReviewRating || 0))}
                                    </div>
                                    <div className="rating-count">
                                      Based on {product.productReviews.totalReviewers || 0} reviews
                                    </div>
                                  </div>
                                  <div className="rating-breakdown">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                      const count = product.productReviews.reviews?.filter(review => review.rating === star).length || 0;
                                      const percentage = product.productReviews.totalReviewers > 0 ? (count / product.productReviews.totalReviewers) * 100 : 0;
                                      
                                      return (
                                        <div key={star} className="rating-bar">
                                          <span className="rating-label">{star} star{star !== 1 ? 's' : ''}</span>
                                          <div className="rating-bar-container">
                                            <div className="rating-bar-fill" style={{width: `${percentage}%`}}></div>
                                          </div>
                                          <span className="rating-count">{count}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Individual Reviews */}
                              <div className="individual-reviews">
                                {product.productReviews.reviews && product.productReviews.reviews.length > 0 ? (
                                  product.productReviews.reviews.map((review) => (
                                    <div key={review._id} className="review-item">
                                      <div className="review-header">
                                        <div className="reviewer-info">
                                          <div className="reviewer-avatar">
                                            <img src="/src/assets/images/image_108.png" alt="Reviewer" />
                                          </div>
                                          <div className="reviewer-details">
                                            <div className="reviewer-name">{review.reviewerName}</div>
                                            <div className="review-date">
                                              {new Date(review.reviewDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="review-rating">
                                          {renderStars(review.rating)}
                                        </div>
                                      </div>
                                      <div className="review-content">
                                        <p>{review.reviewDescription}</p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="no-reviews">
                                    <p>No reviews available for this product yet.</p>
                                  </div>
                                )}
                              </div>
                              
                              {/* Add Review Form - Only for logged in users */}
                              {!authLoading && isAuthenticated && (
                                <div className="add-review-section mt-5">
                                  <Card className="add-review-card">
                                    <Card.Body>
                                       <h5 className="add-review-title mb-4">
                                         <FontAwesomeIcon icon={faStar} className="me-2" />
                                         Write a Review
                                       </h5>
                                      
                                      {/* Success Message */}
                                      {reviewSuccess && (
                                        <Alert variant="success" className="mb-3">
                                          <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                          {reviewSuccess}
                                        </Alert>
                                      )}
                                      
                                      {/* Error Message */}
                                      {reviewError && (
                                        <Alert variant="danger" className="mb-3">
                                          <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                                          {reviewError}
                                        </Alert>
                                      )}
                                      
                                      <Form onSubmit={handleReviewSubmit}>
                                        {/* Rating Selection */}
                                        <Form.Group className="mb-4">
                                          <Form.Label className="rating-label">
                                            <strong>Your Rating *</strong>
                                          </Form.Label>
                                          <div className="debug-info mb-2">
                                            <small>Current rating: {reviewForm.rating}</small>
                                          </div>
                                          <div className="rating-selection">
                                            <div className="star-rating-container">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                  key={star}
                                                  type="button"
                                                  className={`rating-star-btn ${reviewForm.rating >= star ? 'selected' : ''}`}
                                                  onClick={() => handleRatingSelect(star)}
                                                  disabled={reviewLoading}
                                                  title={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                                                >
                                                  <FontAwesomeIcon icon={faStar} className="star-icon" />
                                                </button>
                                              ))}
                                            </div>
                                            <div className="rating-text-container">
                                              <span className="rating-text">
                                                {reviewForm.rating === 0 ? 'Select a rating' : 
                                                 reviewForm.rating === 1 ? 'Poor' :
                                                 reviewForm.rating === 2 ? 'Fair' :
                                                 reviewForm.rating === 3 ? 'Good' :
                                                 reviewForm.rating === 4 ? 'Very Good' : 'Excellent'}
                                              </span>
                                              {reviewForm.rating > 0 && (
                                                <span className="rating-number">({reviewForm.rating}/5)</span>
                                              )}
                                            </div>
                                          </div>
                                        </Form.Group>
                                        
                                        {/* Review Description */}
                                        <Form.Group className="mb-4">
                                          <Form.Label className="review-text-label">
                                            <strong>Your Review *</strong>
                                          </Form.Label>
                                          <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="Share your experience with this product..."
                                            value={reviewForm.reviewDescription}
                                            onChange={handleReviewDescriptionChange}
                                            disabled={reviewLoading}
                                            className="review-textarea"
                                          />
                                          <Form.Text className="text-muted">
                                            Minimum 10 characters required
                                          </Form.Text>
                                        </Form.Group>
                                        
                                        {/* Submit Button */}
                                        <div className="review-submit-section">
                                          <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            disabled={reviewLoading || reviewForm.rating === 0 || !reviewForm.reviewDescription.trim()}
                                            className="submit-review-btn"
                                          >
                                            {reviewLoading ? (
                                              <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Submitting...
                                              </>
                                             ) : (
                                               <>
                                                 <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                                                 Submit Review
                                               </>
                                             )}
                                          </Button>
                                        </div>
                                      </Form>
                                    </Card.Body>
                                  </Card>
                                </div>
                              )}
                              
                              {/* Login Prompt for non-authenticated users */}
                              {!authLoading && !isAuthenticated && (
                                <div className="login-prompt-section mt-5">
                                  <Card className="login-prompt-card">
                                    <Card.Body className="text-center">
                                       <div className="login-prompt-content">
                                         <FontAwesomeIcon icon={faLock} className="login-prompt-icon mb-3" />
                                         <h5 className="login-prompt-title">Want to share your experience?</h5>
                                        <p className="login-prompt-text mb-4">
                                          Login to write a review and help other customers make informed decisions.
                                        </p>
                                        <Button
                                          variant="primary"
                                          size="lg"
                                          onClick={() => {
                                            try {
                                              navigate('/login')
                                            } catch (error) {
                                              console.error('Navigation error:', error)
                                              // Fallback to window.location if navigate fails
                                              window.location.href = '/login'
                                            }
                                          }}
                                           className="login-prompt-btn"
                                         >
                                           <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                                           Login to Review
                                         </Button>
                                      </div>
                                    </Card.Body>
                                  </Card>
                                </div>
                              )}
                              
                              {/* Loading state for auth */}
                              {authLoading && (
                                <div className="auth-loading-section mt-5">
                                  <Card className="auth-loading-card">
                                    <Card.Body className="text-center">
                                      <Spinner animation="border" variant="primary" className="mb-3" />
                                      <p className="mb-0">Loading authentication...</p>
                                    </Card.Body>
                                  </Card>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="no-reviews">
                              <p>No review data available for this product.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Size Selection Modal */}
      <Modal show={showSizeModal} onHide={() => setShowSizeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cut to My Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="size-selection">
            <div className="current-length">
              {customization.size ? `${customization.size} inch = ${sizeOptions.find(opt => opt.inch === customization.size)?.cm} cm` : 'Select a size'}
            </div>
            <div className="length-options">
              {sizeOptions.map((size) => (
                <div 
                  key={size.inch}
                  className={`length-option ${customization.size === size.inch ? 'selected' : ''}`}
                  onClick={() => handleSizeSelection(size.inch)}
                >
                  <span className="inch">{size.inch}</span>
                  <span className="cm">{size.cm}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSizeModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSizeConfirm}>
            Save Size
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Haircut Selection Modal */}
      <Modal show={showHaircutModal} onHide={() => setShowHaircutModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Choose Your Haircut</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="haircut-selection">
            <div className="haircut-grid">
              {product.hairCut?.chooseYourHairStyle?.map((haircut) => (
                <div 
                  key={haircut._id}
                  className={`haircut-card ${customization.haircut === haircut.cutType ? 'selected' : ''}`}
                  onClick={() => handleHaircutSelection(haircut.cutType)}
                >
                  <div className="haircut-image-slider">
                    <div className="slider-container">
                      <div className="slider-track">
                        {haircut.images.map((image, index) => (
                          <div key={index} className={`slider-slide ${index === 0 ? 'active' : ''}`}>
                            <img 
                              src={`/src/${image}`} 
                              alt={`${haircut.cutType} - ${index + 1}`}
                              onError={(e) => {
                                e.target.src = '/src/assets/images/image_108.png'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {haircut.images.length > 1 && (
                        <>
                          <button className="slider-nav slider-prev" onClick={(e) => {
                            e.stopPropagation()
                            const track = e.target.closest('.haircut-card').querySelector('.slider-track')
                            const slides = track.querySelectorAll('.slider-slide')
                            const currentSlide = track.querySelector('.slider-slide.active')
                            const currentIndex = Array.from(slides).indexOf(currentSlide)
                            const prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1
                            
                            slides.forEach(slide => slide.classList.remove('active'))
                            slides[prevIndex].classList.add('active')
                          }}>
                            <FontAwesomeIcon icon={faChevronRight} style={{transform: 'rotate(180deg)'}} />
                          </button>
                          <button className="slider-nav slider-next" onClick={(e) => {
                            e.stopPropagation()
                            const track = e.target.closest('.haircut-card').querySelector('.slider-track')
                            const slides = track.querySelectorAll('.slider-slide')
                            const currentSlide = track.querySelector('.slider-slide.active')
                            const currentIndex = Array.from(slides).indexOf(currentSlide)
                            const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1
                            
                            slides.forEach(slide => slide.classList.remove('active'))
                            slides[nextIndex].classList.add('active')
                          }}>
                            <FontAwesomeIcon icon={faChevronRight} />
                          </button>
                        </>
                      )}
                    </div>
                    {customization.haircut === haircut.cutType && (
                       <div className="selection-checkmark">
                         <FontAwesomeIcon icon={faCheck} />
                       </div>
                     )}
                  </div>
                  <div className="haircut-info">
                    <div className="haircut-id">{haircut.cutType}</div>
                    <div className="haircut-description">{haircut.description}</div>
                    {/* <div className="haircut-price">${product.hairCut?.price || 35.49}</div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHaircutModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowHaircutModal(false)}>
            Select Haircut
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Hair Length Stepper Modal */}
      <Modal show={showHairLengthModal} onHide={handleHairLengthCancel} size="lg" centered>
        <Modal.Header closeButton>
          <div className="hair-length-header">
            {currentStep > 0 && (
              <button className="back-arrow-btn" onClick={handlePrevStep}>
                <FontAwesomeIcon icon={faChevronRight} style={{transform: 'rotate(180deg)'}} />
              </button>
            )}
            <Modal.Title>I want to order my hair length</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="hair-length-stepper">
            {/* Current Step Label */}
            <div className="step-label">
              <h4>{hairLengthSteps[currentStep].label}</h4>
            </div>
            
            {/* Head Diagram */}
            <div className="head-diagram">
              <div className="head-illustration">
                <img 
                  src={`/src/assets/images/order_hair_length/${hairLengthSteps[currentStep].label}.png`}
                  alt={`${hairLengthSteps[currentStep].label} section`}
                  className="head-section-image"
                  onError={(e) => {
                    e.target.src = '/src/assets/images/image_108.png'
                  }}
                />
              </div>
            </div>
            
            {/* Length Selection */}
            <div className="length-selection">
              <div className="current-length">
                {hairLengths[hairLengthSteps[currentStep].key]} inch = {lengthOptions.find(opt => opt.inch === hairLengths[hairLengthSteps[currentStep].key])?.cm} cm
              </div>
              <div className="length-options">
                {lengthOptions.map((option) => (
                  <div 
                    key={option.inch}
                    className={`length-option ${hairLengths[hairLengthSteps[currentStep].key] === option.inch ? 'selected' : ''}`}
                    onClick={() => handleHairLengthChange(hairLengthSteps[currentStep].key, option.inch)}
                  >
                    <span className="inch">{option.inch}</span>
                    <span className="cm">{option.cm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHairLengthCancel}>
            Cancel
          </Button>
          {currentStep < hairLengthSteps.length - 1 ? (
            <Button variant="primary" onClick={handleNextStep}>
              Next Step
            </Button>
          ) : (
            <Button variant="primary" onClick={handleHairLengthConfirm}>
              Confirm
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Image Upload Modal */}
      <Modal show={showImageUploadModal} onHide={cancelImageUpload} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload hairstyle images you want</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="image-upload-container">
            {/* Upload Area */}
            <div 
              className="upload-area"
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('image-file-input').click()}
            >
              <div className="upload-content">
                <div className="upload-icon">
                  <FontAwesomeIcon icon={faChevronRight} style={{transform: 'rotate(-90deg)'}} />
                </div>
                <div className="upload-text">Upload</div>
                <div className="upload-instructions">
                  *Upload 1 image with quality not exceeding 5MB.
                </div>
              </div>
            </div>
            
            {/* Hidden file input */}
            <input
              id="image-file-input"
              type="file"
              accept="image/*"
              onChange={handleImageFileSelect}
              style={{ display: 'none' }}
            />
            
            {/* Error Message */}
            {uploadError && (
              <div className="upload-error">
                <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                {uploadError}
              </div>
            )}
            
            {/* Image Preview */}
            {uploadedImages.length > 0 && (
              <div className="image-previews">
                <h6>Uploaded Image</h6>
                <div className="single-image-preview">
                  <div className="image-preview-item">
                    <img src={uploadedImages[0].preview} alt="Preview" />
                    <button 
                      className="remove-image-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage()
                      }}
                    >
                      ×
                    </button>
                    <div className="image-info">
                      <div className="image-name">{uploadedImages[0].name}</div>
                      <div className="image-size">{(uploadedImages[0].size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelImageUpload}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmImageUpload}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sticky Price Bar */}
      <div className="sticky-price-bar">
        <Container>
          <div className="price-bar-content">
            <div className="price-breakdown">
              <div className="price-item">
                <span className="price-label">Product Price:</span>
                <span className="price-value">£{product?.pricing?.priceForIndividual || product?.pricing?.actualBasePrice || 75}</span>
              </div>
              
              {customization.haircut && customization.haircut !== 'None' && (
                <div className="price-item">
                  <span className="price-label">Haircut:</span>
                  <span className="price-value">+£35.49</span>
                </div>
              )}
              
              {customization.cutToSize && (
                <div className="price-item">
                  <span className="price-label">Cut to Size:</span>
                  <span className="price-value">+£13.31</span>
                </div>
              )}
            </div>
            
            <div className="total-price-section">
              <div className="total-price">
                <span className="total-label">Total Price:</span>
                <span className="total-value">£{calculateTotalPrice().toFixed(2)}</span>
              </div>
              
              <Button 
                variant="primary" 
                size="lg" 
                className="add-to-cart-sticky-btn"
                onClick={handleAddToCart}
                disabled={addToCartLoading || cartLoading}
              >
                {addToCartLoading || cartLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default ProductDetail
