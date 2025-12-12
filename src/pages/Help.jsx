import React from 'react'
import Banner from '../components/Banner'
import FAQ from '../components/FAQ'
import Newsletter from '../components/Newsletter'

const Help = () => {
  const helpFAQs = [
    {
      id: 1,
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'My Orders' section. You'll receive tracking information via email once your order ships. You can also use the tracking number provided in your order confirmation email."
    },
    {
      id: 2,
      question: "What is your shipping and delivery policy?",
      answer: "We offer free shipping on all orders over $50. Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. We ship to all 50 states and offer international shipping to select countries. Delivery times may vary based on location and shipping method selected."
    },
    {
      id: 3,
      question: "What is your return and exchange policy?",
      answer: "We offer a 30-day return policy for all unused items in their original packaging. Custom hair systems have a 14-day return window. Returns are free within the continental US. Exchanges are processed within 5-7 business days after we receive your return."
    },
    {
      id: 4,
      question: "How do I choose the right hair system for me?",
      answer: "Our hair systems come in various base types (skin, lace, hybrid, mono) and hair types. Consider your lifestyle, comfort preferences, and maintenance requirements. Our experts can help you choose the perfect system during a consultation. We also offer virtual consultations and detailed guides."
    },
    {
      id: 5,
      question: "How do I care for my hair system?",
      answer: "Proper care extends the life of your hair system. Use sulfate-free shampoos, avoid excessive heat styling, and follow our detailed care instructions. We provide comprehensive care guides with each purchase and offer maintenance products to keep your system looking its best."
    },
    {
      id: 6,
      question: "Do you offer installation services?",
      answer: "Yes, we offer professional installation services at our studio locations. We also provide detailed installation guides and video tutorials for DIY installation. Our certified stylists can help with initial setup and provide ongoing maintenance tips."
    }
  ]

  return (
    <div className="help-page">
      
      <Banner 
        badge="Help"
        title="How Can We Help You Today?"
        description="Find quick answers, step-by-step guides, and expert support everything you need in one place."
        backgroundImage="/src/assets/images/scandinavian-interior-mockup-wall-decal-background_2.png"
      />
      
      <FAQ 
        title="Frequently Asked Questions"
        subtitle="Lorem Ipsum Dolor Sit Amet. Consectetur Adipiscing Elit. Ut Et Massa Mi. Aliquam In Hendrerit Urna."
        faqs={helpFAQs}
      />
      
      <Newsletter />
    </div>
  )
}

export default Help
