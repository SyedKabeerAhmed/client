import React from 'react'
import TopBar from './TopBar'
import Navigation from './Navigation'
import Footer from './Footer'
import './Layout.css'

const Layout = ({ children }) => {
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
