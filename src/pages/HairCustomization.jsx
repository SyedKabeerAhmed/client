import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert, Accordion, Modal, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faCheck, faRuler, faPalette, faCut, faUpload, faInfoCircle, faChevronDown, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import './HairCustomization.css'

const HairCustomization = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  
  // State for customization options
  const [customization, setCustomization] = useState({
    baseSize: '',
    baseDesign: '',
    frontContour: '',
    baseMaterialColor: '',
    hairLength: '',
    curlAndWave: '',
    hairDirection: '',
    highlight: '',
    highlightType: '', // Base option name for pricing
    rootColor: '',
    rootColorType: '', // Base option name for pricing
    greyHair: '',
    greyHairType: '', // Base option name for pricing
    bleachKnots: '',
    hairType: '',
    hairDensity: '',
    hairColor: '',
    haircut: '',
    productionTime: '',
    pickup: '',
    additionalInformation: ''
  })

  // Accordion state
  const [activeAccordion, setActiveAccordion] = useState('baseSize')

  // Modal states for Topper selection
  const [showTopperModal, setShowTopperModal] = useState(false)
  const [topperStep, setTopperStep] = useState('width') // 'width' or 'length'
  const [selectedWidth, setSelectedWidth] = useState('')
  const [selectedLength, setSelectedLength] = useState('')

  // Modal states for Full Cap selection
  const [showFullCapModal, setShowFullCapModal] = useState(false)
  const [fullCapStep, setFullCapStep] = useState(1) // 1-7 steps
  const [fullCapMeasurements, setFullCapMeasurements] = useState({
    circumference: '',
    frontToNape: '',
    earToEarForehead: '',
    templeToTemple: '',
    earToEarTop: '',
    templeToTempleBack: '',
    napeOfNeck: ''
  })

  // Modal states for Frontal selection
  const [showFrontalModal, setShowFrontalModal] = useState(false)
  const [frontalStep, setFrontalStep] = useState('width') // 'width' or 'length'
  const [selectedFrontalWidth, setSelectedFrontalWidth] = useState('')
  const [selectedFrontalLength, setSelectedFrontalLength] = useState('')

  // Modal state for View All Base Design
  const [showViewAllModal, setShowViewAllModal] = useState(false)
  const [selectedBaseDesign, setSelectedBaseDesign] = useState('')

  // Modal states for Template selection
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')

  // Modal states for Curl and Wave selection
  const [showCurlWaveModal, setShowCurlWaveModal] = useState(false)
  const [selectedGender, setSelectedGender] = useState('men')
  const [selectedCurlWave, setSelectedCurlWave] = useState('')

  // Modal states for Highlight selection
  const [showHighlightModal, setShowHighlightModal] = useState(false)
  const [selectedHighlightType, setSelectedHighlightType] = useState('')
  const [selectedHighlightColor, setSelectedHighlightColor] = useState('')
  const [highlightPreviewImage, setHighlightPreviewImage] = useState('')
  const [highlightModalStep, setHighlightModalStep] = useState(1) // 1 for color selection, 2 for proportion
  const [selectedProportion, setSelectedProportion] = useState('')
  
  // Spot/Dot modal states (7 steps)
  const [spotDotSelections, setSpotDotSelections] = useState({
    front: '',
    top: '',
    crown: '',
    back: '',
    temple: '',
    sides: ''
  })

  // Modal states for Root Color selection
  const [showRootColorModal, setShowRootColorModal] = useState(false)
  const [selectedRootColor, setSelectedRootColor] = useState('')
  const [rootColorPreviewImage, setRootColorPreviewImage] = useState('')
  const [rootColorModalStep, setRootColorModalStep] = useState(1) // 1 for color selection, 2 for length
  const [selectedRootColorLength, setSelectedRootColorLength] = useState('')

  // Modal states for Gray Color selection (7 steps)
  const [showGrayColorModal, setShowGrayColorModal] = useState(false)
  const [grayColorModalStep, setGrayColorModalStep] = useState(1)
  const [grayColorSelections, setGrayColorSelections] = useState({
    front: '',
    top: '',
    crown: '',
    back: '',
    temples: '',
    sides: ''
  })
  const [selectedGrayHairType, setSelectedGrayHairType] = useState('')

  // Modal states for Hair_Color selection
  const [showHairColorModal, setShowHairColorModal] = useState(false)
  const [selectedHairColorType, setSelectedHairColorType] = useState('')
  const [selectedHairColorGender, setSelectedHairColorGender] = useState('women')
  const [selectedHairColor, setSelectedHairColor] = useState('')
  const [hairColorPreviewImage, setHairColorPreviewImage] = useState('')

  // Modal states for Haircut selection
  const [selectedHaircutGender, setSelectedHaircutGender] = useState('')
  const [showChooseHairstyleModal, setShowChooseHairstyleModal] = useState(false)
  const [showOrderHairLengthModal, setShowOrderHairLengthModal] = useState(false)
  const [showUploadHairstyleModal, setShowUploadHairstyleModal] = useState(false)
  const [haircutModalGender, setHaircutModalGender] = useState('men')
  const [selectedHairstyle, setSelectedHairstyle] = useState(null)
  
  // Hair length stepper states (from ProductDetail)
  const [currentStep, setCurrentStep] = useState(0)
  const [hairLengths, setHairLengths] = useState({
    front: '',
    top: '',
    crown: '',
    back: '',
    temples: '',
    sides: ''
  })
  
  // Image upload states (from ProductDetail)
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploadError, setUploadError] = useState('')

  // Pricing state
  const [basePrice, setBasePrice] = useState(329.00)
  const [additionalCosts, setAdditionalCosts] = useState({
    baseSize: 0,
    hairLength: 0,
    haircut: 0,
    bleachKnots: 0,
    hairType: 0,
    hairDensity: 0,
    highlight: 0,
    rootColor: 0,
    grayColor: 0,
    productionTime: 0,
    pickup: 0
  })
  
  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false)

  // Base size options
  const baseSizeOptions = [
    { id: 'topper', name: 'Topper', description: 'Partial coverage for crown area', price: 0, image: '/src/assets/images/image_108.png' },
    { id: 'fullcap', name: 'Full Cap', description: 'Complete head coverage', price: 150, image: '/src/assets/images/image_108.png' },
    { id: 'frontal', name: 'Frontal', description: 'Front hairline coverage', price: 0, image: '/src/assets/images/image_108.png' },
    { id: 'template', name: 'Match My Template', description: 'Use your existing template', price: 0, image: '/src/assets/images/image_108.png' }
  ]

  // Template size options
  const templateOptions = [
    {
      id: 'partial',
      name: 'Partial',
      description: '(size ≤ 7"x10", or area ≤ 70 square inches)',
      price: 0
    },
    {
      id: 'regular',
      name: 'Regular',
      description: '(7"x10" < size ≤ 8"x10", or 70 square inches < area ≤ 80 square inches)',
      price: 40
    },
    {
      id: 'oversize',
      name: 'Oversize',
      description: '(8"x10" < size ≤ 10"x10", or 80 square inches < area ≤ 100 square inches)',
      price: 90
    },
    {
      id: 'fullcap',
      name: 'Full cap',
      description: '(size > 10"x10", or area > 100 square inches)',
      price: 150
    }
  ]

  // Base design options
  const baseDesignOptions = [
    { 
      id: 'sendOldUnit', 
      name: 'Send Old Unit', 
      description: 'I will send in an old unit for your reference', 
      price: 0,
      image: '/src/assets/images/send-old-unit.png'
    },
    { 
      id: 'ownDesign', 
      name: 'Own Design/Instructions', 
      description: 'I have my own base design and I will type in instructions', 
      price: 0,
      image: '/src/assets/images/own-design.png'
    },
    { 
      id: 'lastOrder', 
      name: 'Last Order', 
      description: 'The same as my last order', 
      price: 0,
      image: '/src/assets/images/last-order.png'
    },
    { 
      id: 'customSuperSkin', 
      name: 'Custom SuperSkin', 
      description: 'Custom SuperSkin(S1) | 0.08mm thin skin all over', 
      price: 0,
      image: '/src/assets/images/custom-superskin.png'
    },
    { 
      id: 'viewAllDesigns', 
      name: 'View All Designs', 
      description: 'View all base design', 
      price: 0,
      image: '/src/assets/images/view-all-designs.png',
      hasArrow: true
    }
  ]

  // Front contour options
  const frontContourOptions = [
    { 
      id: 'template', 
      name: 'Match the front contour of template or sample piece on file a', 
      description: '', 
      price: 0,
      icon: 'template'
    },
    { 
      id: 'send-template', 
      name: 'Match the template I\'ll send in', 
      description: '', 
      price: 0,
      icon: 'send'
    },
    { 
      id: 'aa', 
      name: 'AA (V peak shape)', 
      description: '', 
      price: 0,
      icon: 'aa'
    },
    { 
      id: 'a', 
      name: 'A (between AA and CC)', 
      description: '', 
      price: 0,
      icon: 'a'
    },
    { 
      id: 'standard', 
      name: 'Standard (Between A and CC)', 
      description: '', 
      price: 0,
      icon: 'standard'
    },
    { 
      id: 'c', 
      name: 'C (round shape)', 
      description: '', 
      price: 0,
      icon: 'c'
    },
    { 
      id: 'c-straight', 
      name: 'C (nearly straight shape)', 
      description: '', 
      price: 0,
      icon: 'c-straight'
    }
  ]

  // Base material color options
  const baseMaterialColorOptions = [
    { 
      id: 'same-as-last', 
      name: 'Same as my last order', 
      description: '', 
      price: 0,
      color: 'none'
    },
    { 
      id: 'flesh', 
      name: 'Flesh', 
      description: '', 
      price: 0,
      color: '#F5DEB3'
    },
    { 
      id: 'light-brown', 
      name: 'Light Brown', 
      description: '', 
      price: 0,
      color: '#D2B48C'
    },
    { 
      id: 'brown', 
      name: 'Brown', 
      description: '', 
      price: 0,
      color: '#8B4513'
    },
    { 
      id: 'black', 
      name: 'Black', 
      description: '', 
      price: 0,
      color: '#2F2F2F'
    }
  ]


  // Hair length options
  const hairLengthOptions = [
    { id: '6inch', name: '6 inch (15.24 cm)', price: 0 },
    { id: '8inch', name: '8 inch (20.32 cm)', price: 40 },
    { id: '10inch', name: '10 inch (25.40 cm)', price: 70 },
    { id: '12inch', name: '12 inch (30.48 cm)', price: 100 },
    { id: '14inch', name: '14 inch (35.56 cm)', price: 150 },
    { id: '16inch', name: '16 inch (40.64 cm)', price: 200 },
    { id: '18inch', name: '18 inch (45.72 cm)', price: 260 },
    { id: '20inch', name: '20 inch (50.80 cm)', price: 360 }
  ]

  // Curl and wave options for men
  const curlAndWaveOptionsMen = [
    { id: 'same-as-last', name: 'Same as My Last Order', price: 0, icon: 'none' },
    { id: 'same-as-sample', name: 'Same as the hair sample I\'ll send in', price: 0, icon: 'send' },
    { id: 'natural-straight', name: 'Natural straight', price: 0, icon: 'straight' },
    { id: '36mm-body-wave', name: '36mm body wave', price: 0, icon: 'body-wave' },
    { id: '32mm-slight-wave', name: '32mm slight wave', price: 0, icon: 'slight-wave' },
    { id: '25mm-medium-wave', name: '25mm medium wave', price: 0, icon: 'medium-wave' },
    { id: '20mm-tight-wave', name: '20mm tight wave', price: 0, icon: 'tight-wave' },
    { id: '15mm-loose-curl', name: '15mm loose curl', price: 0, icon: 'loose-curl' },
    { id: '10mm-tight-curl', name: '10mm tight curl', price: 0, icon: 'tight-curl' },
    { id: '4mm-medium-afro', name: '4mm medium Afro', price: 30, icon: 'medium-afro' },
    { id: '6mm-loose-afro', name: '6mm loose Afro', price: 30, icon: 'loose-afro' },
    { id: '8mm-extra-loose-afro', name: '8mm extra-loose Afro', price: 30, icon: 'extra-loose-afro' }
  ]

  // Curl and wave options for women
  const curlAndWaveOptionsWomen = [
    { id: 'same-as-last', name: 'Same as My Last Order', price: 0, icon: 'none' },
    { id: 'same-as-sample', name: 'Same as the hair sample I\'ll send in', price: 0, icon: 'send' },
    { id: 'silky-straight', name: 'silky straight', price: 0, icon: 'silky-straight' },
    { id: 'natural-straight', name: 'natural straight', price: 0, icon: 'natural-straight' },
    { id: 'body-wave', name: 'body wave', price: 0, icon: 'body-wave' },
    { id: 'deep-wave', name: 'deep wave', price: 0, icon: 'deep-wave' },
    { id: 'water-wave', name: 'water wave', price: 0, icon: 'water-wave' },
    { id: 'loose-curl', name: 'loose curl', price: 0, icon: 'loose-curl' }
  ]

  // Get current options based on selected gender
  const getCurrentCurlWaveOptions = () => {
    return selectedGender === 'men' ? curlAndWaveOptionsMen : curlAndWaveOptionsWomen
  }

  // Hair direction options
  const hairDirectionOptions = [
    { id: 'same-as-last', name: 'Same as my last order', price: 0, icon: 'none' },
    { id: 'same-as-old-unit', name: 'Same as the old unit I\'ll send in', price: 0, icon: 'send' },
    { id: 'free-style', name: 'Free style', price: 0, icon: 'free-style' },
    { id: 'left-parting', name: 'Left parting', price: 0, icon: 'left-parting' },
    { id: 'right-parting', name: 'Right parting', price: 0, icon: 'right-parting' },
    { id: 'center-parting', name: 'Center parting', price: 0, icon: 'center-parting' },
    { id: 'left-break', name: 'Left break', price: 0, icon: 'left-break' },
    { id: 'right-break', name: 'Right break', price: 0, icon: 'right-break' },
    { id: 'left-crown', name: 'Left crown', price: 0, icon: 'left-crown' },
    { id: 'right-crown', name: 'Right crown', price: 0, icon: 'right-crown' },
    { id: 'center-crown', name: 'Center crown', price: 0, icon: 'center-crown' },
    { id: 'brush-back', name: 'Brush back', price: 0, icon: 'brush-back' }
  ]

  // Highlight options
  const highlightOptions = [
    { id: 'evenly-blended', name: 'Evenly Blended', price: 0, hasModal: true, image: '/src/assets/images/highlight-evenly-blended.png' },
    { id: 'spot-dot', name: 'Spot/Dot', price: 15, hasModal: true, image: '/src/assets/images/highlight-spot-dot.png' },
    { id: 'match-sample', name: 'Match the sample I\'ll send in', price: 0, hasModal: false },
    { id: 'same-as-last', name: 'Same as my last order', price: 0, hasModal: false },
    { id: 'none', name: 'None', price: 0, hasModal: false }
  ]

  // Root color options
  const rootColorOptions = [
    { id: 'select-root-color', name: 'Select Root Color', price: 15, hasModal: true },
    { id: 'none', name: 'None', price: 0, hasModal: false }
  ]

  // Gray color options
  const grayColorOptions = [
    { id: 'want-gray-hair', name: 'I want Gray Hair', price: 20, hasModal: true },
    { id: 'no-gray-hair', name: 'No Need Grey Hair', price: 0, hasModal: false }
  ]

  // Bleach knots options
  const bleachKnotsOptions = [
    { id: 'no-bleach-knots', name: 'No need bleach knots', price: 0, hasModal: false },
    { id: 'bleach-front', name: 'Bleach knots at front', price: 0, hasModal: false },
    { id: 'bleach-all-over', name: 'Bleach knots all over', price: 19, hasModal: false },
    { id: 'bleach-parting', name: 'Bleach knots on parting', price: 0, hasModal: false },
    { id: 'bleach-crown', name: 'Bleach knots on crown', price: 0, hasModal: false }
  ]

  // Hair types options
  const hairTypesOptions = [
    { 
      id: 'remy-hair', 
      name: 'Remy hair', 
      description: '(selected premium hair, suitable for all styling needs)',
      price: 159.60, 
      image: '/src/assets/images/customize/remy_hair.png',
      hasModal: false 
    },
    { 
      id: 'european-hair', 
      name: 'European hair', 
      description: '(fine, thin & soft, 7" and up is not available)',
      price: 159.60, 
      image: '/src/assets/images/customize/european_hair.png',
      hasModal: false 
    },
    { 
      id: 'synthetic-hair', 
      name: 'Synthetic hair', 
      description: '',
      price: 0, 
      image: '/src/assets/images/customize/synthetic_hair.png',
      hasModal: false 
    }
  ]

  // Hair density options
  const hairDensityOptions = [
    { 
      id: 'same-as-last-order', 
      name: 'Same as my last order', 
      price: 0, 
      image: '/src/assets/images/paper-airplane-icon.png',
      isCircular: false,
      hasModal: false 
    },
    { 
      id: 'same-as-old-unit', 
      name: 'Same as the old unit I\'ll send in', 
      price: 0, 
      image: '/src/assets/images/paper-airplane-icon.png',
      isCircular: false,
      hasModal: false 
    },
    { 
      id: 'extra-light-60', 
      name: 'Extra light 60%', 
      price: 0, 
      image: '/src/assets/images/hair-density-60.png',
      isCircular: true,
      hasModal: false 
    },
    { 
      id: 'light-80', 
      name: 'Light 80%', 
      price: 0, 
      image: '/src/assets/images/hair-density-80.png',
      isCircular: true,
      hasModal: false 
    },
    { 
      id: 'light-to-medium-light-90', 
      name: 'Light to Medium-light 90%', 
      price: 0, 
      image: '/src/assets/images/hair-density-90.png',
      isCircular: true,
      hasModal: false 
    },
    { 
      id: 'medium-light-100', 
      name: 'Medium light 100%', 
      price: 0, 
      image: '/src/assets/images/hair-density-100.png',
      isCircular: true,
      hasModal: false 
    },
    { 
      id: 'medium-light-to-medium-110', 
      name: 'Medium-light to Medium 110%', 
      price: 0, 
      image: '/src/assets/images/hair-density-110.png',
      isCircular: true,
      hasModal: false 
    },
    { 
      id: 'medium-120', 
      name: 'Medium 120%', 
      price: 0, 
      image: '/src/assets/images/hair-density-120.png',
      isCircular: true,
      hasModal: false 
    },
    { 
      id: 'medium-to-medium-heavy-130', 
      name: 'Medium to Medium-heavy 130%', 
      price: 0, 
      image: '/src/assets/images/hair-density-130.png',
      isCircular: true,
      hasModal: false 
    },
    { 
      id: 'medium-heavy-140', 
      name: 'Medium heavy 140%', 
      price: 59.85, 
      image: '/src/assets/images/hair-density-140.png',
      isCircular: true,
      hasModal: false 
    }
  ]

  // Hair color options
  const hairColorOptions = [
    { 
      id: 'men', 
      name: 'Men', 
      price: 0, 
      hasModal: true 
    },
    { 
      id: 'women', 
      name: 'Women', 
      price: 0, 
      hasModal: true 
    },
    { 
      id: 'match-hair-sample', 
      name: 'Match my hair sample', 
      price: 0, 
      hasModal: false 
    }
  ]

  // Haircut options for accordion
  const haircutMainOptions = [
    { id: 'choose-hairstyles', name: 'Choose your hairstyles', price: 35.49, hasModal: true, modalType: 'choose' },
    { id: 'order-hair-length', name: 'I want to order my hair length', price: 35.49, hasModal: true, modalType: 'length' },
    { id: 'send-email', name: "I'll send email to hair store", price: 35.49, hasModal: false },
    { id: 'upload-images', name: 'Upload hairstyle images you want', price: 35.49, hasModal: true, modalType: 'upload' },
    { id: 'none', name: 'None', price: 0, hasModal: false }
  ]

  // Hair length stepper data (from ProductDetail)
  const hairLengthSteps = [
    { key: 'front', label: 'Front', number: 1 },
    { key: 'top', label: 'Top', number: 2 },
    { key: 'crown', label: 'Crown', number: 3 },
    { key: 'back', label: 'Back', number: 4 },
    { key: 'temples', label: 'Temples', number: '5 & 6' },
    { key: 'sides', label: 'Sides', number: '7 & 8' }
  ]

  // Generate length options based on gender
  const generateLengthOptions = (start, end, increment) => {
    const options = []
    for (let i = start; i <= end; i += increment) {
      const inch = i.toFixed(2)
      const cm = (i * 2.54).toFixed(2)
      options.push({ inch, cm })
    }
    return options
  }

  const lengthOptionsByGender = {
    men: generateLengthOptions(1.00, 5.00, 0.25),
    women: generateLengthOptions(4.00, 20.00, 0.25)
  }

  // Get current length options based on selected gender
  const lengthOptions = lengthOptionsByGender[haircutModalGender] || lengthOptionsByGender.men

  // Hairstyle options for men and women
  const hairstyleOptions = {
    men: [
      {
        id: 'LD0011',
        code: 'LD0011',
        name: 'Modern textured cut with layered styling',
        description: 'Maintains natural appearance with 1.25-1.75 inches of side hair.',
        images: [
          '/src/assets/images/Haircut_Images/LD0011/LD0011-1.png',
          '/src/assets/images/Haircut_Images/LD0011/LD0011-2.png',
          '/src/assets/images/Haircut_Images/LD0011/LD0011-3.png',
          '/src/assets/images/Haircut_Images/LD0011/LD0011-4.png',
          '/src/assets/images/Haircut_Images/LD0011/LD0011-5.png'
        ]
      },
      {
        id: 'LD0026',
        code: 'LD0026',
        name: 'Contemporary fade style with gradual transition',
        description: 'Requires 0.75-1.5 inches of natural hair for smooth blending.',
        images: [
          '/src/assets/images/Haircut_Images/LD0026/LD0026-1.png',
          '/src/assets/images/Haircut_Images/LD0026/LD0026-2.png',
          '/src/assets/images/Haircut_Images/LD0026/LD0026-3.png',
          '/src/assets/images/Haircut_Images/LD0026/LD0026-4.png'
        ]
      },
      {
        id: 'LD0035',
        code: 'LD0035',
        name: 'Stylish tapered cut with refined edges',
        description: 'Optimal with 1-1.5 inches of natural hair at the perimeter.',
        images: [
          '/src/assets/images/Haircut_Images/LD0035/LD0035-1.png',
          '/src/assets/images/Haircut_Images/LD0035/LD0035-2.png',
          '/src/assets/images/Haircut_Images/LD0035/LD0035-3.png',
          '/src/assets/images/Haircut_Images/LD0035/LD0035-4.png'
        ]
      }
    ],
    women: [
      {
        id: 'LD0037',
        code: 'LD0037',
        name: 'Elegant layered style with volume',
        description: 'Perfect for natural blending with 2-3 inches of hair.',
        images: [
          '/src/assets/images/Haircut_Images/LD0037/LD0037-1.png',
          '/src/assets/images/Haircut_Images/LD0037/LD0037-2.png',
          '/src/assets/images/Haircut_Images/LD0037/LD0037-3.png',
          '/src/assets/images/Haircut_Images/LD0037/LD0037-4.png'
        ]
      },
      {
        id: 'LD0039',
        code: 'LD0039',
        name: 'Soft waves with natural movement',
        description: 'Requires 2.5-3.5 inches for seamless integration.',
        images: [
          '/src/assets/images/Haircut_Images/LD0039/LD0039-1.png',
          '/src/assets/images/Haircut_Images/LD0039/LD0039-2.png',
          '/src/assets/images/Haircut_Images/LD0039/LD0039-3.png',
          '/src/assets/images/Haircut_Images/LD0039/LD0039-4.png',
          '/src/assets/images/Haircut_Images/LD0039/LD0039-5.png'
        ]
      },
      {
        id: 'LD0042',
        code: 'LD0042',
        name: 'Classic bob with sleek finish',
        description: 'Best with 1.5-2.5 inches of natural hair.',
        images: [
          '/src/assets/images/Haircut_Images/LD0042/LD0042-1.png',
          '/src/assets/images/Haircut_Images/LD0042/LD0042-2.png',
          '/src/assets/images/Haircut_Images/LD0042/LD0042-3.png',
          '/src/assets/images/Haircut_Images/LD0042/LD0042-4.png'
        ]
      }
    ]
  }

  // Hair color options with gender-specific colors
  const hairColorColorOptions = {
    men: {
      dark: [
        { id: '1', name: '1', smallImage: '/src/assets/images/Hair_Color/all_colors/1.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/1.png' },
        { id: '1A', name: '1A', smallImage: '/src/assets/images/Hair_Color/all_colors/1A.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/1A.png' },
        { id: '1B', name: '1B', smallImage: '/src/assets/images/Hair_Color/all_colors/1B.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/1B.png' }
      ],
      brown: [
        { id: '2', name: '2', smallImage: '/src/assets/images/Hair_Color/all_colors/2.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/2.png' },
        { id: '3', name: '3', smallImage: '/src/assets/images/Hair_Color/all_colors/3.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/3.png' },
        { id: '4', name: '4', smallImage: '/src/assets/images/Hair_Color/all_colors/4.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/4.png' },
        { id: '4R', name: '4R', smallImage: '/src/assets/images/Hair_Color/all_colors/4R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/4R.png' },
        { id: '4ASH', name: '4ASH', smallImage: '/src/assets/images/Hair_Color/all_colors/4ASH.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/4ASH .png' },
        { id: '5', name: '5', smallImage: '/src/assets/images/Hair_Color/all_colors/5.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/5.png' },
        { id: '5R', name: '5R', smallImage: '/src/assets/images/Hair_Color/all_colors/5R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/5R.png' },
        { id: '6', name: '6', smallImage: '/src/assets/images/Hair_Color/all_colors/6.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/6.png' },
        { id: '6R', name: '6R', smallImage: '/src/assets/images/Hair_Color/all_colors/6R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/6R.png' },
        { id: '6RD', name: '6RD', smallImage: '/src/assets/images/Hair_Color/all_colors/6RD.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/6RD.png' },
        { id: '7', name: '7', smallImage: '/src/assets/images/Hair_Color/all_colors/7.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/7.png' },
        { id: '7ASH', name: '7ASH', smallImage: '/src/assets/images/Hair_Color/all_colors/7ASH.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/7ASH.png' },
        { id: '8R', name: '8R', smallImage: '/src/assets/images/Hair_Color/all_colors/8R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/8R.png' },
        { id: '10R', name: '10R', smallImage: '/src/assets/images/Hair_Color/all_colors/10R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/10R.png' }
      ],
      blonde: [
        { id: '12R', name: '12R', smallImage: '/src/assets/images/Hair_Color/all_colors/12R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/12R.png' },
        { id: '17', name: '17', smallImage: '/src/assets/images/Hair_Color/all_colors/17.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/17.png' },
        { id: '17R', name: '17R', smallImage: '/src/assets/images/Hair_Color/all_colors/17R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/17R.png' },
        { id: '18', name: '18', smallImage: '/src/assets/images/Hair_Color/all_colors/18.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/18.png' },
        { id: '20', name: '20', smallImage: '/src/assets/images/Hair_Color/all_colors/20.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/20.png' },
        { id: '20R', name: '20R', smallImage: '/src/assets/images/Hair_Color/all_colors/20R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/20R.png' },
        { id: '22R', name: '22R', smallImage: '/src/assets/images/Hair_Color/all_colors/22R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/22R.png' },
        { id: '22', name: '22', smallImage: '/src/assets/images/Hair_Color/all_colors/22.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/22.png' },
        { id: '30', name: '30', smallImage: '/src/assets/images/Hair_Color/all_colors/30.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/30.png' }
      ],
      gray: [
        { id: '60', name: '60', smallImage: '/src/assets/images/Hair_Color/all_colors/60.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/60.png' },
      ]
    },
    women: {
      dark: [
        { id: '1', name: '1', smallImage: '/src/assets/images/Hair_Color/all_colors/1.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/1.png' },
        { id: '1B', name: '1B', smallImage: '/src/assets/images/Hair_Color/all_colors/1B.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/1B.png' }
      ],
      brown: [
        { id: '2', name: '2', smallImage: '/src/assets/images/Hair_Color/all_colors/2.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/2.png' },
        { id: '4', name: '4', smallImage: '/src/assets/images/Hair_Color/all_colors/4.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/4.png' },
        { id: '6', name: '6', smallImage: '/src/assets/images/Hair_Color/all_colors/6.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/6.png' },
        { id: '8', name: '8', smallImage: '/src/assets/images/Hair_Color/all_colors/8.jpg', bigImage: '/src/assets/images/Hair_Color/all_colors_big/8.jpg' },
        { id: '9', name: '9', smallImage: '/src/assets/images/Hair_Color/all_colors/9.jpg', bigImage: '/src/assets/images/Hair_Color/all_colors_big/9.jpg' },
        { id: '10', name: '10', smallImage: '/src/assets/images/Hair_Color/all_colors/10.jpg', bigImage: '/src/assets/images/Hair_Color/all_colors_big/10.jpg' },
        ],
      blonde: [
        { id: '12R', name: '12R', smallImage: '/src/assets/images/Hair_Color/all_colors/12R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/12R.png' },
        { id: '17', name: '17', smallImage: '/src/assets/images/Hair_Color/all_colors/17.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/17.png' },
        { id: '17R', name: '17R', smallImage: '/src/assets/images/Hair_Color/all_colors/17R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/17R.png' },
        { id: '18', name: '18', smallImage: '/src/assets/images/Hair_Color/all_colors/18.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/18.png' },
        { id: '20', name: '20', smallImage: '/src/assets/images/Hair_Color/all_colors/20.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/20.png' },
        { id: '20R', name: '20R', smallImage: '/src/assets/images/Hair_Color/all_colors/20R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/20R.png' },
        { id: '22R', name: '22R', smallImage: '/src/assets/images/Hair_Color/all_colors/22R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/22R.png' },
        { id: '22', name: '22', smallImage: '/src/assets/images/Hair_Color/all_colors/22.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/22.png' },
        { id: '30', name: '30', smallImage: '/src/assets/images/Hair_Color/all_colors/30.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/30.png' }
      ],
      reddish: [
        { id: '99J', name: '99J', smallImage: '/src/assets/images/Hair_Color/all_colors/99J.jpg', bigImage: '/src/assets/images/Hair_Color/all_colors_big/99J.jpg' },
        { id: '118', name: '118', smallImage: '/src/assets/images/Hair_Color/all_colors/118.jpg', bigImage: '/src/assets/images/Hair_Color/all_colors_big/118.jpg' },
        { id: '140', name: '140', smallImage: '/src/assets/images/Hair_Color/all_colors/140.jpg', bigImage: '/src/assets/images/Hair_Color/all_colors_big/140.jpg' },
        { id: '144', name: '144', smallImage: '/src/assets/images/Hair_Color/all_colors/144.jpg', bigImage: '/src/assets/images/Hair_Color/all_colors_big/144.jpg' }
      ]
    }
  }

  // Proportion options for evenly blended (0% to 100% in 5% increments)
  const proportionOptions = [
    { id: '0', name: '0%', value: 0 },
    { id: '5', name: '5%', value: 5 },
    { id: '10', name: '10%', value: 10 },
    { id: '15', name: '15%', value: 15 },
    { id: '20', name: '20%', value: 20 },
    { id: '25', name: '25%', value: 25 },
    { id: '30', name: '30%', value: 30 },
    { id: '35', name: '35%', value: 35 },
    { id: '40', name: '40%', value: 40 },
    { id: '45', name: '45%', value: 45 },
    { id: '50', name: '50%', value: 50 },
    { id: '55', name: '55%', value: 55 },
    { id: '60', name: '60%', value: 60 },
    { id: '65', name: '65%', value: 65 },
    { id: '70', name: '70%', value: 70 },
    { id: '75', name: '75%', value: 75 },
    { id: '80', name: '80%', value: 80 },
    { id: '85', name: '85%', value: 85 },
    { id: '90', name: '90%', value: 90 },
    { id: '95', name: '95%', value: 95 },
    { id: '100', name: '100%', value: 100 }
  ]

  // Spot/Dot area selection options (0% to 100% in 5% increments)
  const spotDotAreaOptions = [
    { id: '0', name: '0%', value: 0 },
    { id: '5', name: '5%', value: 5 },
    { id: '10', name: '10%', value: 10 },
    { id: '15', name: '15%', value: 15 },
    { id: '20', name: '20%', value: 20 },
    { id: '25', name: '25%', value: 25 },
    { id: '30', name: '30%', value: 30 },
    { id: '35', name: '35%', value: 35 },
    { id: '40', name: '40%', value: 40 },
    { id: '45', name: '45%', value: 45 },
    { id: '50', name: '50%', value: 50 },
    { id: '55', name: '55%', value: 55 },
    { id: '60', name: '60%', value: 60 },
    { id: '65', name: '65%', value: 65 },
    { id: '70', name: '70%', value: 70 },
    { id: '75', name: '75%', value: 75 },
    { id: '80', name: '80%', value: 80 },
    { id: '85', name: '85%', value: 85 },
    { id: '90', name: '90%', value: 90 },
    { id: '95', name: '95%', value: 95 },
    { id: '100', name: '100%', value: 100 }
  ]

  // Spot/Dot step titles
  const spotDotStepTitles = {
    1: 'Color Selection',
    2: 'Front Selection',
    3: 'Top Selection',
    4: 'Crown Selection',
    5: 'Back Selection',
    6: 'Temple Selection',
    7: 'Sides Selection'
  }

  // Root color length options (1 inch to 8 inches)
  const rootColorLengthOptions = [
    { id: '1', name: '1 inch (2.54 cm)', value: 1 },
    { id: '1.5', name: '1.5 inch (3.81 cm)', value: 1.5 },
    { id: '2', name: '2 inch (5.08 cm)', value: 2 },
    { id: '3', name: '3 inch (7.62 cm)', value: 3 },
    { id: '4', name: '4 inch (10.16 cm)', value: 4 },
    { id: '5', name: '5 inch (12.70 cm)', value: 5 },
    { id: '6', name: '6 inch (15.24 cm)', value: 6 },
    { id: '7', name: '7 inch (17.78 cm)', value: 7 },
    { id: '8', name: '8 inch (20.32 cm)', value: 8 }
  ]

  // Gray color area options (0% to 100% in 5% increments)
  const grayColorAreaOptions = [
    { id: '0', name: '0%', value: 0 },
    { id: '5', name: '5%', value: 5 },
    { id: '10', name: '10%', value: 10 },
    { id: '15', name: '15%', value: 15 },
    { id: '20', name: '20%', value: 20 },
    { id: '25', name: '25%', value: 25 },
    { id: '30', name: '30%', value: 30 },
    { id: '35', name: '35%', value: 35 },
    { id: '40', name: '40%', value: 40 },
    { id: '45', name: '45%', value: 45 },
    { id: '50', name: '50%', value: 50 },
    { id: '55', name: '55%', value: 55 },
    { id: '60', name: '60%', value: 60 },
    { id: '65', name: '65%', value: 65 },
    { id: '70', name: '70%', value: 70 },
    { id: '75', name: '75%', value: 75 },
    { id: '80', name: '80%', value: 80 },
    { id: '85', name: '85%', value: 85 },
    { id: '90', name: '90%', value: 90 },
    { id: '95', name: '95%', value: 95 },
    { id: '100', name: '100%', value: 100 }
  ]

  // Gray color step titles
  const grayColorStepTitles = {
    1: 'Front',
    2: 'Top',
    3: 'Crown',
    4: 'Back',
    5: 'Temples',
    6: 'Sides',
    7: 'Which type of grey hair you want?'
  }

  // Gray hair type options
  const grayHairTypeOptions = [
    { 
      id: 'human-gray-hair', 
      name: 'Human grey hair', 
      price: 20, 
      image: '/src/assets/images/customize/human_grey_hair.png',
      description: 'Natural human grey hair'
    },
    { 
      id: 'synthetic-gray-hair', 
      name: 'Synthetic grey hair (best choice)', 
      price: 0, 
      image: '/src/assets/images/customize/synthetic_grey_hair.png',
      description: 'High-quality synthetic grey hair'
    }
  ]

  // Root color options (reusing highlight color options)
  const rootColorColorOptions = {
    dark: [
      { id: '1', name: '1', smallImage: '/src/assets/images/Hair_Color/all_colors/1.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/1.png' },
      { id: '1A', name: '1A', smallImage: '/src/assets/images/Hair_Color/all_colors/1A.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/1A.png' },
      { id: '1B', name: '1B', smallImage: '/src/assets/images/Hair_Color/all_colors/1B.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/1B.png' }
    ],
    brown: [
      { id: '2', name: '2', smallImage: '/src/assets/images/Hair_Color/all_colors/2.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/2.png' },
      { id: '3', name: '3', smallImage: '/src/assets/images/Hair_Color/all_colors/3.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/3.png' },
      { id: '4', name: '4', smallImage: '/src/assets/images/Hair_Color/all_colors/4.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/4.png' },
      { id: '4ASH', name: '4ASH', smallImage: '/src/assets/images/Hair_Color/all_colors/4ASH.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/4ASH.png' },
      { id: '4R', name: '4R', smallImage: '/src/assets/images/Hair_Color/all_colors/4R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/4R.png' },
      { id: '5', name: '5', smallImage: '/src/assets/images/Hair_Color/all_colors/5.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/5.png' },
      { id: '5R', name: '5R', smallImage: '/src/assets/images/Hair_Color/all_colors/5R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/5R.png' },
      { id: '6', name: '6', smallImage: '/src/assets/images/Hair_Color/all_colors/6.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/6.png' },
      { id: '6R', name: '6R', smallImage: '/src/assets/images/Hair_Color/all_colors/6R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/6R.png' },
      { id: '6RD', name: '6RD', smallImage: '/src/assets/images/Hair_Color/all_colors/6RD.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/6RD.png' },
      { id: '7', name: '7', smallImage: '/src/assets/images/Hair_Color/all_colors/7.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/7.png' },
      { id: '7ASH', name: '7ASH', smallImage: '/src/assets/images/Hair_Color/all_colors/7ASH.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/7ASH.png' },
      { id: '8R', name: '8R', smallImage: '/src/assets/images/Hair_Color/all_colors/8R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/8R.png' },
      { id: '10R', name: '10R', smallImage: '/src/assets/images/Hair_Color/all_colors/10R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/10R.png' }
    ],
    blonde: [
      { id: '12R', name: '12R', smallImage: '/src/assets/images/Hair_Color/all_colors/12R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/12R.png' },
      { id: '17', name: '17', smallImage: '/src/assets/images/Hair_Color/all_colors/17.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/17.png' },
      { id: '17R', name: '17R', smallImage: '/src/assets/images/Hair_Color/all_colors/17R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/17R.png' },
      { id: '18', name: '18', smallImage: '/src/assets/images/Hair_Color/all_colors/18.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/18.png' },
      { id: '20', name: '20', smallImage: '/src/assets/images/Hair_Color/all_colors/20.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/20.png' },
      { id: '20R', name: '20R', smallImage: '/src/assets/images/Hair_Color/all_colors/20R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/20R.png' },
      { id: '22', name: '22', smallImage: '/src/assets/images/Hair_Color/all_colors/22.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/22.png' },
      { id: '22R', name: '22R', smallImage: '/src/assets/images/Hair_Color/all_colors/22R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/22R.png' },
      { id: '30', name: '30', smallImage: '/src/assets/images/Hair_Color/all_colors/30.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/30.png' }
    ],
    gray: [
      { id: '60', name: '60', smallImage: '/src/assets/images/Hair_Color/all_colors/60.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/60.png' }
    ]
  }

  // Highlight color options using small images for circles and big images for preview
  const highlightColorOptions = {
    dark: [
      { id: '1', name: '1', smallImage: '/src/assets/images/Hair_Color/all_colors/1.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/1.png' },
      { id: '1A', name: '1A', smallImage: '/src/assets/images/Hair_Color/all_colors/1A.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/1A.png' },
      { id: '1B', name: '1B', smallImage: '/src/assets/images/Hair_Color/all_colors/1B.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/1B.png' }
    ],
    brown: [
      { id: '2', name: '2', smallImage: '/src/assets/images/Hair_Color/all_colors/2.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/2.png' },
      { id: '3', name: '3', smallImage: '/src/assets/images/Hair_Color/all_colors/3.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/3.png' },
      { id: '4', name: '4', smallImage: '/src/assets/images/Hair_Color/all_colors/4.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/4.png' },
      { id: '4ASH', name: '4ASH', smallImage: '/src/assets/images/Hair_Color/all_colors/4ASH.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/4ASH.png' },
      { id: '4R', name: '4R', smallImage: '/src/assets/images/Hair_Color/all_colors/4R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/4R.png' },
      { id: '5', name: '5', smallImage: '/src/assets/images/Hair_Color/all_colors/5.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/5.png' },
      { id: '5R', name: '5R', smallImage: '/src/assets/images/Hair_Color/all_colors/5R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/5R.png' },
      { id: '6', name: '6', smallImage: '/src/assets/images/Hair_Color/all_colors/6.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/6.png' },
      { id: '6R', name: '6R', smallImage: '/src/assets/images/Hair_Color/all_colors/6R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/6R.png' },
      { id: '6RD', name: '6RD', smallImage: '/src/assets/images/Hair_Color/all_colors/6RD.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/6RD.png' },
      { id: '7', name: '7', smallImage: '/src/assets/images/Hair_Color/all_colors/7.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/7.png' },
      { id: '7ASH', name: '7ASH', smallImage: '/src/assets/images/Hair_Color/all_colors/7ASH.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/7ASH.png' },
      { id: '8R', name: '8R', smallImage: '/src/assets/images/Hair_Color/all_colors/8R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/8R.png' },
      { id: '10R', name: '10R', smallImage: '/src/assets/images/Hair_Color/all_colors/10R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/10R.png' }
    ],
    blonde: [
      { id: '12R', name: '12R', smallImage: '/src/assets/images/Hair_Color/all_colors/12R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/12R.png' },
      { id: '17', name: '17', smallImage: '/src/assets/images/Hair_Color/all_colors/17.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/17.png' },
      { id: '17R', name: '17R', smallImage: '/src/assets/images/Hair_Color/all_colors/17R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/17R.png' },
      { id: '18', name: '18', smallImage: '/src/assets/images/Hair_Color/all_colors/18.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/18.png' },
      { id: '20', name: '20', smallImage: '/src/assets/images/Hair_Color/all_colors/20.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/20.png' },
      { id: '20R', name: '20R', smallImage: '/src/assets/images/Hair_Color/all_colors/20R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/20R.png' },
      { id: '22', name: '22', smallImage: '/src/assets/images/Hair_Color/all_colors/22.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/22.png' },
      { id: '22R', name: '22R', smallImage: '/src/assets/images/Hair_Color/all_colors/22R.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/22R.png' },
      { id: '30', name: '30', smallImage: '/src/assets/images/Hair_Color/all_colors/30.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/30.png' }
    ],
    gray: [
      { id: '60', name: '60', smallImage: '/src/assets/images/Hair_Color/all_colors/60.png', bigImage: '/src/assets/images/Hair_Color/all_colors_big/60.png' }
    ]
  }

  // Haircut options
  const haircutOptions = [
    { id: 'mens', name: "Men's Haircut", price: 0 },
    { id: 'womens', name: "Women's Haircut", price: 0 },
    { id: 'custom', name: 'Custom Cut', price: 30 }
  ]

  // Generate measurement options from 0.00 to 14.00 inch with 0.25 increments
  const generateMeasurementOptions = () => {
    const options = []
    for (let i = 0; i <= 56; i++) { // 0.00 to 14.00 with 0.25 increments = 57 options
      const inch = (i * 0.25).toFixed(2)
      const cm = (parseFloat(inch) * 2.54).toFixed(2)
      options.push({
        inch: inch,
        cm: cm,
        id: `measurement_${i}`
      })
    }
    return options
  }

  const measurementOptions = generateMeasurementOptions()

  // Generate measurement options for Full Cap steps
  const generateFullCapMeasurementOptions = (startInch, endInch) => {
    const options = []
    const start = Math.round(startInch * 4) // Convert to quarters
    const end = Math.round(endInch * 4)
    
    for (let i = start; i <= end; i++) {
      const inch = (i * 0.25).toFixed(2)
      const cm = (parseFloat(inch) * 2.54).toFixed(2)
      options.push({
        inch: inch,
        cm: cm,
        id: `fullcap_${startInch}_${i}`
      })
    }
    return options
  }

  // Full Cap measurement options for each step
  const fullCapMeasurementOptions = {
    circumference: generateFullCapMeasurementOptions(18.00, 25.00), // 18.00 to 25.00
    frontToNape: generateFullCapMeasurementOptions(10.00, 15.00), // 10.00 to 15.00
    earToEarForehead: generateFullCapMeasurementOptions(9.00, 15.00), // 9.00 to 15.00
    templeToTemple: generateFullCapMeasurementOptions(10.00, 19.00), // 10.00 to 19.00
    earToEarTop: generateFullCapMeasurementOptions(10.00, 16.00), // 10.00 to 16.00
    templeToTempleBack: generateFullCapMeasurementOptions(2.00, 20.00), // 2.00 to 20.00
    napeOfNeck: generateFullCapMeasurementOptions(2.00, 7.00) // 2.00 to 7.00
  }

  // Full Cap step configuration
  const fullCapSteps = [
    { id: 1, name: 'Circumference', key: 'circumference' },
    { id: 2, name: 'Front to nape', key: 'frontToNape' },
    { id: 3, name: 'Ear to ear across forehead', key: 'earToEarForehead' },
    { id: 4, name: 'Temple to temple', key: 'templeToTemple' },
    { id: 5, name: 'Ear to ear over top', key: 'earToEarTop' },
    { id: 6, name: 'Temple to temple round back', key: 'templeToTempleBack' },
    { id: 7, name: 'Nape of neck', key: 'napeOfNeck' }
  ]

  // Generate Frontal measurement options
  const generateFrontalMeasurementOptions = (startInch, endInch) => {
    const options = []
    const start = Math.round(startInch * 4) // Convert to quarters
    const end = Math.round(endInch * 4)
    
    for (let i = start; i <= end; i++) {
      const inch = (i * 0.25).toFixed(2)
      const cm = (parseFloat(inch) * 2.54).toFixed(2)
      options.push({
        inch: inch,
        cm: cm,
        id: `frontal_${startInch}_${i}`
      })
    }
    return options
  }

  // Frontal measurement options
  const frontalMeasurementOptions = {
    width: generateFrontalMeasurementOptions(0.00, 8.00), // 0.00 to 8.00 inch
    length: generateFrontalMeasurementOptions(0.00, 10.00) // 0.00 to 10.00 inch
  }

  // View All Base Design options
  const viewAllBaseDesignOptions = [
    {
      id: 'lastOrder',
      name: 'The same as my last order',
      description: '',
      image: '/src/assets/images/customize/ic_same_as_my_last_order.webp'
    },
    {
      id: 'superskin',
      name: 'Custom SuperSkin(S1)',
      description: '0.08mm thin skin all over',
      image: '/src/assets/images/customize/base-designs/s1-thin-skin-all-over2_(1).webp'
    },
    {
      id: 'elite',
      name: 'Custom Elite (L15)',
      description: 'French lace with PU edge on sides & back',
      image: '/src/assets/images/customize/base-designs/l15-french-lace-with-pu-edge2.webp'
    },
    {
      id: 'champion',
      name: 'Custom Champion(S7)',
      description: 'French lace all over',
      image: '/src/assets/images/customize/base-designs/s7-french-lace-all-over2.webp'
    },
    {
      id: 'orion',
      name: 'Custom Orion(S4)',
      description: 'Super fine mono with 1" thin skin perimeter and 1/4" lace front',
      image: '/src/assets/images/customize/base-designs/s4-super-fine-mono-with-pu-perimeter2.webp'
    },
    {
      id: 'combo',
      name: 'Custom Combo(S15)',
      description: 'Thin skin with 1/4" French lace front',
      image: '/src/assets/images/customize/base-designs/s15-thin-skin-with-french-lace-front2.webp'
    },
    {
      id: 'chronos',
      name: 'Custom Chronos (L16)',
      description: 'Fine welded mono with PU edge on side & back',
      image: '/src/assets/images/customize/base-designs/l16-fine-welded-mono-with-pu-edge2.webp'
    },
    {
      id: 'atlas',
      name: 'Custom Atlas(S3)',
      description: 'Fine Mono with PU edge on side&back and thin skin front',
      image: '/src/assets/images/customize/base-designs/s3-fine-mono-with-pu-perimeter2.webp'
    },
    {
      id: 'cosmos',
      name: 'Custom Cosmos(S2)',
      description: 'Fine welded mono all over',
      image: '/src/assets/images/customize/base-designs/s2-fine-welded-mono-lace-all-over2.webp'
    },
    {
      id: 'poseidon',
      name: 'Custom Poseidon(S12)',
      description: 'Thin skin with fine welded mono lace front (zia zaa',
      image: '/src/assets/images/customize/base-designs/s12-thin-skin-with-mono-lace-front2.webp'
    }
  ]

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = basePrice
    total += additionalCosts.baseSize
    total += additionalCosts.hairLength
    total += additionalCosts.haircut
    total += additionalCosts.bleachKnots
    total += additionalCosts.hairType
    total += additionalCosts.hairDensity
    total += additionalCosts.highlight
    total += additionalCosts.rootColor
    total += additionalCosts.grayColor
    total += additionalCosts.productionTime
    total += additionalCosts.pickup
    return total
  }
  
  // Update additional costs based on selections
  useEffect(() => {
    let newCosts = { ...additionalCosts }
    
    // Bleach Knots pricing
    const bleachKnotsOption = bleachKnotsOptions.find(opt => customization.bleachKnots === opt.name)
    newCosts.bleachKnots = bleachKnotsOption ? bleachKnotsOption.price : 0
    
    // Hair Type pricing - match against the actual option names
    const hairTypeOption = hairTypesOptions.find(opt => customization.hairType === opt.name)
    newCosts.hairType = hairTypeOption ? hairTypeOption.price : 0
    
    // Hair Density pricing - match against the actual option names
    const hairDensityOption = hairDensityOptions.find(opt => customization.hairDensity === opt.name)
    newCosts.hairDensity = hairDensityOption ? hairDensityOption.price : 0
    
    // Hair Length pricing
    const hairLengthOption = hairLengthOptions.find(opt => customization.hairLength === opt.name)
    newCosts.hairLength = hairLengthOption ? hairLengthOption.price : 0
    
    // Haircut pricing
    const haircutOption = haircutMainOptions.find(opt => customization.haircut === opt.name)
    newCosts.haircut = haircutOption ? haircutOption.price : 0
    
    // Highlight pricing - use highlightType for matching
    const highlightOption = highlightOptions.find(opt => customization.highlightType === opt.name)
    newCosts.highlight = highlightOption ? highlightOption.price : 0
    
    // Root Color pricing - use rootColorType for matching
    const rootColorOption = rootColorOptions.find(opt => customization.rootColorType === opt.name)
    newCosts.rootColor = rootColorOption ? rootColorOption.price : 0
    
    // Gray Color pricing - use greyHairType for matching
    const grayColorOption = grayColorOptions.find(opt => customization.greyHairType === opt.name)
    newCosts.grayColor = grayColorOption ? grayColorOption.price : 0
    
    // Production Time pricing
    if (customization.productionTime === 'Rush service 6-7 weeks') {
      newCosts.productionTime = 59.00
    } else {
      newCosts.productionTime = 0
    }
    
    // Pickup pricing
    if (customization.pickup === 'Pick-up') {
      newCosts.pickup = 39.00
    } else {
      newCosts.pickup = 0
    }
    
    setAdditionalCosts(newCosts)
  }, [customization.bleachKnots, customization.hairType, customization.hairDensity, customization.hairLength, customization.haircut, customization.highlightType, customization.rootColorType, customization.greyHairType, customization.productionTime, customization.pickup])

  // Handle customization changes
  const handleCustomizationChange = (field, value) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle base size selection
  const handleBaseSizeSelection = (size) => {
    if (size.id === 'topper') {
      setShowTopperModal(true)
      setTopperStep('width')
      setSelectedWidth('')
      setSelectedLength('')
    } else if (size.id === 'fullcap') {
      setShowFullCapModal(true)
      setFullCapStep(1)
      setFullCapMeasurements({
        circumference: '',
        frontToNape: '',
        earToEarForehead: '',
        templeToTemple: '',
        earToEarTop: '',
        templeToTempleBack: '',
        napeOfNeck: ''
      })
    } else if (size.id === 'frontal') {
      setShowFrontalModal(true)
      setFrontalStep('width')
      setSelectedFrontalWidth('')
      setSelectedFrontalLength('')
    } else if (size.id === 'template') {
      setShowTemplateModal(true)
      setSelectedTemplate('')
    } else {
      handleCustomizationChange('baseSize', size.name)
      setAdditionalCosts(prev => ({
        ...prev,
        baseSize: size.price
      }))
    }
  }

  // Handle base design selection
  const handleBaseDesignSelection = (design) => {
    if (design.id === 'viewAllDesigns') {
      setShowViewAllModal(true)
    } else {
    handleCustomizationChange('baseDesign', design.name)
    }
  }

  // Handle View All Base Design selection
  const handleViewAllBaseDesignSelection = (design) => {
    setSelectedBaseDesign(design)
  }

  // Handle View All Base Design confirmation
  const handleViewAllBaseDesignConfirm = () => {
    if (selectedBaseDesign) {
      handleCustomizationChange('baseDesign', selectedBaseDesign.name)
      setShowViewAllModal(false)
      setSelectedBaseDesign('')
    }
  }

  // Handle View All Base Design modal close
  const handleViewAllBaseDesignClose = () => {
    setShowViewAllModal(false)
    setSelectedBaseDesign('')
  }

  // Handle front contour selection
  const handleFrontContourSelection = (contour) => {
    handleCustomizationChange('frontContour', contour.name)
  }

  // Handle base material color selection
  const handleBaseMaterialColorSelection = (color) => {
    handleCustomizationChange('baseMaterialColor', color.name)
  }

  // Handle hair length selection from accordion
  const handleHairLengthAccordionSelection = (length) => {
    handleCustomizationChange('hairLength', length.name)
    setAdditionalCosts(prev => ({
      ...prev,
      hairLength: length.price
    }))
  }

  // Handle curl and wave selection
  const handleCurlAndWaveSelection = (wave) => {
    handleCustomizationChange('curlAndWave', wave.name)
  }

  // Handle hair direction selection
  const handleHairDirectionSelection = (direction) => {
    handleCustomizationChange('hairDirection', direction.name)
  }

  // Handle haircut selection
  const handleHaircutSelection = (cut) => {
    handleCustomizationChange('haircut', cut.name)
    setAdditionalCosts(prev => ({
      ...prev,
      haircut: cut.price
    }))
  }


  // Handle topper modal width selection
  const handleTopperWidthSelection = (measurement) => {
    setSelectedWidth(`${measurement.inch} inch - ${measurement.cm} cm`)
  }

  // Handle topper modal length selection
  const handleTopperLengthSelection = (measurement) => {
    setSelectedLength(`${measurement.inch} inch - ${measurement.cm} cm`)
  }

  // Handle topper modal next step
  const handleTopperNextStep = () => {
    if (topperStep === 'width') {
      setTopperStep('length')
    }
  }

  // Handle topper modal back step
  const handleTopperBackStep = () => {
    if (topperStep === 'length') {
      setTopperStep('width')
    }
  }

  // Handle topper modal confirm
  const handleTopperConfirm = () => {
    const topperValue = `Topper (${selectedWidth}, ${selectedLength})`
    handleCustomizationChange('baseSize', topperValue)
    setShowTopperModal(false)
    setTopperStep('width')
    setSelectedWidth('')
    setSelectedLength('')
  }

  // Handle topper modal close
  const handleTopperClose = () => {
    setShowTopperModal(false)
    setTopperStep('width')
    setSelectedWidth('')
    setSelectedLength('')
  }

  // Handle Full Cap modal measurement selection
  const handleFullCapMeasurementSelection = (measurement) => {
    const currentStepKey = fullCapSteps[fullCapStep - 1].key
    setFullCapMeasurements(prev => ({
      ...prev,
      [currentStepKey]: `${measurement.inch} inch - ${measurement.cm} cm`
    }))
  }

  // Handle Full Cap modal next step
  const handleFullCapNextStep = () => {
    if (fullCapStep < 7) {
      setFullCapStep(fullCapStep + 1)
    }
  }

  // Handle Full Cap modal back step
  const handleFullCapBackStep = () => {
    if (fullCapStep > 1) {
      setFullCapStep(fullCapStep - 1)
    }
  }

  // Handle Full Cap modal confirm
  const handleFullCapConfirm = () => {
    const fullCapValue = `Full Cap (${Object.values(fullCapMeasurements).join(', ')})`
    handleCustomizationChange('baseSize', fullCapValue)
    setAdditionalCosts(prev => ({
      ...prev,
      baseSize: 150 // Full Cap price
    }))
    setShowFullCapModal(false)
    setFullCapStep(1)
    setFullCapMeasurements({
      circumference: '',
      frontToNape: '',
      earToEarForehead: '',
      templeToTemple: '',
      earToEarTop: '',
      templeToTempleBack: '',
      napeOfNeck: ''
    })
  }

  // Handle Full Cap modal close
  const handleFullCapClose = () => {
    setShowFullCapModal(false)
    setFullCapStep(1)
    setFullCapMeasurements({
      circumference: '',
      frontToNape: '',
      earToEarForehead: '',
      templeToTemple: '',
      earToEarTop: '',
      templeToTempleBack: '',
      napeOfNeck: ''
    })
  }

  // Handle Frontal modal width selection
  const handleFrontalWidthSelection = (measurement) => {
    setSelectedFrontalWidth(`${measurement.inch} inch - ${measurement.cm} cm`)
  }

  // Handle Frontal modal length selection
  const handleFrontalLengthSelection = (measurement) => {
    setSelectedFrontalLength(`${measurement.inch} inch - ${measurement.cm} cm`)
  }

  // Handle Frontal modal next step
  const handleFrontalNextStep = () => {
    if (frontalStep === 'width') {
      setFrontalStep('length')
    }
  }

  // Handle Frontal modal back step
  const handleFrontalBackStep = () => {
    if (frontalStep === 'length') {
      setFrontalStep('width')
    }
  }

  // Handle Frontal modal confirm
  const handleFrontalConfirm = () => {
    const frontalValue = `Frontal (${selectedFrontalWidth}, ${selectedFrontalLength})`
    handleCustomizationChange('baseSize', frontalValue)
    setShowFrontalModal(false)
    setFrontalStep('width')
    setSelectedFrontalWidth('')
    setSelectedFrontalLength('')
  }

  // Handle Frontal modal close
  const handleFrontalClose = () => {
    setShowFrontalModal(false)
    setFrontalStep('width')
    setSelectedFrontalWidth('')
    setSelectedFrontalLength('')
  }

  // Handle Template modal selection
  const handleTemplateSelection = (template) => {
    setSelectedTemplate(template)
  }

  // Handle Template modal confirmation
  const handleTemplateConfirm = () => {
    const templateValue = `Template: ${selectedTemplate.name}`
    handleCustomizationChange('baseSize', templateValue)
    setAdditionalCosts(prev => ({
      ...prev,
      baseSize: selectedTemplate.price
    }))
    setShowTemplateModal(false)
    setSelectedTemplate('')
  }

  // Handle Template modal close
  const handleTemplateClose = () => {
    setShowTemplateModal(false)
    setSelectedTemplate('')
  }

  // Handle Curl and Wave modal
  const handleCurlWaveSelection = (option) => {
    setSelectedCurlWave(option)
  }

  const handleCurlWaveConfirm = () => {
    if (selectedCurlWave) {
      setCustomization(prev => ({
        ...prev,
        curlAndWave: selectedCurlWave.name
      }))
    }
    setShowCurlWaveModal(false)
    setSelectedCurlWave('')
  }

  const handleCurlWaveClose = () => {
    setShowCurlWaveModal(false)
    setSelectedCurlWave('')
  }

  // Handle Highlight selection
  const handleHighlightSelection = (option) => {
    if (option.hasModal) {
      setSelectedHighlightType(option)
      setShowHighlightModal(true)
      setHighlightModalStep(1) // Start with step 1 (color selection)
    } else {
      setCustomization(prev => ({
        ...prev,
        highlight: option.name,
        highlightType: option.name // Store the base option name for pricing
      }))
    }
  }

  const handleHighlightColorSelection = (color) => {
    setSelectedHighlightColor(color)
    setHighlightPreviewImage(color.bigImage)
  }

  const handleHighlightNextStep = () => {
    if (selectedHighlightType.id === 'evenly-blended' && selectedHighlightColor) {
      setHighlightModalStep(2) // Go to proportion step for evenly blended
    } else if (selectedHighlightType.id === 'spot-dot' && selectedHighlightColor) {
      setHighlightModalStep(2) // Go to step 2 for spot/dot
    } else {
      // For other types, confirm directly
      handleHighlightConfirm()
    }
  }

  const handleHighlightBackStep = () => {
    setHighlightModalStep(1)
  }

  const handleProportionSelection = (proportion) => {
    setSelectedProportion(proportion)
  }

  const handleSpotDotAreaSelection = (area, percentage) => {
    setSpotDotSelections(prev => ({
      ...prev,
      [area]: percentage
    }))
  }

  const handleSpotDotNextStep = () => {
    if (highlightModalStep < 7) {
      setHighlightModalStep(prev => prev + 1)
    }
  }

  const handleSpotDotBackStep = () => {
    if (highlightModalStep > 1) {
      setHighlightModalStep(prev => prev - 1)
    }
  }

  const handleHighlightConfirm = () => {
    if (selectedHighlightType && selectedHighlightColor) {
      let highlightText = `${selectedHighlightType.name} - ${selectedHighlightColor.name}`
      if (selectedHighlightType.id === 'evenly-blended' && selectedProportion) {
        highlightText += ` (${selectedProportion.name})`
      } else if (selectedHighlightType.id === 'spot-dot') {
        const selections = Object.entries(spotDotSelections)
          .filter(([_, value]) => value !== '')
          .map(([area, value]) => `${area}: ${value.name}`)
          .join(', ')
        if (selections) {
          highlightText += ` (${selections})`
        }
      }
      setCustomization(prev => ({
        ...prev,
        highlight: highlightText,
        highlightType: selectedHighlightType.name // Store the base option name for pricing
      }))
    }
    setShowHighlightModal(false)
    setSelectedHighlightType('')
    setSelectedHighlightColor('')
    setHighlightPreviewImage('')
    setHighlightModalStep(1)
    setSelectedProportion('')
    setSpotDotSelections({
      front: '',
      top: '',
      crown: '',
      back: '',
      temple: '',
      sides: ''
    })
  }

  const handleHighlightClose = () => {
    setShowHighlightModal(false)
    setSelectedHighlightType('')
    setSelectedHighlightColor('')
    setHighlightPreviewImage('')
    setHighlightModalStep(1)
    setSelectedProportion('')
    setSpotDotSelections({
      front: '',
      top: '',
      crown: '',
      back: '',
      temple: '',
      sides: ''
    })
  }

  // Handle Root Color selection
  const handleRootColorSelection = (option) => {
    if (option.hasModal) {
      setShowRootColorModal(true)
      setRootColorModalStep(1) // Start with step 1 (color selection)
    } else {
      setCustomization(prev => ({
        ...prev,
        rootColor: option.name,
        rootColorType: option.name // Store the base option name for pricing
      }))
    }
  }

  const handleRootColorColorSelection = (color) => {
    setSelectedRootColor(color)
    setRootColorPreviewImage(color.bigImage)
  }

  const handleRootColorNextStep = () => {
    if (selectedRootColor) {
      setRootColorModalStep(2) // Go to length selection step
    }
  }

  const handleRootColorBackStep = () => {
    setRootColorModalStep(1)
  }

  const handleRootColorLengthSelection = (length) => {
    setSelectedRootColorLength(length)
  }

  const handleRootColorConfirm = () => {
    if (selectedRootColor && selectedRootColorLength) {
      const rootColorText = `${selectedRootColor.name} - ${selectedRootColorLength.name}`
      setCustomization(prev => ({
        ...prev,
        rootColor: rootColorText,
        rootColorType: 'Select Root Color' // Store the base option name for pricing
      }))
    }
    setShowRootColorModal(false)
    setSelectedRootColor('')
    setRootColorPreviewImage('')
    setRootColorModalStep(1)
    setSelectedRootColorLength('')
  }

  const handleRootColorClose = () => {
    setShowRootColorModal(false)
    setSelectedRootColor('')
    setRootColorPreviewImage('')
    setRootColorModalStep(1)
    setSelectedRootColorLength('')
  }

  // Handle Gray Color selection
  const handleGrayColorSelection = (option) => {
    if (option.hasModal) {
      setShowGrayColorModal(true)
      setGrayColorModalStep(1) // Start with step 1 (front)
    } else {
      setCustomization(prev => ({
        ...prev,
        greyHair: option.name,
        greyHairType: option.name // Store the base option name for pricing
      }))
    }
  }

  const handleGrayColorAreaSelection = (area, percentage) => {
    setGrayColorSelections(prev => ({
      ...prev,
      [area]: percentage
    }))
  }

  const handleGrayColorNextStep = () => {
    if (grayColorModalStep < 7) {
      setGrayColorModalStep(prev => prev + 1)
    }
  }

  const handleGrayColorBackStep = () => {
    if (grayColorModalStep > 1) {
      setGrayColorModalStep(prev => prev - 1)
    }
  }

  const handleGrayHairTypeSelection = (hairType) => {
    setSelectedGrayHairType(hairType)
  }

  const handleGrayColorConfirm = () => {
    if (selectedGrayHairType) {
      const selections = Object.entries(grayColorSelections)
        .filter(([_, value]) => value !== '')
        .map(([area, value]) => `${area}: ${value.name}`)
        .join(', ')
      
      let grayColorText = `${selectedGrayHairType.name}`
      if (selections) {
        grayColorText += ` (${selections})`
      }
      
      setCustomization(prev => ({
        ...prev,
        greyHair: grayColorText,
        greyHairType: 'I want Gray Hair' // Store the base option name for pricing
      }))
    }
    setShowGrayColorModal(false)
    setGrayColorModalStep(1)
    setGrayColorSelections({
      front: '',
      top: '',
      crown: '',
      back: '',
      temples: '',
      sides: ''
    })
    setSelectedGrayHairType('')
  }

  const handleGrayColorClose = () => {
    setShowGrayColorModal(false)
    setGrayColorModalStep(1)
    setGrayColorSelections({
      front: '',
      top: '',
      crown: '',
      back: '',
      temples: '',
      sides: ''
    })
    setSelectedGrayHairType('')
  }

  // Handle Bleach Knots selection
  const handleBleachKnotsSelection = (option) => {
    setCustomization(prev => ({
      ...prev,
      bleachKnots: option.name
    }))
  }

  // Handle Hair Types selection
  const handleHairTypesSelection = (option) => {
    setCustomization(prev => ({
      ...prev,
      hairType: option.name
    }))
  }

  // Handle Hair Density selection
  const handleHairDensitySelection = (option) => {
    setCustomization(prev => ({
      ...prev,
      hairDensity: option.name
    }))
  }

  // Handle Hair_Color selection
  const handleHairColorSelection = (option) => {
    if (option.hasModal) {
      setSelectedHairColorType(option.id)
      setShowHairColorModal(true)
    } else {
      setCustomization(prev => ({
        ...prev,
        hairColor: option.name
      }))
    }
  }

  const handleHairColorGenderChange = (gender) => {
    setSelectedHairColorGender(gender)
    // Reset selected color when switching gender
    setSelectedHairColor('')
    setHairColorPreviewImage('')
  }

  const handleHairColorColorSelection = (color) => {
    setSelectedHairColor(color)
    setHairColorPreviewImage(color.bigImage)
  }

  const handleHairColorConfirm = () => {
    if (selectedHairColor) {
      const hairColorText = `${selectedHairColor.name} ${selectedHairColorGender}`
      setCustomization(prev => ({
        ...prev,
        hairColor: hairColorText
      }))
    }
    setShowHairColorModal(false)
    setSelectedHairColorType('')
    setSelectedHairColor('')
    setHairColorPreviewImage('')
  }

  const handleHairColorClose = () => {
    setShowHairColorModal(false)
    setSelectedHairColorType('')
    setSelectedHairColor('')
    setHairColorPreviewImage('')
  }

  // Handle Haircut Gender Selection
  const handleHaircutGenderSelection = (gender) => {
    setSelectedHaircutGender(gender)
    setHaircutModalGender(gender)
  }

  // Handle Haircut Main Option Selection
  const handleHaircutMainOptionSelection = (option) => {
    // If no gender selected, default to the current haircutModalGender (defaults to 'men')
    if (!selectedHaircutGender) {
      setSelectedHaircutGender(haircutModalGender)
    }

    if (option.hasModal) {
      if (option.modalType === 'choose') {
        setShowChooseHairstyleModal(true)
      } else if (option.modalType === 'length') {
        // Initialize hair lengths with default values based on gender
        const defaultLength = haircutModalGender === 'men' ? '1.00' : '4.00'
        setHairLengths({
          front: defaultLength,
          top: defaultLength,
          crown: defaultLength,
          back: defaultLength,
          temples: defaultLength,
          sides: defaultLength
        })
        setShowOrderHairLengthModal(true)
        setCurrentStep(0)
      } else if (option.modalType === 'upload') {
        setShowUploadHairstyleModal(true)
      }
    } else {
      setCustomization(prev => ({
        ...prev,
        haircut: option.name
      }))
    }
  }

  // Handle Choose Hairstyle Modal
  const handleHairstyleSelection = (cutType) => {
    setCustomization(prev => ({
      ...prev,
      haircut: cutType
    }))
  }

  const handleChooseHairstyleClose = () => {
    setShowChooseHairstyleModal(false)
  }

  // Handle Order Hair Length Modal (from ProductDetail)
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
    setCustomization(prev => ({
      ...prev,
      haircut: 'I want to order my hair length',
      hairLengths: hairLengths
    }))
    setShowOrderHairLengthModal(false)
    setCurrentStep(0)
  }

  const handleHairLengthCancel = () => {
    setShowOrderHairLengthModal(false)
    setCurrentStep(0)
    setHairLengths({
      front: '',
      top: '',
      crown: '',
      back: '',
      temples: '',
      sides: ''
    })
  }

  // Handle Upload Hairstyle Modal (from ProductDetail)
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
    
    if (uploadedImages.length > 0) {
      setUploadError('Only 1 image is allowed. Please remove the existing image first.')
      return
    }

    if (files.length > 1) {
      setUploadError('Please select only 1 image')
      return
    }

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB')
      return
    }

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
    
    setCustomization(prev => ({
      ...prev,
      haircut: 'Upload hairstyle images you want',
      uploadedImages: uploadedImages
    }))
    setShowUploadHairstyleModal(false)
  }

  const cancelImageUpload = () => {
    uploadedImages.forEach(image => URL.revokeObjectURL(image.preview))
    setUploadedImages([])
    setUploadError('')
    setShowUploadHairstyleModal(false)
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login to add items to cart')
      navigate('/login')
      return
    }

    // Validate that at least base size is selected
    if (!customization.baseSize) {
      alert('Please select a base size to continue')
      return
    }

    try {
      const totalPrice = calculateTotalPrice()
      
      // Send HairCustomization specific data
      const cartData = {
        productId: '507f1f77bcf86cd799439011', // Default product ID for HairCustomization
        quantity: 1,
        totalPrice,
        isCustomHairSystem: true, // Flag to identify HairCustomization
        customHairSystem: customization, // Complete customization data
        isCustomized: true
      }
      
      await addToCart(cartData)
      
      // Show success message
      alert('Custom hair system added to cart successfully!')
      
      // Navigate to cart page
      navigate('/cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart. Please try again.')
    }
  }

  return (
    <div className="hair-customization-page">
      <Container>
        {/* Header */}
        <div className="customization-header">
          <p
            className="breadcrumb"
           
          >
            Mono Hair Type / Neo Hair System
          </p>
          <h1>
            Customize A Hair System
          </h1>
          <div className="intro-text">
            <p>
              Enjoy free express delivery
            </p>
            <p>
              Want a hair system similar to/same as your previous orders? Visit your order history to quickly reorder a hair system similar to or the same as your previous orders. Changes to your order can be made from your shopping cart.
            </p>
          </div>
        </div>

        <Row className="g-4">
          {/* Customization Options */}
          <Col lg={8}>
            <Card className="customization-card">
              <Card.Body>
                <Accordion activeKey={activeAccordion} onSelect={(e) => setActiveAccordion(e)}>
                  
                  {/* Base Size */}
                  <Accordion.Item eventKey="baseSize">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Base Size</span>
                        {customization.baseSize && (
                          <span className="selected-option">{customization.baseSize}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="base-size-description">
                        <p>Please select your measurement options for us to determine the right way of measurement.</p>
                      </div>
                      <div className="base-size-options">
                        {baseSizeOptions.map((size) => (
                          <div 
                            key={size.id}
                            className={`base-size-option ${customization.baseSize === size.name ? 'selected' : ''}`}
                            onClick={() => handleBaseSizeSelection(size)}
                          >
                            <div className="size-icon">
                              <img src={size.image} alt={size.name} />
                            </div>
                            <div className="size-info">
                              <h6>{size.name}</h6>
                              {size.price > 0 && (
                                <span className="price">+${size.price}</span>
                              )}
                            </div>
                            <FontAwesomeIcon icon={faChevronRight} className="chevron-icon" />
                          </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  
                  {/* Base Design */}
                  <Accordion.Item eventKey="baseDesign">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Base Design</span>
                        {customization.baseDesign && (
                          <span className="selected-option">{customization.baseDesign}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="base-design-description">
                        <p>Which of the following base designs do you want for your hair system?</p>
                      </div>
                      <div className="base-design-options">
                          {baseDesignOptions.map((design) => (
                            <div 
                              key={design.id}
                            className={`base-design-option ${customization.baseDesign === design.name ? 'selected' : ''}`}
                              onClick={() => handleBaseDesignSelection(design)}
                            >
                            <div className="design-icon">
                                <img src={design.image} alt={design.name} />
                              </div>
                              <div className="design-info">
                                <h6>{design.name}</h6>
                                {design.price > 0 && (
                                  <span className="price">+${design.price}</span>
                                )}
                              </div>
                            <div className="design-arrow">
                              <FontAwesomeIcon icon={faChevronRight} />
                              </div>
                            </div>
                          ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Front Contour */}
                  <Accordion.Item eventKey="frontContour">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Front Contour</span>
                        {customization.frontContour && (
                          <span className="selected-option">{customization.frontContour}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="front-contour-description">
                        <p>Which of the following front contours do you want for your hair system?</p>
                      </div>
                      <div className="front-contour-options">
                        {frontContourOptions.map((contour) => (
                          <div 
                            key={contour.id}
                            className={`contour-option ${customization.frontContour === contour.name ? 'selected' : ''}`}
                            onClick={() => handleFrontContourSelection(contour)}
                          >
                            <div className="contour-icon">
                              {contour.icon === 'template' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#666" strokeWidth="2" fill="none"/>
                                  <path d="M14 2V8H20" stroke="#666" strokeWidth="2"/>
                                  <path d="M16 13H8" stroke="#666" strokeWidth="2"/>
                                  <path d="M16 17H8" stroke="#666" strokeWidth="2"/>
                                  <path d="M10 9H8" stroke="#666" strokeWidth="2"/>
                                </svg>
                              )}
                              {contour.icon === 'send' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M22 2L11 13" stroke="#666" strokeWidth="2"/>
                                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#666" strokeWidth="2" fill="none"/>
                                </svg>
                              )}
                              {(contour.icon === 'aa' || contour.icon === 'a' || contour.icon === 'standard' || contour.icon === 'c' || contour.icon === 'c-straight') && (
                                <div className="hairline-image">
                                  <svg width="60" height="40" viewBox="0 0 60 40">
                                    {contour.icon === 'aa' && (
                                      <path d="M10 20 L30 5 L50 20 L45 25 L35 15 L25 15 L15 25 Z" fill="#2c3e50" stroke="#34495e" strokeWidth="1"/>
                                    )}
                                    {contour.icon === 'a' && (
                                      <path d="M15 20 L30 8 L45 20 L40 25 L35 18 L25 18 L20 25 Z" fill="#2c3e50" stroke="#34495e" strokeWidth="1"/>
                                    )}
                                    {contour.icon === 'standard' && (
                                      <path d="M20 20 Q30 10 40 20 Q35 25 30 22 Q25 25 20 20" fill="#2c3e50" stroke="#34495e" strokeWidth="1"/>
                                    )}
                                    {contour.icon === 'c' && (
                                      <path d="M25 20 Q30 8 35 20 Q32 25 30 22 Q28 25 25 20" fill="#2c3e50" stroke="#34495e" strokeWidth="1"/>
                                    )}
                                    {contour.icon === 'c-straight' && (
                                      <path d="M20 20 L40 20 L38 25 L22 25 Z" fill="#2c3e50" stroke="#34495e" strokeWidth="1"/>
                                    )}
                                  </svg>
                              </div>
                              )}
                            </div>
                            <div className="contour-info">
                              <h6>{contour.name}</h6>
                        </div>
                          </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Base Material Color */}
                  <Accordion.Item eventKey="baseMaterialColor">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Base Material Color</span>
                        {customization.baseMaterialColor && (
                          <span className="selected-option">{customization.baseMaterialColor}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="base-material-color-description">
                        <p>Which of the following base material colors do you want for your hair system?</p>
                        </div>
                      <div className="base-material-color-options">
                        {baseMaterialColorOptions.map((color) => (
                          <div 
                            key={color.id}
                            className={`material-color-option ${customization.baseMaterialColor === color.name ? 'selected' : ''}`}
                            onClick={() => handleBaseMaterialColorSelection(color)}
                          >
                            <div className="color-circle" style={{ backgroundColor: color.color === 'none' ? 'transparent' : color.color, border: color.color === 'none' ? '2px solid #ccc' : 'none' }}>
                            </div>
                            <div className="color-info">
                              <h6>{color.name}</h6>
                            </div>
                            </div>
                          ))}
                        </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Hair Length */}
                  <Accordion.Item eventKey="hairLength">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Hair Length</span>
                        {customization.hairLength && (
                          <span className="selected-option">{customization.hairLength}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="hair-length-description">
                        <p>For length equal to or less than 6 inches, select 6 inches.</p>
                      </div>
                      <div className="hair-length-options">
                        {hairLengthOptions.map((length) => (
                          <div 
                            key={length.id}
                            className={`length-option ${customization.hairLength === length.name ? 'selected' : ''}`}
                            onClick={() => handleHairLengthAccordionSelection(length)}
                          >
                            <div className="length-info">
                              <span className="length-name">{length.name}</span>
                              {length.price > 0 && (
                                <span className="price">+${length.price}.00</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Curl and Wave */}
                  <Accordion.Item eventKey="curlAndWave">
                    <Accordion.Header onClick={() => setShowCurlWaveModal(true)}>
                      <div className="accordion-header-content">
                        <span>Curl and Wave</span>
                        {customization.curlAndWave && (
                          <span className="selected-option">{customization.curlAndWave}</span>
                        )}
                      </div>
                    </Accordion.Header>
                  </Accordion.Item>

                  {/* Hair Direction */}
                  <Accordion.Item eventKey="hairDirection">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Hair Direction</span>
                        {customization.hairDirection && (
                          <span className="selected-option">{customization.hairDirection}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="hair-direction-description">
                        <p>Which of the following hair directions do you want for your hair system?</p>
                        </div>
                      <div className="hair-direction-options">
                        {hairDirectionOptions.map((direction) => (
                          <div 
                            key={direction.id}
                            className={`direction-option ${customization.hairDirection === direction.name ? 'selected' : ''}`}
                            onClick={() => handleHairDirectionSelection(direction)}
                          >
                            <div className="direction-icon">
                              {direction.icon === 'send' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M22 2L11 13" stroke="#666" strokeWidth="2"/>
                                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#666" strokeWidth="2" fill="none"/>
                                </svg>
                              )}
                              {direction.icon !== 'none' && direction.icon !== 'send' && (
                                <div className="hair-direction-diagram">
                                  <svg width="40" height="40" viewBox="0 0 40 40">
                                    {direction.icon === 'free-style' && (
                                      <g>
                                        <circle cx="20" cy="20" r="18" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M8 15 Q12 10 16 15 Q20 8 24 15 Q28 10 32 15" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M8 25 Q12 20 16 25 Q20 18 24 25 Q28 20 32 25" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                      </g>
                                    )}
                                    {direction.icon === 'left-parting' && (
                                      <g>
                                        <circle cx="20" cy="20" r="18" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <line x1="20" y1="2" x2="20" y2="38" stroke="#2c3e50" strokeWidth="2"/>
                                        <path d="M2 20 Q10 15 20 20 Q30 15 38 20" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                      </g>
                                    )}
                                    {direction.icon === 'right-parting' && (
                                      <g>
                                        <circle cx="20" cy="20" r="18" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <line x1="20" y1="2" x2="20" y2="38" stroke="#2c3e50" strokeWidth="2"/>
                                        <path d="M2 20 Q10 25 20 20 Q30 25 38 20" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                      </g>
                                    )}
                                    {direction.icon === 'center-parting' && (
                                      <g>
                                        <circle cx="20" cy="20" r="18" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <line x1="20" y1="2" x2="20" y2="38" stroke="#2c3e50" strokeWidth="2"/>
                                        <path d="M2 20 Q10 15 20 20 Q30 15 38 20" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M2 20 Q10 25 20 20 Q30 25 38 20" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                      </g>
                                    )}
                                    {direction.icon === 'left-break' && (
                                      <g>
                                        <circle cx="20" cy="20" r="18" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M2 20 Q15 10 20 20 Q25 10 38 20" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M2 20 Q15 30 20 20 Q25 30 38 20" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                      </g>
                                    )}
                                    {direction.icon === 'right-break' && (
                                      <g>
                                        <circle cx="20" cy="20" r="18" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M2 20 Q15 30 20 20 Q25 30 38 20" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M2 20 Q15 10 20 20 Q25 10 38 20" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                      </g>
                                    )}
                                    {direction.icon === 'left-crown' && (
                                      <g>
                                        <circle cx="20" cy="20" r="18" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <circle cx="15" cy="15" r="8" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M7 15 Q15 7 23 15 Q15 23 7 15" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                      </g>
                                    )}
                                    {direction.icon === 'right-crown' && (
                                      <g>
                                        <circle cx="20" cy="20" r="18" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <circle cx="25" cy="15" r="8" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M17 15 Q25 7 33 15 Q25 23 17 15" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                      </g>
                                    )}
                                    {direction.icon === 'center-crown' && (
                                      <g>
                                        <circle cx="20" cy="20" r="18" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <circle cx="20" cy="15" r="8" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M12 15 Q20 7 28 15 Q20 23 12 15" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                      </g>
                                    )}
                                    {direction.icon === 'brush-back' && (
                                      <g>
                                        <circle cx="20" cy="20" r="18" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M2 20 L38 20" stroke="#2c3e50" strokeWidth="2"/>
                                        <path d="M2 20 Q10 15 20 20 Q30 15 38 20" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                        <path d="M2 20 Q10 25 20 20 Q30 25 38 20" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                                      </g>
                                    )}
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="direction-info">
                              <h6>{direction.name}</h6>
                            </div>
                            </div>
                          ))}
                        </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Highlight */}
                  <Accordion.Item eventKey="highlight">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Highlight</span>
                        {customization.highlight && (
                          <span className="selected-option">{customization.highlight}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="highlight-description">
                        <p>Do you want to add highlights to your hair system?</p>
                      </div>
                      <div className="highlight-options">
                        {highlightOptions.map((option) => (
                          <div 
                            key={option.id}
                            className={`highlight-option ${customization.highlight === option.name ? 'selected' : ''}`}
                            onClick={() => handleHighlightSelection(option)}
                          >
                            {option.hasModal && option.image && (
                              <div className="highlight-image">
                                <img src={option.image} alt={option.name} />
                              </div>
                            )}
                            <div className="highlight-info">
                              <h6>{option.name}</h6>
                              {option.price > 0 && (
                                <span className="price">+ ${option.price}.00</span>
                              )}
                            </div>
                            {option.hasModal && (
                              <div className="highlight-arrow">
                                <FontAwesomeIcon icon={faChevronRight} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Root Color */}
                  <Accordion.Item eventKey="rootColor">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Root Color</span>
                        {customization.rootColor && (
                          <span className="selected-option">{customization.rootColor}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="root-color-description">
                        <p>Do you want to add root color to your hair system?</p>
                      </div>
                      <div className="root-color-options">
                        {rootColorOptions.map((option) => (
                          <div 
                            key={option.id}
                            className={`root-color-option ${customization.rootColor === option.name ? 'selected' : ''}`}
                            onClick={() => handleRootColorSelection(option)}
                          >
                            <div className="root-color-info">
                              <h6>{option.name}</h6>
                              {option.price > 0 && (
                                <span className="price">+ ${option.price}.00</span>
                              )}
                            </div>
                            {option.hasModal && (
                              <div className="root-color-arrow">
                                <FontAwesomeIcon icon={faChevronRight} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Grey Hair */}
                  <Accordion.Item eventKey="greyHair">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Gray Color</span>
                        {customization.greyHair && (
                          <span className="selected-option">{customization.greyHair}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="gray-color-description">
                        <p>Do you want to add grey hair to your hair system?</p>
                      </div>
                      <div className="gray-color-options">
                        {grayColorOptions.map((option) => {
                          const isSelected = option.hasModal 
                            ? customization.greyHairType === option.name || customization.greyHairType === 'I want Gray Hair'
                            : customization.greyHair === option.name
                          return (
                          <div 
                            key={option.id}
                            className={`gray-color-option ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleGrayColorSelection(option)}
                          >
                            <div className="gray-color-info">
                              <h6>{option.name}</h6>
                              {option.price > 0 && (
                                <span className="price">+ ${option.price}.00</span>
                              )}
                              </div>
                            {option.hasModal && (
                              <div className="gray-color-arrow">
                                <FontAwesomeIcon icon={faChevronRight} />
                              </div>
                            )}
                            </div>
                          )
                        })}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Bleach Knots */}
                  <Accordion.Item eventKey="bleachKnots">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Bleach Knots</span>
                        {customization.bleachKnots && (
                          <span className="selected-option">{customization.bleachKnots}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="bleach-knots-description">
                        <p>What do you like to do with bleach knots?</p>
                      </div>
                      <div className="bleach-knots-options">
                        {bleachKnotsOptions.map((option) => (
                          <div 
                            key={option.id}
                            className={`bleach-knots-option ${customization.bleachKnots === option.name ? 'selected' : ''}`}
                            onClick={() => handleBleachKnotsSelection(option)}
                          >
                            <div className="bleach-knots-info">
                              <h6>{option.name}</h6>
                              {option.price > 0 && (
                                <span className="price">+ ${option.price}.00</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Hair Type */}
                  <Accordion.Item eventKey="hairType">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Hair Types</span>
                        {customization.hairType && (
                          <span className="selected-option">{customization.hairType}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="hair-types-description">
                        <p>Which type of hair do you want for your hair system?</p>
                      </div>
                      <div className="hair-types-options">
                        {hairTypesOptions.map((option) => (
                          <div 
                            key={option.id}
                            className={`hair-types-option ${customization.hairType === option.name ? 'selected' : ''}`}
                            onClick={() => handleHairTypesSelection(option)}
                          >
                            <div className="hair-types-image">
                              <img src={option.image} alt={option.name} />
                            </div>
                            <div className="hair-types-info">
                              <h6>{option.name}</h6>
                              {option.description && (
                                <p className="hair-types-description-text">{option.description}</p>
                              )}
                              {option.price > 0 && (
                                <span className="price">+ ${option.price}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Hair Density */}
                  <Accordion.Item eventKey="hairDensity">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Hair Density</span>
                        {customization.hairDensity && (
                          <span className="selected-option">{customization.hairDensity}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="hair-density-description">
                        <p>Which of the following hair densities do you want for your hair system?</p>
                      </div>
                      <div className="hair-density-options">
                        {hairDensityOptions.map((option) => (
                          <div 
                            key={option.id}
                            className={`hair-density-option ${customization.hairDensity === option.name ? 'selected' : ''}`}
                            onClick={() => handleHairDensitySelection(option)}
                          >
                            <div className={`hair-density-image ${option.isCircular ? 'circular' : 'square'}`}>
                              <img src={option.image} alt={option.name} />
                            </div>
                            <div className="hair-density-info">
                              <h6>{option.name}</h6>
                              {option.price > 0 && (
                                <span className="price">+ ${option.price}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

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
                      <div className="hair-color-options">
                        {hairColorOptions.map((option) => (
                          <div 
                            key={option.id}
                            className={`hair-color-option ${customization.hairColor === option.name ? 'selected' : ''}`}
                            onClick={() => handleHairColorSelection(option)}
                          >
                            <h6>{option.name}</h6>
                        </div>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Men's / Women Haircut */}
                  <Accordion.Item eventKey="haircut">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>Haircut</span>
                        <div className="haircut-selection-display">
                          {selectedHaircutGender && (
                            <span className="selected-gender">
                              {selectedHaircutGender === 'men' ? 'Men' : 'Women'}
                            </span>
                          )}
                          {customization.haircut && (
                            <span className="selected-option">
                              {customization.haircut}
                              {customization.haircut === 'I want to order my hair length' && hairLengths.front && (
                                <span className="hair-length-details">
                                  {` - Front: ${hairLengths.front}", Top: ${hairLengths.top}", Crown: ${hairLengths.crown}", Back: ${hairLengths.back}", Temples: ${hairLengths.temples}", Sides: ${hairLengths.sides}"`}
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      {/* Gender Selection */}
                      <div className="haircut-gender-selection">
                        <div 
                          className={`gender-btn ${selectedHaircutGender === 'men' ? 'active' : ''}`}
                          onClick={() => handleHaircutGenderSelection('men')}
                        >
                          Men
                        </div>
                        <div 
                          className={`gender-btn ${selectedHaircutGender === 'women' ? 'active' : ''}`}
                          onClick={() => handleHaircutGenderSelection('women')}
                        >
                          Women
                        </div>
                      </div>

                      {/* Haircut Options */}
                      {selectedHaircutGender && (
                        <div className="haircut-main-options">
                          {haircutMainOptions.map((option) => (
                            <div 
                              key={option.id}
                              className={`haircut-main-option ${customization.haircut === option.name ? 'selected' : ''}`}
                              onClick={() => handleHaircutMainOptionSelection(option)}
                            >
                              <div className="option-info">
                                <h6>{option.name}</h6>
                                {option.price > 0 && (
                                  <span className="price">${option.price}</span>
                                )}
                              </div>
                              </div>
                            ))}
                          </div>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Production Time */}
                  <Accordion.Item eventKey="productionTime">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>
                          Production Time
                          <FontAwesomeIcon icon={faInfoCircle} className="info-icon ms-2" />
                        </span>
                        {customization.productionTime && (
                          <span className="selected-option">{customization.productionTime}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="production-time-section">
                        <p className="production-time-question">
                          Do you want regular service or rush service for the production?
                        </p>
                        <div className="production-time-options">
                          <div 
                            className={`production-time-card ${customization.productionTime === 'Regular service 8-12 weeks' ? 'selected' : ''}`}
                            onClick={() => setCustomization(prev => ({ ...prev, productionTime: 'Regular service 8-12 weeks' }))}
                          >
                            <div className="production-time-text">Regular service 8-12 weeks</div>
                          </div>
                          <div 
                            className={`production-time-card ${customization.productionTime === 'Rush service 6-7 weeks' ? 'selected' : ''}`}
                            onClick={() => setCustomization(prev => ({ ...prev, productionTime: 'Rush service 6-7 weeks' }))}
                          >
                            <div className="production-time-text">Rush service 6-7 weeks</div>
                            <div className="production-time-price">+ $59.00</div>
                          </div>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Pick-up */}
                  <Accordion.Item eventKey="pickup">
                    <Accordion.Header>
                      <div className="accordion-header-content">
                        <span>
                          Pick-up
                          <FontAwesomeIcon icon={faInfoCircle} className="info-icon ms-2" />
                        </span>
                        {customization.pickup && (
                          <span className="selected-option">{customization.pickup}</span>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="pickup-section">
                        <p className="pickup-question">
                          Do you need us to arrange couriers to pick up your template and hair samples?
                        </p>
                        <div className="pickup-options">
                          <div 
                            className={`pickup-card ${customization.pickup === 'Pick-up' ? 'selected' : ''}`}
                            onClick={() => setCustomization(prev => ({ ...prev, pickup: 'Pick-up' }))}
                          >
                            <div className="pickup-text">Pick-up</div>
                            <div className="pickup-price">+ $39.00</div>
                          </div>
                          <div 
                            className={`pickup-card ${customization.pickup === 'None' ? 'selected' : ''}`}
                            onClick={() => setCustomization(prev => ({ ...prev, pickup: 'None' }))}
                          >
                            <div className="pickup-text">None</div>
                          </div>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Additional Information */}
                  <Accordion.Item eventKey="additionalInformation">
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
                          placeholder="Add any specific requirements or notes..."
                          value={customization.additionalInformation}
                          onChange={(e) => handleCustomizationChange('additionalInformation', e.target.value)}
                        />
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>

                </Accordion>
              </Card.Body>
            </Card>
          </Col>

          {/* Price Summary */}
          <Col lg={4}>
            <Card className="price-summary-card">
              <Card.Body>
                <h5>Price Summary</h5>
                
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Base Price:</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  
                  {additionalCosts.baseSize > 0 && (
                    <div className="price-row">
                      <span>Base Size:</span>
                      <span>+${additionalCosts.baseSize.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {additionalCosts.hairLength > 0 && (
                    <div className="price-row">
                      <span>Hair Length:</span>
                      <span>+${additionalCosts.hairLength.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {additionalCosts.haircut > 0 && (
                    <div className="price-row">
                      <span>Haircut:</span>
                      <span>+${additionalCosts.haircut.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {additionalCosts.bleachKnots > 0 && (
                    <div className="price-row">
                      <span>Bleach Knots:</span>
                      <span>+${additionalCosts.bleachKnots.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {additionalCosts.hairType > 0 && (
                    <div className="price-row">
                      <span>Hair Type:</span>
                      <span>+${additionalCosts.hairType.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {additionalCosts.hairDensity > 0 && (
                    <div className="price-row">
                      <span>Hair Density:</span>
                      <span>+${additionalCosts.hairDensity.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {additionalCosts.highlight > 0 && (
                    <div className="price-row">
                      <span>Highlight:</span>
                      <span>+${additionalCosts.highlight.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {additionalCosts.rootColor > 0 && (
                    <div className="price-row">
                      <span>Root Color:</span>
                      <span>+${additionalCosts.rootColor.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {additionalCosts.grayColor > 0 && (
                    <div className="price-row">
                      <span>Gray Color:</span>
                      <span>+${additionalCosts.grayColor.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {additionalCosts.productionTime > 0 && (
                    <div className="price-row">
                      <span>Production Time:</span>
                      <span>+${additionalCosts.productionTime.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {additionalCosts.pickup > 0 && (
                    <div className="price-row">
                      <span>Pick-up:</span>
                      <span>+${additionalCosts.pickup.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="price-row total">
                    <span>Total:</span>
                    <span>${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="shipping-info">
                  <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                  <small>Free shipping on orders over $200</small>
                </div>

                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  className="review-btn w-100 mb-3"
                  onClick={() => setShowReviewModal(true)}
                >
                  Review Selections
                </Button>

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="add-to-cart-btn w-100"
                  onClick={handleAddToCart}
                >
                  <span>
                    Add to Cart
                  </span>
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Customer Service Section */}
        <div className="customer-service-section">
          <p>Not sure in configuration is correct? Contact and consult customer service for advice, all discussions will be saved and kept confidential, please feel free to chat</p>
          <a href="#" className="contact-link">Contact Customer Service</a>
        </div>

        {/* Join Our Mailing List */}
        <div className="mailing-list-section">
          <div className="mailing-list-content">
            <h3>Join Our Mailing List</h3>
            <p>Sign up to receive inspiration, product updates, and special offers from our team.</p>
            <div className="mailing-list-form">
              <input 
                type="email" 
                placeholder="example@gmail.com" 
                className="email-input"
              />
              <Button variant="primary" className="submit-btn">Submit</Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Topper Selection Modal */}
      <Modal show={showTopperModal} onHide={handleTopperClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Topper</Modal.Title>
        </Modal.Header>
        <Modal.Body className="topper-modal-body">
          {/* Step Indicator */}
          <div className="step-indicator">
            <h4 className="step-title">{topperStep === 'width' ? 'Width' : 'Length'}</h4>
          </div>

          {/* Visual Diagram */}
          <div className="measurement-diagram">
            {topperStep === 'width' ? (
              <div className="width-diagram">
                <svg width="200" height="150" viewBox="0 0 200 150">
                  {/* Head outline */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#e74c3c" strokeWidth="2"/>
                  {/* Measuring tape for width */}
                  <line x1="50" y1="40" x2="150" y2="40" stroke="#f39c12" strokeWidth="3"/>
                  <line x1="50" y1="35" x2="50" y2="45" stroke="#f39c12" strokeWidth="2"/>
                  <line x1="150" y1="35" x2="150" y2="45" stroke="#f39c12" strokeWidth="2"/>
                  {/* Measurement text */}
                  <text x="100" y="30" textAnchor="middle" fontSize="12" fill="#2c3e50">Width</text>
                </svg>
              </div>
            ) : (
              <div className="length-diagram">
                <svg width="200" height="150" viewBox="0 0 200 150">
                  {/* Head outline */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#e74c3c" strokeWidth="2"/>
                  {/* Measuring tape for length */}
                  <path d="M80 20 Q100 15 120 20" fill="none" stroke="#f39c12" strokeWidth="3"/>
                  <line x1="80" y1="15" x2="80" y2="25" stroke="#f39c12" strokeWidth="2"/>
                  <line x1="120" y1="15" x2="120" y2="25" stroke="#f39c12" strokeWidth="2"/>
                  {/* Measurement text */}
                  <text x="100" y="10" textAnchor="middle" fontSize="12" fill="#2c3e50">Length</text>
                </svg>
              </div>
            )}
          </div>

          {/* Current Selection Display */}
          <div className="current-selection">
            {topperStep === 'width' ? (
              <div className="selection-display">
                {selectedWidth ? selectedWidth : '0.00 inch - 0.00 cm'}
              </div>
            ) : (
              <div className="selection-display">
                {selectedLength ? selectedLength : '0.00 inch - 0.00 cm'}
              </div>
            )}
          </div>

          {/* Measurement Options */}
          <div className="measurement-options-list">
            {measurementOptions.map((measurement) => (
              <div 
                key={measurement.id}
                className={`measurement-option-item ${
                  (topperStep === 'width' && selectedWidth.includes(measurement.inch)) ||
                  (topperStep === 'length' && selectedLength.includes(measurement.inch))
                    ? 'selected' : ''
                }`}
                onClick={() => {
                  if (topperStep === 'width') {
                    handleTopperWidthSelection(measurement)
                  } else {
                    handleTopperLengthSelection(measurement)
                  }
                }}
              >
                <span className="inch-value">{measurement.inch} inch</span>
                <span className="separator">•</span>
                <span className="cm-value">{measurement.cm} cm</span>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="topper-modal-footer">
          {topperStep === 'length' && (
            <Button variant="outline-secondary" onClick={handleTopperBackStep}>
              Back
            </Button>
          )}
          <div className="modal-actions">
            {topperStep === 'width' ? (
              <Button 
                variant="dark" 
                onClick={handleTopperNextStep}
                disabled={!selectedWidth}
              >
                Next Step
              </Button>
            ) : (
              <Button 
                variant="dark" 
                onClick={handleTopperConfirm}
                disabled={!selectedLength}
              >
                Confirm
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      {/* Full Cap Selection Modal */}
      <Modal show={showFullCapModal} onHide={handleFullCapClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Full cap</Modal.Title>
        </Modal.Header>
        <Modal.Body className="fullcap-modal-body">
          {/* Step Indicator */}
          <div className="step-indicator">
            <h4 className="step-title">{fullCapSteps[fullCapStep - 1].name}</h4>
          </div>

          {/* Visual Diagram */}
          <div className="measurement-diagram">
            {fullCapStep === 1 && (
              <div className="circumference-diagram">
                <svg width="200" height="150" viewBox="0 0 200 150">
                  {/* Head outline */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#e74c3c" strokeWidth="2"/>
                  {/* Measuring tape for circumference */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#f39c12" strokeWidth="3" strokeDasharray="5,5"/>
                  <text x="100" y="25" textAnchor="middle" fontSize="12" fill="#2c3e50">Circumference</text>
                </svg>
              </div>
            )}
            {fullCapStep === 2 && (
              <div className="front-to-nape-diagram">
                <svg width="200" height="150" viewBox="0 0 200 150">
                  {/* Head outline */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#e74c3c" strokeWidth="2"/>
                  {/* Measuring tape for front to nape */}
                  <path d="M100 15 Q100 50 100 100" fill="none" stroke="#f39c12" strokeWidth="3" strokeDasharray="5,5"/>
                  <text x="110" y="60" fontSize="12" fill="#2c3e50">Front to nape</text>
                </svg>
              </div>
            )}
            {fullCapStep === 3 && (
              <div className="ear-to-ear-forehead-diagram">
                <svg width="200" height="150" viewBox="0 0 200 150">
                  {/* Head outline */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#e74c3c" strokeWidth="2"/>
                  {/* Measuring tape for ear to ear across forehead */}
                  <line x1="60" y1="40" x2="140" y2="40" stroke="#f39c12" strokeWidth="3" strokeDasharray="5,5"/>
                  <text x="100" y="30" textAnchor="middle" fontSize="12" fill="#2c3e50">Ear to ear across forehead</text>
                </svg>
              </div>
            )}
            {fullCapStep === 4 && (
              <div className="temple-to-temple-diagram">
                <svg width="200" height="150" viewBox="0 0 200 150">
                  {/* Head outline */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#e74c3c" strokeWidth="2"/>
                  {/* Measuring tape for temple to temple */}
                  <line x1="70" y1="50" x2="130" y2="50" stroke="#f39c12" strokeWidth="3" strokeDasharray="5,5"/>
                  <text x="100" y="40" textAnchor="middle" fontSize="12" fill="#2c3e50">Temple to temple</text>
                </svg>
              </div>
            )}
            {fullCapStep === 5 && (
              <div className="ear-to-ear-top-diagram">
                <svg width="200" height="150" viewBox="0 0 200 150">
                  {/* Head outline */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#e74c3c" strokeWidth="2"/>
                  {/* Measuring tape for ear to ear over top */}
                  <path d="M60 20 Q100 15 140 20" fill="none" stroke="#f39c12" strokeWidth="3" strokeDasharray="5,5"/>
                  <text x="100" y="10" textAnchor="middle" fontSize="12" fill="#2c3e50">Ear to ear over top</text>
                </svg>
              </div>
            )}
            {fullCapStep === 6 && (
              <div className="temple-to-temple-back-diagram">
                <svg width="200" height="150" viewBox="0 0 200 150">
                  {/* Head outline */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#e74c3c" strokeWidth="2"/>
                  {/* Measuring tape for temple to temple round back */}
                  <path d="M70 80 Q100 90 130 80" fill="none" stroke="#f39c12" strokeWidth="3" strokeDasharray="5,5"/>
                  <text x="100" y="105" textAnchor="middle" fontSize="12" fill="#2c3e50">Temple to temple round back</text>
                </svg>
              </div>
            )}
            {fullCapStep === 7 && (
              <div className="nape-of-neck-diagram">
                <svg width="200" height="150" viewBox="0 0 200 150">
                  {/* Head outline */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#e74c3c" strokeWidth="2"/>
                  {/* Highlight nape area */}
                  <path d="M80 90 Q100 95 120 90" fill="#f39c12" stroke="#f39c12" strokeWidth="2" opacity="0.7"/>
                  <text x="100" y="110" textAnchor="middle" fontSize="12" fill="#2c3e50">Nape of neck</text>
                </svg>
              </div>
            )}
          </div>

          {/* Current Selection Display */}
          <div className="current-selection">
            <div className="selection-display">
              {fullCapMeasurements[fullCapSteps[fullCapStep - 1].key] || '0.00 inch - 0.00 cm'}
            </div>
          </div>

          {/* Measurement Options */}
          <div className="measurement-options-list">
            {fullCapMeasurementOptions[fullCapSteps[fullCapStep - 1].key].map((measurement) => (
              <div 
                key={measurement.id}
                className={`measurement-option-item ${
                  fullCapMeasurements[fullCapSteps[fullCapStep - 1].key]?.includes(measurement.inch) ? 'selected' : ''
                }`}
                onClick={() => handleFullCapMeasurementSelection(measurement)}
              >
                <span className="inch-value">{measurement.inch} inch</span>
                <span className="separator">•</span>
                <span className="cm-value">{measurement.cm} cm</span>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="fullcap-modal-footer">
          {fullCapStep > 1 && (
            <Button variant="outline-secondary" onClick={handleFullCapBackStep}>
              Back
            </Button>
          )}
          <div className="modal-actions">
            {fullCapStep < 7 ? (
              <Button 
                variant="dark" 
                onClick={handleFullCapNextStep}
                disabled={!fullCapMeasurements[fullCapSteps[fullCapStep - 1].key]}
              >
                Next Step
              </Button>
            ) : (
              <Button 
                variant="dark" 
                onClick={handleFullCapConfirm}
                disabled={!fullCapMeasurements[fullCapSteps[fullCapStep - 1].key]}
              >
                Confirm
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      {/* Frontal Selection Modal */}
      <Modal show={showFrontalModal} onHide={handleFrontalClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Frontal</Modal.Title>
        </Modal.Header>
        <Modal.Body className="frontal-modal-body">
          {/* Step Indicator */}
          <div className="step-indicator">
            <h4 className="step-title">{frontalStep === 'width' ? 'Width' : 'Length'}</h4>
          </div>

          {/* Visual Diagram */}
          <div className="measurement-diagram">
            {frontalStep === 'width' ? (
              <div className="frontal-width-diagram">
                <svg width="200" height="150" viewBox="0 0 200 150">
                  {/* Head outline */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#e74c3c" strokeWidth="2"/>
                  {/* Measuring tape for width */}
                  <line x1="50" y1="40" x2="150" y2="40" stroke="#f39c12" strokeWidth="3"/>
                  <line x1="50" y1="35" x2="50" y2="45" stroke="#f39c12" strokeWidth="2"/>
                  <line x1="150" y1="35" x2="150" y2="45" stroke="#f39c12" strokeWidth="2"/>
                  {/* Measurement text */}
                  <text x="100" y="30" textAnchor="middle" fontSize="12" fill="#2c3e50">Width</text>
                </svg>
              </div>
            ) : (
              <div className="frontal-length-diagram">
                <svg width="200" height="150" viewBox="0 0 200 150">
                  {/* Head outline */}
                  <path d="M50 30 Q100 10 150 30 Q160 50 150 70 Q140 90 100 100 Q60 90 50 70 Q40 50 50 30" 
                        fill="none" stroke="#e74c3c" strokeWidth="2"/>
                  {/* Measuring tape for length */}
                  <path d="M80 20 Q100 15 120 20" fill="none" stroke="#f39c12" strokeWidth="3"/>
                  <line x1="80" y1="15" x2="80" y2="25" stroke="#f39c12" strokeWidth="2"/>
                  <line x1="120" y1="15" x2="120" y2="25" stroke="#f39c12" strokeWidth="2"/>
                  {/* Measurement text */}
                  <text x="100" y="10" textAnchor="middle" fontSize="12" fill="#2c3e50">Length</text>
                </svg>
              </div>
            )}
          </div>

          {/* Current Selection Display */}
          <div className="current-selection">
            {frontalStep === 'width' ? (
              <div className="selection-display">
                {selectedFrontalWidth ? selectedFrontalWidth : '0.00 inch - 0.00 cm'}
              </div>
            ) : (
              <div className="selection-display">
                {selectedFrontalLength ? selectedFrontalLength : '0.00 inch - 0.00 cm'}
              </div>
            )}
          </div>

          {/* Measurement Options */}
          <div className="measurement-options-list">
            {frontalMeasurementOptions[frontalStep].map((measurement) => (
              <div 
                key={measurement.id}
                className={`measurement-option-item ${
                  (frontalStep === 'width' && selectedFrontalWidth.includes(measurement.inch)) ||
                  (frontalStep === 'length' && selectedFrontalLength.includes(measurement.inch))
                    ? 'selected' : ''
                }`}
                onClick={() => {
                  if (frontalStep === 'width') {
                    handleFrontalWidthSelection(measurement)
                  } else {
                    handleFrontalLengthSelection(measurement)
                  }
                }}
              >
                <span className="inch-value">{measurement.inch} inch</span>
                <span className="separator">•</span>
                <span className="cm-value">{measurement.cm} cm</span>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="frontal-modal-footer">
          {frontalStep === 'length' && (
            <Button variant="outline-secondary" onClick={handleFrontalBackStep}>
              Back
            </Button>
          )}
          <div className="modal-actions">
            {frontalStep === 'width' ? (
              <Button 
                variant="dark" 
                onClick={handleFrontalNextStep}
                disabled={!selectedFrontalWidth}
              >
                Next Step
              </Button>
            ) : (
              <Button 
                variant="dark" 
                onClick={handleFrontalConfirm}
                disabled={!selectedFrontalLength}
              >
                Confirm
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      {/* Match My Template Modal */}
      <Modal show={showTemplateModal} onHide={handleTemplateClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Match my template</Modal.Title>
        </Modal.Header>
        <Modal.Body className="template-modal-body">
          <div className="template-options-grid">
            {templateOptions.map((template) => (
              <div 
                key={template.id}
                className={`template-option-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                onClick={() => handleTemplateSelection(template)}
              >
                <div className="template-icon">
                  {template.id === 'partial' && (
                    <svg width="60" height="40" viewBox="0 0 60 40">
                      {/* Partial hair system - small irregular shape */}
                      <path d="M15 10 Q25 5 35 10 Q40 15 35 20 Q30 25 20 25 Q10 20 15 15 Q12 12 15 10" 
                            fill="#2c3e50" stroke="#34495e" strokeWidth="1"/>
                      <path d="M25 8 Q30 6 35 8 Q38 10 35 12 Q32 14 28 14 Q24 12 25 10 Q23 9 25 8" 
                            fill="#34495e" stroke="#2c3e50" strokeWidth="0.5"/>
                    </svg>
                  )}
                  {template.id === 'regular' && (
                    <svg width="60" height="40" viewBox="0 0 60 40">
                      {/* Regular hair system - medium irregular shape */}
                      <path d="M12 8 Q25 3 38 8 Q45 15 38 22 Q30 28 20 28 Q10 22 12 15 Q8 12 12 8" 
                            fill="#2c3e50" stroke="#34495e" strokeWidth="1"/>
                      <path d="M22 6 Q30 4 38 6 Q42 8 38 10 Q34 12 28 12 Q22 10 22 8 Q20 7 22 6" 
                            fill="#34495e" stroke="#2c3e50" strokeWidth="0.5"/>
                    </svg>
                  )}
                  {template.id === 'oversize' && (
                    <svg width="60" height="40" viewBox="0 0 60 40">
                      {/* Oversize hair system - large irregular shape */}
                      <path d="M10 6 Q25 1 40 6 Q48 15 40 24 Q30 30 20 30 Q8 24 10 15 Q6 10 10 6" 
                            fill="#2c3e50" stroke="#34495e" strokeWidth="1"/>
                      <path d="M20 4 Q30 2 40 4 Q44 6 40 8 Q36 10 28 10 Q20 8 20 6 Q18 5 20 4" 
                            fill="#34495e" stroke="#2c3e50" strokeWidth="0.5"/>
                    </svg>
                  )}
                  {template.id === 'fullcap' && (
                    <svg width="60" height="40" viewBox="0 0 60 40">
                      {/* Full cap hair system - largest shape */}
                      <path d="M8 4 Q25 -1 42 4 Q50 15 42 26 Q30 32 20 32 Q6 26 8 15 Q4 8 8 4" 
                            fill="#2c3e50" stroke="#34495e" strokeWidth="1"/>
                      <path d="M18 2 Q30 0 42 2 Q46 4 42 6 Q38 8 28 8 Q18 6 18 4 Q16 3 18 2" 
                            fill="#34495e" stroke="#2c3e50" strokeWidth="0.5"/>
                    </svg>
                  )}
                </div>
                <div className="template-info">
                  <h5 className="template-name">{template.name}</h5>
                  <p className="template-description">{template.description}</p>
                  {template.price > 0 && (
                    <span className="template-price">+ ${template.price}.00</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="template-modal-footer">
          <Button 
            variant="dark" 
            onClick={handleTemplateConfirm}
            disabled={!selectedTemplate}
            className="confirm-btn"
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View All Base Design Modal */}
      <Modal show={showViewAllModal} onHide={handleViewAllBaseDesignClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">View all base design</Modal.Title>
        </Modal.Header>
        <Modal.Body className="view-all-modal-body">
          <div className="base-design-grid">
            {viewAllBaseDesignOptions.map((design) => (
              <div 
                key={design.id}
                className={`base-design-card ${selectedBaseDesign?.id === design.id ? 'selected' : ''}`}
                onClick={() => handleViewAllBaseDesignSelection(design)}
              >
                <div className="design-imagec">
                  <img src={design.image} alt={design.name} />
                </div>
                <div className="design-info">
                  <h6 className="design-name">{design.name}</h6>
                  <p className="design-description">{design.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="view-all-modal-footer">
          {selectedBaseDesign && (
            <div className="selected-design-info">
              <p>I have my own base design and will type in instructions has been selected by you</p>
            </div>
          )}
          <Button 
            variant="dark" 
            onClick={handleViewAllBaseDesignConfirm}
            disabled={!selectedBaseDesign}
            className="confirm-btn"
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Curl and Wave Modal */}
      <Modal show={showCurlWaveModal} onHide={handleCurlWaveClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Curl and Wave</Modal.Title>
        </Modal.Header>
        <Modal.Body className="curl-wave-modal-body">
          <div className="curl-wave-info">
            <p>Please note: Afro curls are made exclusively with Remy hair and come in three sizes: 4mm, 6mm, and 8mm.</p>
          </div>
          
          <div className="gender-toggle">
            <div 
              className={`gender-tab ${selectedGender === 'men' ? 'active' : ''}`}
              onClick={() => setSelectedGender('men')}
            >
              Men
            </div>
            <div 
              className={`gender-tab ${selectedGender === 'women' ? 'active' : ''}`}
              onClick={() => setSelectedGender('women')}
            >
              Women
            </div>
          </div>

          <div className="curl-wave-options-grid">
            {getCurrentCurlWaveOptions().map((option) => (
              <div 
                key={option.id}
                className={`curl-wave-option ${selectedCurlWave?.id === option.id ? 'selected' : ''}`}
                onClick={() => handleCurlWaveSelection(option)}
              >
                <div className="curl-wave-icon">
                  {option.icon === 'send' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13" stroke="#666" strokeWidth="2"/>
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#666" strokeWidth="2" fill="none"/>
                    </svg>
                  )}
                  {option.icon !== 'none' && option.icon !== 'send' && (
                    <div className="hair-sample">
                      <svg width="40" height="20" viewBox="0 0 40 20">
                        {option.icon === 'straight' && (
                          <path d="M5 10 L35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'body-wave' && (
                          <path d="M5 10 Q10 5 15 10 Q20 15 25 10 Q30 5 35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'slight-wave' && (
                          <path d="M5 10 Q10 8 15 10 Q20 12 25 10 Q30 8 35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'medium-wave' && (
                          <path d="M5 10 Q10 6 15 10 Q20 14 25 10 Q30 6 35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'tight-wave' && (
                          <path d="M5 10 Q10 4 15 10 Q20 16 25 10 Q30 4 35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'loose-curl' && (
                          <path d="M5 10 Q10 5 15 10 Q20 15 25 10 Q30 5 35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'tight-curl' && (
                          <path d="M5 10 Q10 3 15 10 Q20 17 25 10 Q30 3 35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'medium-afro' && (
                          <path d="M5 10 Q10 2 15 10 Q20 18 25 10 Q30 2 35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'loose-afro' && (
                          <path d="M5 10 Q10 1 15 10 Q20 19 25 10 Q30 1 35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'extra-loose-afro' && (
                          <path d="M5 10 Q10 0 15 10 Q20 20 25 10 Q30 0 35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'silky-straight' && (
                          <path d="M5 10 L35 10" stroke="#2c3e50" strokeWidth="1" fill="none"/>
                        )}
                        {option.icon === 'natural-straight' && (
                          <path d="M5 10 L35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'deep-wave' && (
                          <path d="M5 10 Q10 3 15 10 Q20 17 25 10 Q30 3 35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                        {option.icon === 'water-wave' && (
                          <path d="M5 10 Q10 7 15 10 Q20 13 25 10 Q30 7 35 10" stroke="#2c3e50" strokeWidth="2" fill="none"/>
                        )}
                      </svg>
                    </div>
                  )}
                </div>
                <div className="curl-wave-info">
                  <h6>{option.name}</h6>
                  {option.price > 0 && (
                    <span className="price">+ ${option.price}.00</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="curl-wave-modal-footer">
          <Button 
            variant="dark" 
            onClick={handleCurlWaveConfirm}
            disabled={!selectedCurlWave}
            className="confirm-btn"
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Highlight Color Selection Modal */}
      <Modal show={showHighlightModal} onHide={handleHighlightClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">{selectedHighlightType?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="highlight-modal-body">
          {highlightModalStep === 1 ? (
            // Step 1: Color Selection
            <>
              <div className="highlight-preview-area">
                {highlightPreviewImage ? (
                  <img src={highlightPreviewImage} alt="Highlight Preview" className="highlight-preview-image" />
                ) : (
                  <div className="highlight-preview-placeholder">
                    <p>Select below images to view large image.</p>
                  </div>
                )}
              </div>

              <div className="highlight-color-categories">
                {Object.entries(highlightColorOptions).map(([category, colors]) => (
                  <div key={category} className="color-category">
                    <h6 className="category-title">
                      {category === 'brown' && selectedHighlightColor?.id === '4R' ? 'Brown-#4R:' : 
                       category.charAt(0).toUpperCase() + category.slice(1) + ':'}
                    </h6>
                    <div className="color-swatches">
                      {colors.map((color) => (
                        <div 
                          key={color.id}
                          className={`color-swatch ${selectedHighlightColor?.id === color.id ? 'selected' : ''}`}
                          onClick={() => handleHighlightColorSelection(color)}
                        >
                          <div className="color-image">
                            <img src={color.smallImage} alt={color.name} />
                          </div>
                          <span className="color-label">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : selectedHighlightType?.id === 'evenly-blended' && highlightModalStep === 2 ? (
            // Step 2: Proportion Selection (only for evenly blended)
            <>
              <div className="proportion-section">
                <h4 className="proportion-title">Proportion</h4>
                <div className="head-diagram">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="#2c3e50" stroke="#34495e" strokeWidth="2"/>
                    <path d="M100 20 Q120 40 100 60 Q80 40 100 20" fill="#34495e"/>
                    <path d="M100 60 Q120 80 100 100 Q80 80 100 60" fill="#34495e"/>
                    <path d="M100 100 Q120 120 100 140 Q80 120 100 100" fill="#34495e"/>
                    <path d="M100 140 Q120 160 100 180 Q80 160 100 140" fill="#34495e"/>
                    <line x1="100" y1="20" x2="100" y2="180" stroke="#ecf0f1" strokeWidth="1"/>
                    <line x1="20" y1="100" x2="180" y2="100" stroke="#ecf0f1" strokeWidth="1"/>
                  </svg>
                </div>
                <div className="proportion-options">
                  {proportionOptions.map((proportion) => (
                    <div 
                      key={proportion.id}
                      className={`proportion-option ${selectedProportion?.id === proportion.id ? 'selected' : ''}`}
                      onClick={() => handleProportionSelection(proportion)}
                    >
                      <span className="proportion-value">{proportion.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : selectedHighlightType?.id === 'spot-dot' && highlightModalStep >= 2 && highlightModalStep <= 7 ? (
            // Steps 2-7: Spot/Dot Area Selections
            <>
              <div className="spot-dot-section">
                <h4 className="spot-dot-title">{spotDotStepTitles[highlightModalStep]}</h4>
                <div className="head-diagram">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="#2c3e50" stroke="#34495e" strokeWidth="2"/>
                    {highlightModalStep === 2 && (
                      <path d="M100 20 Q120 40 100 60 Q80 40 100 20" fill="#e74c3c" opacity="0.7"/>
                    )}
                    {highlightModalStep === 3 && (
                      <path d="M100 60 Q120 80 100 100 Q80 80 100 60" fill="#e74c3c" opacity="0.7"/>
                    )}
                    {highlightModalStep === 4 && (
                      <circle cx="100" cy="80" r="20" fill="#e74c3c" opacity="0.7"/>
                    )}
                    {highlightModalStep === 5 && (
                      <path d="M100 140 Q120 160 100 180 Q80 160 100 140" fill="#e74c3c" opacity="0.7"/>
                    )}
                    {highlightModalStep === 6 && (
                      <path d="M20 100 Q40 80 60 100 Q40 120 20 100" fill="#e74c3c" opacity="0.7"/>
                    )}
                    {highlightModalStep === 7 && (
                      <path d="M140 100 Q160 80 180 100 Q160 120 140 100" fill="#e74c3c" opacity="0.7"/>
                    )}
                    <line x1="100" y1="20" x2="100" y2="180" stroke="#ecf0f1" strokeWidth="1"/>
                    <line x1="20" y1="100" x2="180" y2="100" stroke="#ecf0f1" strokeWidth="1"/>
                  </svg>
                </div>
                <div className="spot-dot-options">
                  {spotDotAreaOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={`spot-dot-option ${spotDotSelections[Object.keys(spotDotSelections)[highlightModalStep - 2]]?.id === option.id ? 'selected' : ''}`}
                      onClick={() => handleSpotDotAreaSelection(Object.keys(spotDotSelections)[highlightModalStep - 2], option)}
                    >
                      <span className="spot-dot-value">{option.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="highlight-modal-footer">
          {highlightModalStep === 1 ? (
            <Button 
              variant="dark" 
              onClick={handleHighlightNextStep}
              disabled={!selectedHighlightColor}
              className="next-step-btn"
            >
              Next Step
            </Button>
          ) : selectedHighlightType?.id === 'evenly-blended' && highlightModalStep === 2 ? (
            <div className="highlight-modal-footer-buttons">
              <Button 
                variant="outline-secondary" 
                onClick={handleHighlightBackStep}
                className="back-btn"
              >
                Back
              </Button>
              <Button 
                variant="dark" 
                onClick={handleHighlightConfirm}
                disabled={!selectedProportion}
                className="confirm-btn"
              >
                Confirm
              </Button>
            </div>
          ) : selectedHighlightType?.id === 'spot-dot' && highlightModalStep >= 2 && highlightModalStep <= 7 ? (
            <div className="highlight-modal-footer-buttons">
              <Button 
                variant="outline-secondary" 
                onClick={handleSpotDotBackStep}
                className="back-btn"
              >
                Back
              </Button>
              {highlightModalStep < 7 ? (
                <Button 
                  variant="dark" 
                  onClick={handleSpotDotNextStep}
                  disabled={!spotDotSelections[Object.keys(spotDotSelections)[highlightModalStep - 2]]}
                  className="next-step-btn"
                >
                  Next Step
                </Button>
              ) : (
                <Button 
                  variant="dark" 
                  onClick={handleHighlightConfirm}
                  disabled={!spotDotSelections[Object.keys(spotDotSelections)[highlightModalStep - 2]]}
                  className="confirm-btn"
                >
                  Confirm
                </Button>
              )}
            </div>
          ) : null}
        </Modal.Footer>
      </Modal>

      {/* Root Color Selection Modal */}
      <Modal show={showRootColorModal} onHide={handleRootColorClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Root Color</Modal.Title>
        </Modal.Header>
        <Modal.Body className="root-color-modal-body">
          {rootColorModalStep === 1 ? (
            // Step 1: Color Selection
            <>
              <div className="root-color-preview-area">
                {rootColorPreviewImage ? (
                  <img src={rootColorPreviewImage} alt="Root Color Preview" className="root-color-preview-image" />
                ) : (
                  <div className="root-color-preview-placeholder">
                    <p>Select below images to view large image.</p>
                  </div>
                )}
              </div>

              <div className="root-color-categories">
                {Object.entries(rootColorColorOptions).map(([category, colors]) => (
                  <div key={category} className="color-category">
                    <h6 className="category-title">
                      {category === 'brown' && selectedRootColor?.id === '4R' ? 'Brown-#4R:' : 
                       category.charAt(0).toUpperCase() + category.slice(1) + ':'}
                    </h6>
                    <div className="color-swatches">
                      {colors.map((color) => (
                        <div 
                          key={color.id}
                          className={`color-swatch ${selectedRootColor?.id === color.id ? 'selected' : ''}`}
                          onClick={() => handleRootColorColorSelection(color)}
                        >
                          <div className="color-image">
                            <img src={color.smallImage} alt={color.name} />
                          </div>
                          <span className="color-label">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Step 2: Length Selection
            <>
              <div className="root-color-length-section">
                <h4 className="root-color-length-title">Length</h4>
                <div className="root-color-length-options">
                  {rootColorLengthOptions.map((length) => (
                    <div 
                      key={length.id}
                      className={`root-color-length-option ${selectedRootColorLength?.id === length.id ? 'selected' : ''}`}
                      onClick={() => handleRootColorLengthSelection(length)}
                    >
                      <span className="root-color-length-value">{length.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="root-color-modal-footer">
          {rootColorModalStep === 1 ? (
            <Button 
              variant="dark" 
              onClick={handleRootColorNextStep}
              disabled={!selectedRootColor}
              className="next-step-btn"
            >
              Next Step
            </Button>
          ) : (
            <div className="root-color-modal-footer-buttons">
              <Button 
                variant="outline-secondary" 
                onClick={handleRootColorBackStep}
                className="back-btn"
              >
                Back
              </Button>
              <Button 
                variant="dark" 
                onClick={handleRootColorConfirm}
                disabled={!selectedRootColorLength}
                className="confirm-btn"
              >
                Confirm
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>

      {/* Gray Color Selection Modal */}
      <Modal show={showGrayColorModal} onHide={handleGrayColorClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title
            className="modal-title"
           
          >
            I want grey hair
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="gray-color-modal-body">
          {grayColorModalStep >= 1 && grayColorModalStep <= 6 ? (
            // Steps 1-6: Area Selections (Front, Top, Crown, Back, Temples, Sides)
            <>
              <div className="gray-color-area-section">
                <h4 className="gray-color-area-title">{grayColorStepTitles[grayColorModalStep]}</h4>
                <div className="head-diagram">
                  <div className="head-illustration">
                    <img 
                      src={`/src/assets/images/order_hair_length/${grayColorStepTitles[grayColorModalStep]}.png`}
                      alt={`${grayColorStepTitles[grayColorModalStep]} section`}
                      className="head-section-image"
                      onError={(e) => {
                        e.target.src = '/src/assets/images/image_108.png'
                      }}
                    />
                  </div>
                </div>
                <div className="gray-color-area-options">
                  {grayColorAreaOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={`gray-color-area-option ${grayColorSelections[Object.keys(grayColorSelections)[grayColorModalStep - 1]]?.id === option.id ? 'selected' : ''}`}
                      onClick={() => handleGrayColorAreaSelection(Object.keys(grayColorSelections)[grayColorModalStep - 1], option)}
                    >
                      <span className="gray-color-area-value">{option.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : grayColorModalStep === 7 ? (
            // Step 7: Hair Type Selection
            <>
              <div className="gray-hair-type-section">
                <h4
                  className="gray-hair-type-title"
                 
                >
                  Which type of grey hair you want?
                </h4>
                <div className="gray-hair-type-options">
                  {grayHairTypeOptions.map((hairType) => (
                    <div 
                      key={hairType.id}
                      className={`gray-hair-type-option ${selectedGrayHairType?.id === hairType.id ? 'selected' : ''}`}
                      onClick={() => handleGrayHairTypeSelection(hairType)}
                    >
                      <div className="gray-hair-type-image">
                        <img src={hairType.image} alt={hairType.name} />
                      </div>
                      <div className="gray-hair-type-info">
                        <h6>{hairType.name}</h6>
                        {hairType.price > 0 && (
                          <span className="price">+ ${hairType.price}.00</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="gray-color-modal-footer">
          {grayColorModalStep < 7 ? (
            <div className="gray-color-modal-footer-buttons">
              <Button 
                variant="outline-secondary" 
                onClick={handleGrayColorBackStep}
                className="back-btn"
              >
                Back
              </Button>
              <Button 
                variant="dark" 
                onClick={handleGrayColorNextStep}
                disabled={!grayColorSelections[Object.keys(grayColorSelections)[grayColorModalStep - 1]]}
                className="next-step-btn"
              >
                Next Step
              </Button>
            </div>
          ) : (
            <div className="gray-color-modal-footer-buttons">
              <Button 
                variant="outline-secondary" 
                onClick={handleGrayColorBackStep}
                className="back-btn"
              >
                Back
              </Button>
              <Button 
                variant="dark" 
                onClick={handleGrayColorConfirm}
                disabled={!selectedGrayHairType}
                className="confirm-btn"
              >
                Confirm
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>

      {/* Hair_Color Selection Modal */}
      <Modal show={showHairColorModal} onHide={handleHairColorClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title
            className="modal-title"
           
          >
            Hair_Color
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="hair-color-modal-body">
          {/* Gender Switch */}
          <div className="gender-switch">
            <div 
              className={`gender-option ${selectedHairColorGender === 'men' ? 'active' : ''}`}
              onClick={() => handleHairColorGenderChange('men')}
            >
              <span>
                Men
              </span>
            </div>
            <div 
              className={`gender-option ${selectedHairColorGender === 'women' ? 'active' : ''}`}
              onClick={() => handleHairColorGenderChange('women')}
            >
              <span>
                Women
              </span>
            </div>
          </div>

          {/* Hair Color Preview Area */}
          <div className="root-color-preview-area">
            {hairColorPreviewImage ? (
              <img src={hairColorPreviewImage} alt="Hair Color Preview" className="root-color-preview-image" />
            ) : (
              <div className="root-color-preview-placeholder">
                <p>Select below images to view large image.</p>
              </div>
            )}
          </div>

          {/* Color Categories */}
          {selectedHairColorGender && hairColorColorOptions[selectedHairColorGender] && (
            <div className="root-color-categories">
              {Object.entries(hairColorColorOptions[selectedHairColorGender]).map(([category, colors]) => (
                <div key={category} className="color-category">
                  <h6 className="category-title">
                    {category === 'reddish' ? 'Redish' : category.charAt(0).toUpperCase() + category.slice(1)}
                    {category === 'brown' && selectedHairColorGender === 'women' ? '-8' : ''}
                    :
                  </h6>
                  <div className="color-swatches">
                    {colors.map((color) => (
                      <div 
                        key={color.id}
                        className={`color-swatch ${selectedHairColor?.id === color.id ? 'selected' : ''}`}
                        onClick={() => handleHairColorColorSelection(color)}
                      >
                        <div className="color-image">
                          <img src={color.smallImage} alt={color.name} />
                        </div>
                        <span className="color-label">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="root-color-modal-footer">
          <div className="modal-footer-content">
            {selectedHairColor && (
              <div className="selection-text">
                {selectedHairColor.name} {selectedHairColorGender} has been selected by you.
              </div>
            )}
            {selectedHairColor && (
              <Button 
                variant="dark" 
                onClick={handleHairColorConfirm}
                className="confirm-btn"
              >
                Confirm
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      {/* Haircut Selection Modal */}
      <Modal show={showChooseHairstyleModal} onHide={handleChooseHairstyleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Choose Your Haircut</Modal.Title>
        </Modal.Header>
        <Modal.Body className="choose-hairstyle-modal-body">
          {/* Gender Switch */}
          <div className="gender-switch">
            <div 
              className={`gender-option ${haircutModalGender === 'men' ? 'active' : ''}`}
              onClick={() => handleHaircutGenderSelection('men')}
            >
              <span>
                Men
              </span>
            </div>
            <div 
              className={`gender-option ${haircutModalGender === 'women' ? 'active' : ''}`}
              onClick={() => handleHaircutGenderSelection('women')}
            >
              <span>
                Women
              </span>
            </div>
          </div>

          <div className="haircut-selection">
            <div className="haircut-grid">
              {hairstyleOptions[haircutModalGender]?.map((haircut) => (
                <div 
                  key={haircut.id}
                  className={`haircut-card ${customization.haircut === haircut.code ? 'selected' : ''}`}
                  onClick={() => handleHairstyleSelection(haircut.code)}
                >
                  <div className="haircut-image-slider">
                    <div className="slider-container">
                      <div className="slider-track">
                        {haircut.images.map((image, index) => (
                          <div key={index} className={`slider-slide ${index === 0 ? 'active' : ''}`}>
                            <img 
                              src={image} 
                              alt={`${haircut.code} - ${index + 1}`}
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
                    {customization.haircut === haircut.code && (
                       <div className="selection-checkmark">
                         <FontAwesomeIcon icon={faCheck} />
                       </div>
                     )}
                  </div>
                  <div className="haircut-info">
                    <div className="haircut-id">{haircut.code}</div>
                    <div className="haircut-description">{haircut.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="root-color-modal-footer">
          <Button variant="outline-secondary" onClick={handleChooseHairstyleClose}>
            Cancel
          </Button>
          <Button 
            variant="dark" 
            onClick={handleChooseHairstyleClose}
            className="confirm-btn"
            disabled={!customization.haircut}
          >
            Select Haircut
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Hair Length Stepper Modal */}
      <Modal show={showOrderHairLengthModal} onHide={handleHairLengthCancel} size="lg" centered>
        <Modal.Header closeButton>
          <div className="hair-length-header">
            {currentStep > 0 && (
              <button className="back-arrow-btn" onClick={handlePrevStep}>
                <FontAwesomeIcon icon={faChevronRight} style={{transform: 'rotate(180deg)'}} />
              </button>
            )}
            <Modal.Title className="modal-title">I want to order my hair length</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body className="hair-length-modal-body">
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
                {hairLengths[hairLengthSteps[currentStep].key] ? (
                  <>
                    {hairLengths[hairLengthSteps[currentStep].key]}" inch = {lengthOptions.find(opt => opt.inch === hairLengths[hairLengthSteps[currentStep].key])?.cm} cm
                  </>
                ) : (
                  'Select a length below'
                )}
              </div>
              <div className="length-options">
                {lengthOptions.map((option) => (
                  <div 
                    key={option.inch}
                    className={`length-option ${hairLengths[hairLengthSteps[currentStep].key] === option.inch ? 'selected' : ''}`}
                    onClick={() => handleHairLengthChange(hairLengthSteps[currentStep].key, option.inch)}
                  >
                    <span className="inch">{option.inch}"</span>
                    <span className="cm">({option.cm} cm)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="root-color-modal-footer">
          <Button variant="outline-secondary" onClick={handleHairLengthCancel}>
            Cancel
          </Button>
          {currentStep < hairLengthSteps.length - 1 ? (
            <Button 
              variant="dark" 
              onClick={handleNextStep}
              className="next-step-btn"
              disabled={!hairLengths[hairLengthSteps[currentStep].key]}
            >
              Next Step
            </Button>
          ) : (
            <Button 
              variant="dark" 
              onClick={handleHairLengthConfirm}
              className="confirm-btn"
              disabled={!hairLengths[hairLengthSteps[currentStep].key]}
            >
              Confirm
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Image Upload Modal */}
      <Modal show={showUploadHairstyleModal} onHide={cancelImageUpload} size="lg" centered>
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

      {/* Review Selections Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Review Your Selections</Modal.Title>
        </Modal.Header>
        <Modal.Body className="review-modal-body">
          <div className="review-section">
            {customization.baseSize && (
              <div className="review-item">
                <h6>Base Size</h6>
                <p>{customization.baseSize}</p>
              </div>
            )}
            
            {customization.baseDesign && (
              <div className="review-item">
                <h6>Base Design</h6>
                <p>{customization.baseDesign}</p>
              </div>
            )}
            
            {customization.frontContour && (
              <div className="review-item">
                <h6>Front Contour</h6>
                <p>{customization.frontContour}</p>
              </div>
            )}
            
            {customization.baseMaterialColor && (
              <div className="review-item">
                <h6>Base Material Color</h6>
                <p>{customization.baseMaterialColor}</p>
              </div>
            )}
            
            {customization.hairLength && (
              <div className="review-item">
                <h6>Hair Length</h6>
                <p>{customization.hairLength}</p>
              </div>
            )}
            
            {customization.curlAndWave && (
              <div className="review-item">
                <h6>Curl and Wave</h6>
                <p>{customization.curlAndWave}</p>
              </div>
            )}
            
            {customization.hairDirection && (
              <div className="review-item">
                <h6>Hair Direction</h6>
                <p>{customization.hairDirection}</p>
              </div>
            )}
            
            {customization.highlight && (
              <div className="review-item">
                <h6>Highlight</h6>
                <p>{customization.highlight}</p>
              </div>
            )}
            
            {customization.rootColor && (
              <div className="review-item">
                <h6>Root Color</h6>
                <p>{customization.rootColor}</p>
              </div>
            )}
            
            {customization.greyHair && (
              <div className="review-item">
                <h6>Grey Hair</h6>
                <p>{customization.greyHair}</p>
              </div>
            )}
            
            {customization.bleachKnots && (
              <div className="review-item">
                <h6>Bleach Knots</h6>
                <p>{customization.bleachKnots}</p>
              </div>
            )}
            
            {customization.hairType && (
              <div className="review-item">
                <h6>Hair Type</h6>
                <p>{customization.hairType}</p>
              </div>
            )}
            
            {customization.hairDensity && (
              <div className="review-item">
                <h6>Hair Density</h6>
                <p>{customization.hairDensity}</p>
              </div>
            )}
            
            {customization.hairColor && (
              <div className="review-item">
                <h6>Hair_Color</h6>
                <p>{customization.hairColor}</p>
              </div>
            )}
            
            {customization.haircut && (
              <div className="review-item">
                <h6>Haircut</h6>
                <p>{customization.haircut}</p>
              </div>
            )}
            
            {customization.productionTime && (
              <div className="review-item">
                <h6>Production Time</h6>
                <p>{customization.productionTime}</p>
              </div>
            )}
            
            {customization.pickup && (
              <div className="review-item">
                <h6>Pick-up</h6>
                <p>{customization.pickup}</p>
              </div>
            )}
            
            {customization.additionalInformation && (
              <div className="review-item">
                <h6>Additional Information</h6>
                <p>{customization.additionalInformation}</p>
              </div>
            )}
            
            <div className="review-item review-total">
              <h6>Total Price</h6>
              <p className="total-price">${calculateTotalPrice().toFixed(2)}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowReviewModal(false)}
          >
            <span>
              Close
            </span>
          </Button>
          <Button variant="primary" onClick={() => {
            setShowReviewModal(false)
            handleAddToCart()
          }}>
            <span>
              Add to Cart
            </span>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default HairCustomization
