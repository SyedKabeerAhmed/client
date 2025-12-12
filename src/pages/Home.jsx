import React, { useState, useEffect } from 'react'
import Banner from '../components/Banner'
import FeaturesBar from '../components/FeaturesBar'
import PremiumSystemsSection from '../components/PremiumSystemsSection'
import BestSellingSection from '../components/BestSellingSection'
import StylesSection from '../components/StylesSection'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Newsletter from '../components/Newsletter'
import { productService } from '../services/productService'

const Home = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([])
  const [loadingBestSelling, setLoadingBestSelling] = useState(true)

  // Premium Hair Systems Data
  const premiumSystems = [
    {
      name: "Skin",
      category: "Hair Systems",
      image: "/src/assets/images/image_108.png",
      buttonText: "Explore"
    },
    {
      name: "Lace", 
      category: "Hair Systems",
      image: "/src/assets/images/image_108.png",
      buttonText: "Explore"
    },
    {
      name: "Hybrid",
      category: "Hair Systems", 
      image: "/src/assets/images/image_108.png",
      buttonText: "Explore"
    },
    {
      name: "Mono",
      category: "Hair Systems",
      image: "/src/assets/images/image_108.png", 
      buttonText: "Explore"
    }
  ]

  // Fetch best selling products from API
  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        setLoadingBestSelling(true)
        const response = await productService.getBestSellingProducts({ limit: 4 })
        
        // Handle API response format
        let products = []
        if (response.success && response.data && response.data.products) {
          products = response.data.products
        } else if (response.products) {
          products = response.products
        }
        
        setBestSellingProducts(products)
      } catch (error) {
        console.error('Error fetching best selling products:', error)
        setBestSellingProducts([])
      } finally {
        setLoadingBestSelling(false)
      }
    }

    fetchBestSellingProducts()
  }, [])

  return (
    <div className="home-page">
      
      <Banner 
        badge="New Arrival"
        title="Hair That Looks Real Confidence That Lasts"
        description="Explore systems made for comfort, style, and everyday wear."
        backgroundImage="/src/assets/images/scandinavian-interior-mockup-wall-decal-background_2.png"
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
        products={bestSellingProducts}
        loading={loadingBestSelling}
      />
      
      <StylesSection />
      
      <Testimonials />
      
      <FAQ />
      
      <Newsletter />
    </div>
  )
}

export default Home
