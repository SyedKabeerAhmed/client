import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-bootstrap'
import './LanguageSwitcher.css'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <Dropdown 
      show={isOpen} 
      onToggle={setIsOpen}
      className="language-switcher"
    >
      <Dropdown.Toggle variant="outline-secondary" className="language-toggle">
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-name">{currentLanguage.name}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="language-menu">
        {languages.map((lang) => (
          <Dropdown.Item
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            active={i18n.language === lang.code}
            className="language-item"
          >
            <span className="language-flag">{lang.flag}</span>
            <span className="language-name">{lang.name}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default LanguageSwitcher

