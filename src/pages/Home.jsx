import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const [bestSellingProducts, setBestSellingProducts] = useState([])
  const [loadingBestSelling, setLoadingBestSelling] = useState(true)

  // Premium Hair Systems Data
  const premiumSystems = [
    {
      name: "Skin",
      category: "Hair Systems",
      image: "/src/assets/images/basetype_skin.png",
      buttonText: t('product.explore')
    },
    {
      name: "Lace", 
      category: "Hair Systems",
      image: "/src/assets/images/basetype_lace.png",
      buttonText: t('product.explore')
    },
    {
      name: "Hybrid",
      category: "Hair Systems", 
      image: "/src/assets/images/basetype_hybrid.png",
      buttonText: t('product.explore')
    },
    {
      name: "Mono",
      category: "Hair Systems",
      image: "/src/assets/images/basetype_mono.png", 
      buttonText: t('product.explore')
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
        badge={t('home.badge')}
        title={t('home.title')}
        description={t('home.description')}
        backgroundImage="/src/assets/images/scandinavian-interior-mockup-wall-decal-background_2.png"
      />
      
      <FeaturesBar />
      
      <PremiumSystemsSection 
        title={t('home.premiumSystems.title')}
        subtitle={t('home.premiumSystems.subtitle')}
        products={premiumSystems}
      />
      
      <BestSellingSection 
        title={t('home.bestSelling.title')}
        subtitle={t('home.bestSelling.subtitle')}
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
