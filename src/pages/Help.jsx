import React from 'react'
import { useTranslation } from 'react-i18next'
import Banner from '../components/Banner'
import FAQ from '../components/FAQ'
import Newsletter from '../components/Newsletter'

const Help = () => {
  const { t } = useTranslation()
  
  const helpFAQs = [
    {
      id: 1,
      question: t('help.trackOrder.question'),
      answer: t('help.trackOrder.answer')
    },
    {
      id: 2,
      question: t('help.shipping.question'),
      answer: t('help.shipping.answer')
    },
    {
      id: 3,
      question: t('help.returns.question'),
      answer: t('help.returns.answer')
    },
    {
      id: 4,
      question: t('help.chooseSystem.question'),
      answer: t('help.chooseSystem.answer')
    },
    {
      id: 5,
      question: t('help.care.question'),
      answer: t('help.care.answer')
    },
    {
      id: 6,
      question: t('help.installation.question'),
      answer: t('help.installation.answer')
    }
  ]

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
        subtitle="Lorem Ipsum Dolor Sit Amet. Consectetur Adipiscing Elit. Ut Et Massa Mi. Aliquam In Hendrerit Urna."
        faqs={helpFAQs}
      />
      
      <Newsletter />
    </div>
  )
}

export default Help
