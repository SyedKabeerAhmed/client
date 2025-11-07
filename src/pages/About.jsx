import React from 'react'
import Banner from '../components/Banner'
import FeaturesBar from '../components/FeaturesBar'
import AboutSection from '../components/AboutSection'
import VisionSection from '../components/VisionSection'
import PremiumSystemsSection from '../components/PremiumSystemsSection'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import backgroundImage from '../assets/images/scandinavian-interior-mockup-wall-decal-background 2.png'

const About = () => {
  const premiumSystems = [
    {
      name: "Skin",
      category: "Hair Systems",
      image: "/src/assets/images/Rectangle 2.png",
      buttonText: "SHOP NOW"
    },
    {
      name: "Lace", 
      category: "Hair Systems",
      image: "/src/assets/images/Rectangle 2.png",
      buttonText: "SHOP NOW"
    },
    {
      name: "Hybrid",
      category: "Hair Systems", 
      image: "/src/assets/images/Rectangle 2.png",
      buttonText: "SHOP NOW"
    },
    {
      name: "Mono",
      category: "Hair Systems",
      image: "/src/assets/images/Rectangle 2.png", 
      buttonText: "SHOP NOW"
    }
  ]

  const testimonials = [
    {
      id: 1,
      name: "Harry Maguire",
      role: "CEO, company",
      avatar: "/src/assets/images/Ellipse 109.png",
      rating: 5,
      testimonialImage: "/src/assets/images/Rectangle 2.png",
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.",
      productImage: "/src/assets/images/Rectangle 1.png",
      productName: "Neo Hair System"
    },
    {
      id: 2,
      name: "John Smith",
      role: "Business Owner",
      avatar: "/src/assets/images/Ellipse 109.png",
      rating: 5,
      testimonialImage: "/src/assets/images/Rectangle 2.png",
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.",
      productImage: "/src/assets/images/Rectangle 1.png",
      productName: "Neo Hair System"
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Entrepreneur",
      avatar: "/src/assets/images/Ellipse 109.png",
      rating: 5,
      testimonialImage: "/src/assets/images/Rectangle 2.png",
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.",
      productImage: "/src/assets/images/Rectangle 1.png",
      productName: "Neo Hair System"
    }
  ]

  return (
    <div className="about-page">
      
      <Banner 
        badge="About Us"
        title="Who We Are & What We Stand For"
        description="Discover our commitment to quality, innovation, and customer satisfaction in the hair systems industry."
        backgroundImage={backgroundImage}
      />
      
      <FeaturesBar />
      
      <AboutSection 
        badge="Our Mission"
        title="Empowering Authentic Confidence"
        description="We believe that everyone deserves to feel confident and authentic in their own skin. Our mission is to provide high-quality hair systems that not only look natural but also empower our clients to live their lives with renewed confidence and self-assurance. Through innovative technology, expert craftsmanship, and personalized service, we help individuals rediscover their best selves."
        image={backgroundImage}
        reverse={false}
      />
      
      <VisionSection 
        badge="Our Vision"
        title="Leading the Way in Hair System Excellence"
        description="To be the global leader in hair system innovation, setting new standards for quality, comfort, and natural appearance. We envision a world where hair loss never limits confidence or opportunities, where our solutions seamlessly integrate into every lifestyle, and where exceptional customer experience is the foundation of lasting relationships."
      />
      
      <PremiumSystemsSection 
        title="Explore Our Premium Hair Systems"
        subtitle="Choose The Perfect System Tailored To Your Lifestyle, Comfort, And Natural Look."
        products={premiumSystems}
      />
      
      <Testimonials 
        title="What Our Clients Say"
        subtitle="Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Ut Et Massa Mi. Aliquam In Hendrerit Urna."
        testimonials={testimonials}
      />
      
      <Newsletter />
    </div>
  )
}

export default About
