import React from 'react'
import Banner from '../components/Banner'
import FeaturesBar from '../components/FeaturesBar'
import StylesSection from '../components/StylesSection'
import ProductSection from '../components/ProductSection'
import Newsletter from '../components/Newsletter'
import backgroundImage from '../assets/images/scandinavian-interior-mockup-wall-decal-background 2.png'

const BeginnersGuide = () => {
  const premiumSystems = [
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: "Hair Systems",
      image: "/src/assets/images/image 115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: "Explore More"
    },
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: "Hair Systems",
      image: "/src/assets/images/image 115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: "Explore More"
    },
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: "Hair Systems",
      image: "/src/assets/images/image 115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: "Explore More"
    },
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: "Hair Systems",
      image: "/src/assets/images/image 115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: "Explore More"
    },
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: "Hair Systems",
      image: "/src/assets/images/image 115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: "Explore More"
    },
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: "Hair Systems",
      image: "/src/assets/images/image 115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: "Explore More"
    }
  ]

  return (
    <div className="beginners-guide-page">
      
      <Banner 
        badge="Beginners Guide"
        title="New to Hair Systems? Start Here"
        description="Learn the basics of hair systems with simple guides, tips, and expert advice to help you start with confidence."
        backgroundImage={backgroundImage}
      />
      
      <FeaturesBar />
      
      <StylesSection />
      
      <ProductSection 
        title="Explore Our Premium Hair Systems"
        subtitle="Choose The Perfect System Tailored To Your Lifestyle, Comfort, And Natural Look."
        products={premiumSystems}
        showRatings={false}
        showPrice={false}
        beginnersGuide={true}
        buttonText="Explore More"
      />
      
      <Newsletter />
    </div>
  )
}

export default BeginnersGuide
