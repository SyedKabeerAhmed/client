import React from 'react'
import Banner from '../components/Banner'
import FeaturesBar from '../components/FeaturesBar'
import PremiumSystemsSection from '../components/PremiumSystemsSection'
import BestSellingSection from '../components/BestSellingSection'
import StylesSection from '../components/StylesSection'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Newsletter from '../components/Newsletter'
import backgroundImage from '../assets/images/scandinavian-interior-mockup-wall-decal-background 2.png'

const Home = () => {
  // Premium Hair Systems Data
  const premiumSystems = [
    {
      name: "Skin",
      category: "Hair Systems",
      image: "/src/assets/images/image 108.png",
      buttonText: "Explore"
    },
    {
      name: "Lace", 
      category: "Hair Systems",
      image: "/src/assets/images/image 108.png",
      buttonText: "Explore"
    },
    {
      name: "Hybrid",
      category: "Hair Systems", 
      image: "/src/assets/images/image 108.png",
      buttonText: "Explore"
    },
    {
      name: "Mono",
      category: "Hair Systems",
      image: "/src/assets/images/image 108.png", 
      buttonText: "Explore"
    }
  ]

  // Best Selling Hair Systems Data
  const bestSellingSystems = [
    {
      name: "Neo Hair System",
      category: "Premium Collection",
      image: "/src/assets/images/Rectangle 2.png",
      price: "£200",
      description: "Combining the easy attachment of skin bases with the breathability of lace, hybrid systems offer a versatile solution.",
      ratings: {
        "Durability": 4,
        "Comfort": 4,
        "Appearance": 5,
        "Maintenance": 3
      }
    },
    {
      name: "Neo Hair System",
      category: "Premium Collection", 
      image: "/src/assets/images/Rectangle 2.png",
      price: "£200",
      description: "Combining the easy attachment of skin bases with the breathability of lace, hybrid systems offer a versatile solution.",
      ratings: {
        "Durability": 4,
        "Comfort": 4,
        "Appearance": 5,
        "Maintenance": 3
      }
    },
    {
      name: "Neo Hair System",
      category: "Premium Collection",
      image: "/src/assets/images/Rectangle 2.png", 
      price: "£200",
      description: "Combining the easy attachment of skin bases with the breathability of lace, hybrid systems offer a versatile solution.",
      ratings: {
        "Durability": 4,
        "Comfort": 4,
        "Appearance": 5,
        "Maintenance": 3
      }
    },
    {
      name: "Neo Hair System",
      category: "Premium Collection",
      image: "/src/assets/images/Rectangle 2.png",
      price: "£200", 
      description: "Combining the easy attachment of skin bases with the breathability of lace, hybrid systems offer a versatile solution.",
      ratings: {
        "Durability": 4,
        "Comfort": 4,
        "Appearance": 5,
        "Maintenance": 3
      }
    }
  ]

  return (
    <div className="home-page">
      
      <Banner 
        badge="New Arrival"
        title="Hair That Looks Real Confidence That Lasts"
        description="Explore systems made for comfort, style, and everyday wear."
        backgroundImage={backgroundImage}
      />
      
      <FeaturesBar />
      
      <PremiumSystemsSection 
        title="Explore Our Premium Hair Systems"
        subtitle="Choose The Perfect System Tailored To Your Lifestyle, Comfort, And Natural Look."
        products={premiumSystems}
      />
      
      <BestSellingSection 
        title="Our Best Selling Hair Systems"
        subtitle="Discover The Most Trusted And Popular Systems, Chosen By Clients For Their Natural Look, Comfort, And Durability."
        products={bestSellingSystems}
      />
      
      <StylesSection />
      
      <Testimonials />
      
      <FAQ />
      
      <Newsletter />
    </div>
  )
}

export default Home
