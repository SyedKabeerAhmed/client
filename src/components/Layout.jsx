import React from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import Navigation from './Navigation'
import Footer from './Footer'
import './Layout.css'

const Layout = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealTargets = document.querySelectorAll(
      '.main-content section, .main-content .card, .main-content .faq-item, .main-content .region-card, .main-content .slider-slide'
    )

    if (reducedMotion) {
      revealTargets.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px'
      }
    )

    revealTargets.forEach((element) => {
      element.classList.add('scroll-reveal')
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [location.pathname])

  return (
    <div className="app-layout">
      <TopBar />
      <Navigation />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
