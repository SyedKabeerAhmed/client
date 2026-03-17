import React from 'react'
import { useTranslation } from 'react-i18next'
import Banner from '../components/Banner'
import FAQ from '../components/FAQ'
import Newsletter from '../components/Newsletter'
import { lordhairFaqs } from '../data/faqs'

const Help = () => {
  const { t } = useTranslation()
  
  return (
    <div className="help-page">
      
      <Banner 
        badge={t('help.badge')}
        title={t('help.title')}
        description={t('help.description')}
        backgroundImage="/src/assets/images/scandinavian-interior-mockup-wall-decal-background_2.png"
      />
      
      <FAQ 
        title={t('help.faqTitle')}
        subtitle="Find answers to common questions about products, ordering, shipping, maintenance, and custom systems."
        faqs={lordhairFaqs}
      />
      
      <Newsletter />
    </div>
  )
}

export default Help
