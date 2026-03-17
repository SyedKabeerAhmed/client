import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import all translation files (English is base language, defined inline below)
import es from './locales/es.json'
import hu from './locales/hu.json'
import bn from './locales/bn.json'
import pt from './locales/pt.json'
import ru from './locales/ru.json'
import ja from './locales/ja.json'
import de from './locales/de.json'
import ko from './locales/ko.json'
import fr from './locales/fr.json'
import vi from './locales/vi.json'
import pl from './locales/pl.json'
import ar from './locales/ar.json'
import uk from './locales/uk.json'
import it from './locales/it.json'

// English is the base language - translations defined inline
const en = {
  common: {
    home: "Home",
    about: "About",
    shop: "Shop",
    cart: "Cart",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    profile: "Profile",
    search: "Search",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    dashboard: "Dashboard",
    manageAccount: "Manage Account",
    loginRegister: "Login/Register",
    english: "English",
    usd: "USD",
    yes: "Yes",
    no: "No",
    back: "Back",
    next: "Next",
    previous: "Previous",
    continue: "Continue",
    finish: "Finish",
    skip: "Skip",
    apply: "Apply",
    remove: "Remove",
    update: "Update",
    create: "Create",
    view: "View",
    select: "Select",
    choose: "Choose",
    upload: "Upload",
    download: "Download",
    share: "Share",
    print: "Print",
    copy: "Copy",
    paste: "Paste",
    cut: "Cut",
    undo: "Undo",
    redo: "Redo",
    refresh: "Refresh",
    reload: "Reload",
    reset: "Reset",
    clear: "Clear",
    filter: "Filter",
    sort: "Sort",
    searchPlaceholder: "Search...",
    noResults: "No results found",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",
    confirm: "Confirm",
    areYouSure: "Are you sure?",
    pleaseWait: "Please wait...",
    processing: "Processing...",
    completed: "Completed",
    failed: "Failed",
    retry: "Retry",
    tryAgain: "Try Again",
    ok: "OK",
    done: "Done",
    gotIt: "Got it",
    understand: "I understand",
    accept: "Accept",
    decline: "Decline",
    agree: "Agree",
    disagree: "Disagree",
    termsAndConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    allRightsReserved: "All rights reserved",
    copyright: "© 2025. All rights reserved."
  },
  nav: {
    hairSystems: "Hair Systems",
    allHairSystems: "All Hair System",
    chooseBy: "CHOOSE BY",
    byBaseType: "By Base Type",
    byHairstyle: "By Hairstyle",
    byLifestyle: "By Life Style",
    byHairLossAreas: "By Hair Loss Areas",
    byConsultation: "By Consultation",
    accessories: "Accessories",
    allAccessories: "All Accessories",
    adhesives: "Adhesives",
    glues: "Glues",
    tools: "Tools",
    careProducts: "Care Products",
    beginnersGuide: "Beginners Guide",
    customHairSystem: "Custom Hair System",
    aboutUs: "About Us",
    help: "Help",
    brand: "Hair Store",
    contactUs: "Contact Us",
    categories: "Categories",
    quickLinks: "Quick Links"
  },
  home: {
    title: "Hair That Looks Real Confidence That Lasts",
    description: "Explore systems made for comfort, style, and everyday wear.",
    badge: "New Arrival",
    premiumSystems: {
      title: "Explore Our Premium Hair Systems",
      subtitle: "Choose The Perfect System Tailored To Your Lifestyle, Comfort, And Natural Look."
    },
    bestSelling: {
      title: "Our Best Selling Hair Systems",
      subtitle: "Discover The Most Trusted And Popular Systems, Chosen By Clients For Their Natural Look, Comfort, And Durability."
    }
  },
  features: {
    freeDelivery: "Free Shipping",
    support247: "Support 24/7",
    authentic: "100% Authentic"
  },
  styles: {
    title: "Styles That Redefine Confidence",
    subtitle: "Explore Our Most Sought After Hair Systems, To Give You The Perfect Balance Of Style, Comfort, And A Natural Look.",
    step1: {
      title: "Selecting Your Perfect Base",
      description: "Carefully select your perfect balance of style, comfort, and a natural look."
    },
    step2: {
      title: "Customizing Your Style",
      description: "Personalize your hair system to match your unique preferences and lifestyle needs."
    },
    step3: {
      title: "Professional Installation",
      description: "Get expert guidance and professional installation for the perfect fit and natural look."
    }
  },
  testimonials: {
    title: "What Our Clients Say",
    shopNow: "Shop Now"
  },
  newsletter: {
    title: "Join Our Mailing List",
    subtitle: "Sign up to receive inspiration, product updates, and special offers from our team.",
    placeholder: "example@gmail.com",
    buttonText: "Submit",
    submitting: "Submitting...",
    thankYou: "Thank you for subscribing!"
  },
  footer: {
    description: "we turn ideas into powerful digital solutions. innovative software to reliable IT support, we help businesses in a connected world.",
    contactUs: "Contact Us",
    categories: "Categories",
    hairSystems: "Hair Systems",
    customHairSystem: "Custom Hair System",
    beginnersGuide: "Beginners Guide",
    help: "Help",
    termsAndConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    copyright: "© 2025. All rights reserved."
  },
  faq: {
    title: "Frequently Asked Questions"
  },
  help: {
    badge: "Help",
    title: "How Can We Help You Today?",
    description: "Find quick answers, step-by-step guides, and expert support everything you need in one place.",
    faqTitle: "Frequently Asked Questions",
    trackOrder: {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'My Orders' section. You'll receive tracking information via email once your order ships. You can also use the tracking number provided in your order confirmation email."
    },
    shipping: {
      question: "What is your shipping and delivery policy?",
      answer: "We offer free shipping on all orders over $50. Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. We ship to all 50 states and offer international shipping to select countries. Delivery times may vary based on location and shipping method selected."
    },
    returns: {
      question: "What is your return and exchange policy?",
      answer: "We offer a 30-day return policy for all unused items in their original packaging. Custom hair systems have a 14-day return window. Returns are free within the continental US. Exchanges are processed within 5-7 business days after we receive your return."
    },
    chooseSystem: {
      question: "How do I choose the right hair system for me?",
      answer: "Our hair systems come in various base types (skin, lace, hybrid, mono) and hair types. Consider your lifestyle, comfort preferences, and maintenance requirements. Our experts can help you choose the perfect system during a consultation. We also offer virtual consultations and detailed guides."
    },
    care: {
      question: "How do I care for my hair system?",
      answer: "Proper care extends the life of your hair system. Use sulfate-free shampoos, avoid excessive heat styling, and follow our detailed care instructions. We provide comprehensive care guides with each purchase and offer maintenance products to keep your system looking its best."
    },
    installation: {
      question: "Do you offer installation services?",
      answer: "Yes, we offer professional installation services at our studio locations. We also provide detailed installation guides and video tutorials for DIY installation. Our certified stylists can help with initial setup and provide ongoing maintenance tips."
    }
  },
  about: {
    badge: "About Us",
    title: "Who We Are & What We Stand For",
    description: "Discover our commitment to quality, innovation, and customer satisfaction in the hair systems industry.",
    mission: {
      badge: "Our Mission",
      title: "Empowering Authentic Confidence",
      description: "We believe that everyone deserves to feel confident and authentic in their own skin. Our mission is to provide high-quality hair systems that not only look natural but also empower our clients to live their lives with renewed confidence and self-assurance. Through innovative technology, expert craftsmanship, and personalized service, we help individuals rediscover their best selves."
    },
    vision: {
      badge: "Our Vision",
      title: "Leading the Way in Hair System Excellence",
      description: "To be the global leader in hair system innovation, setting new standards for quality, comfort, and natural appearance. We envision a world where hair loss never limits confidence or opportunities, where our solutions seamlessly integrate into every lifestyle, and where exceptional customer experience is the foundation of lasting relationships."
    },
    testimonialsTitle: "What Our Clients Say",
    shopNow: "SHOP NOW"
  },
  auth: {
    signIn: "Sign in",
    signUp: "Sign up",
    signInToAccount: "Sign in to your account to discover exclusive deals and manage your orders.",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    userType: "User Type",
    individualUser: "Individual User",
    businessUser: "Business User",
    phoneNumber: "Phone Number",
    confirmPassword: "Confirm Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot Password?",
    signingIn: "Signing In...",
    signInButton: "Sign In",
    creatingAccount: "Creating Account...",
    signUpButton: "Sign Up",
    dontHaveAccount: "Don't have an account yet?",
    alreadyHaveAccount: "Already have an account yet?",
    register: "Register",
    login: "Login",
    emailPlaceholder: "Please enter your email address",
    passwordPlaceholder: "Please enter your password",
    fullNamePlaceholder: "Enter your full name",
    phonePlaceholder: "03142070876 (will be formatted to +923142070876)",
    loginFailed: "Login failed. Please try again.",
    registrationFailed: "Registration failed. Please try again.",
    passwordsDoNotMatch: "Passwords do not match",
    author: "-- Mathew"
  },
  cart: {
    title: "Shopping Cart",
    empty: "Your cart is empty",
    emptyDescription: "Looks like you haven't added any items to your cart yet.",
    total: "Total",
    subtotal: "Subtotal",
    checkout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    clearCart: "Clear Cart",
    areYouSureClear: "Are you sure you want to clear your cart?",
    pleaseLogin: "Please login to view your cart",
    loginRequired: "You need to be logged in to access your shopping cart.",
    loadingCart: "Loading your cart...",
    product: "PRODUCT",
    price: "PRICE",
    quantity: "QUANTITY",
    type: "Type:",
    customization: "Customization",
    viewCustomization: "View Customization",
    discountCode: "Discount Code",
    applyDiscount: "Apply Discount",
    discountApplied: "Discount applied successfully!",
    discountError: "Failed to apply discount",
    removeItem: "Remove Item",
    updateQuantity: "Update Quantity",
    orderSummary: "Order Summary",
    shipping: "Shipping",
    tax: "Tax",
    discount: "Discount",
    free: "Free",
    calculatedAtCheckout: "Calculated at checkout"
  },
  shop: {
    ourHairSystems: "Our Hair Systems & Accessories",
    hairSystems: "Hair Systems",
    accessories: "Accessories",
    skinHairSystems: "Skin Hair Systems",
    laceHairSystems: "Lace Hair Systems",
    hybridHairSystems: "Hybrid Hair Systems",
    monoHairSystems: "Mono Hair Systems",
    adhesives: "Adhesives",
    glues: "Glues",
    tools: "Tools",
    careProducts: "Care Products",
    exploreSubtitle: "Explore Our Most Sought-After Hair Systems, Carefully Selected To Give You The Perfect Balance Of Style, Comfort, And A Natural Look",
    hairSystemsSubtitle: "Explore Our Complete Range Of Hair Systems, Designed To Provide The Perfect Balance Of Style, Comfort, And Natural Appearance",
    accessoriesSubtitle: "Discover Essential Accessories And Tools To Maintain And Style Your Hair Systems With Professional Results",
    skinSubtitle: "Experience The Ultimate In Comfort And Natural Appearance With Our Premium Skin Hair Systems",
    laceSubtitle: "Discover The Perfect Blend Of Breathability And Natural Look With Our High-Quality Lace Hair Systems",
    hybridSubtitle: "Get The Best Of Both Worlds With Our Innovative Hybrid Hair Systems Combining Multiple Base Materials",
    monoSubtitle: "Enjoy Superior Durability And Easy Maintenance With Our Monofilament Hair Systems",
    adhesiveSubtitle: "Professional-Grade Adhesives For Secure And Long-Lasting Hair System Attachment",
    glueSubtitle: "High-Quality Glues And Bonding Solutions For Reliable Hair System Installation",
    toolsSubtitle: "Essential Tools And Equipment For Professional Hair System Application And Maintenance",
    careProductsSubtitle: "Premium Care Products To Keep Your Hair Systems Looking Fresh And Natural",
    sortBy: "Sort By",
    featured: "Featured",
    price: "Price",
    newest: "Newest",
    highestRated: "Highest Rated",
    loadMore: "Load More",
    noProducts: "No products found",
    searchResults: "Search Results",
    showingResults: "Showing results for",
    totalResults: "total results"
  },
  product: {
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    description: "Description",
    specifications: "Specifications",
    reviews: "Reviews",
    explore: "Explore",
    shopNow: "SHOP NOW",
    overview: "Overview",
    customization: "Customization",
    hairColor: "Hair Color",
    haircut: "Haircut",
    cutToSize: "Cut to Size",
    size: "Size",
    additionalInfo: "Additional Information",
    uploadImages: "Upload Images",
    hairLength: "Hair Length",
    front: "Front",
    top: "Top",
    crown: "Crown",
    back: "Back",
    temples: "Temples",
    sides: "Sides",
    inches: "inches",
    selectHairColor: "Select Hair Color",
    selectHaircut: "Select Haircut",
    selectSize: "Select Size",
    customLength: "Custom Length",
    customImage: "Custom Image",
    none: "None",
    yes: "Yes",
    no: "No",
    addToCartSuccess: "Item added to cart successfully!",
    addToCartError: "Failed to add item to cart",
    loginRequired: "Please login to add items to cart",
    reviewProduct: "Review this product",
    rating: "Rating",
    reviewDescription: "Review Description",
    submitReview: "Submit Review",
    reviewSubmitted: "Review submitted successfully!",
    reviewError: "Failed to submit review",
    noReviews: "No reviews yet",
    beFirstToReview: "Be the first to review this product"
  },
  checkout: {
    title: "Checkout",
    orderSummary: "Order Summary",
    shippingDetails: "Shipping Details",
    paymentMethod: "Payment Method",
    firstName: "First Name",
    companyName: "Company Name (Optional)",
    streetAddress: "Street Address",
    apartment: "Apartment, suite, etc. (Optional)",
    townCity: "Town / City",
    country: "Country",
    phoneNumber: "Phone Number",
    email: "Email Address",
    saveInfo: "Save this information for next time",
    cashOnDelivery: "Cash on Delivery",
    creditCard: "Credit Card",
    placeOrder: "Place Order",
    placingOrder: "Placing Order...",
    orderPlaced: "Order placed successfully!",
    orderError: "Failed to place order",
    firstNameRequired: "First name is required",
    streetAddressRequired: "Street address is required",
    townCityRequired: "Town/City is required",
    phoneNumberRequired: "Phone number is required",
    phoneNumberInvalid: "Please enter a valid phone number",
    emailRequired: "Email address is required",
    emailInvalid: "Please enter a valid email address",
    couponCode: "Coupon Code",
    applyCoupon: "Apply Coupon",
    couponApplied: "Coupon applied successfully!",
    couponError: "Failed to apply coupon",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax",
    discount: "Discount",
    total: "Total",
    free: "Free",
    calculatedAtCheckout: "Calculated at checkout"
  },
  customHairSystem: {
    badge: "Custom Hair System",
    title: "Make Your Custom Hair System",
    featuresTitle: "Our Custom Hair Systems Features",
    featuresSubtitle: "Explore Our Most Bought After Hair Systems, Carefully Selected To Give You The Perfect Balance Of Style, Comfort, And A Natural Look",
    feature1: {
      title: "Easy One-Click Ordering",
      description: "Production starts immediately after payment—no confirmations, no emails, no salon visits."
    },
    feature2: {
      title: "Designed for the Perfect Fit",
      description: "Diverse options to suit all ethnicities, hair textures, and lifestyles."
    },
    feature3: {
      title: "Fast and Reliable Rush Service",
      description: "Get your order faster with our expedited processing and delivery options."
    },
    feature4: {
      title: "Exquisite Hand-Knotted Artistry",
      description: "Each piece is expertly hand-knotted by artisans with 10+ years of experience."
    },
    designTitle: "Design Your Ideal Hair System",
    designDescription: "Over 16 customizable features to ensure a perfect hair system with custom bases, diverse hair textures, and accurate color matching.",
    createButton: "CREATE YOUR CUSTOM HAIR SYSTEM",
    beforeAfterTitle: "Our Custom Hair Systems Features",
    beforeAfterSubtitle: "Explore Our Most Bought After Hair Systems, Carefully Selected To Give You The Perfect Balance Of Style, Comfort, And A Natural Look",
    template: {
      partial: "Partial",
      regular: "Regular",
      oversize: "Oversize",
      fullcap: "Full cap",
      partialDesc: "(size ≤ 7\"x10\", or area ≤ 70 square inches)",
      regularDesc: "(7\"x10\" < size ≤ 8\"x10\", or 70 square inches < area ≤ 80 square inches)",
      oversizeDesc: "(8\"x10\" < size ≤ 10\"x10\", or 80 square inches < area ≤ 100 square inches)",
      fullcapDesc: "(size > 10\"x10\", or area > 100 square inches)"
    }
  },
  beginnersGuide: {
    badge: "Beginners Guide",
    title: "New to Hair Systems? Start Here",
    description: "Learn the basics of hair systems with simple guides, tips, and expert advice to help you start with confidence.",
    exploreMore: "Explore More"
  }
}

const resources = {
  en: { translation: en },
  es: { translation: es },
  hu: { translation: hu },
  bn: { translation: bn },
  pt: { translation: pt },
  ru: { translation: ru },
  ja: { translation: ja },
  de: { translation: de },
  ko: { translation: ko },
  fr: { translation: fr },
  vi: { translation: vi },
  pl: { translation: pl },
  ar: { translation: ar },
  uk: { translation: uk },
  it: { translation: it }
}

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback to English (base language)
    lng: 'en', // Default to English
    debug: false,

    interpolation: {
      escapeValue: false // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  })

// Handle RTL for Arabic
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
})

// Set initial direction
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'

export default i18n
