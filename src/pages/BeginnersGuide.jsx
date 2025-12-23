import React from 'react'
import { useTranslation } from 'react-i18next'
import Banner from '../components/Banner'
import FeaturesBar from '../components/FeaturesBar'
import StylesSection from '../components/StylesSection'
import ProductSection from '../components/ProductSection'
import Newsletter from '../components/Newsletter'

const BeginnersGuide = () => {
  const { t } = useTranslation()
  
  const premiumSystems = [
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: t('nav.hairSystems'),
      image: "/src/assets/images/image_115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: t('beginnersGuide.exploreMore')
    },
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: t('nav.hairSystems'),
      image: "/src/assets/images/image_115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: t('beginnersGuide.exploreMore')
    },
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: t('nav.hairSystems'),
      image: "/src/assets/images/image_115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: t('beginnersGuide.exploreMore')
    },
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: t('nav.hairSystems'),
      image: "/src/assets/images/image_115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: t('beginnersGuide.exploreMore')
    },
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: t('nav.hairSystems'),
      image: "/src/assets/images/image_115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: t('beginnersGuide.exploreMore')
    },
    {
      name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: t('nav.hairSystems'),
      image: "/src/assets/images/image_115.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      buttonText: t('beginnersGuide.exploreMore')
    }
  ]

  return (
    <div className="beginners-guide-page">
      
      <Banner 
        badge={t('beginnersGuide.badge')}
        title={t('beginnersGuide.title')}
        description={t('beginnersGuide.description')}
        backgroundImage="/src/assets/images/scandinavian-interior-mockup-wall-decal-background_2.png"
      />
      
      <FeaturesBar />
      
      <StylesSection />
      
      <ProductSection 
        title={t('home.premiumSystems.title')}
        subtitle={t('home.premiumSystems.subtitle')}
        products={premiumSystems}
        showRatings={false}
        showPrice={false}
        beginnersGuide={true}
        buttonText={t('beginnersGuide.exploreMore')}
      />
      
      <Newsletter />
    </div>
  )
}

export default BeginnersGuide
