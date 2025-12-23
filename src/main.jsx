import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './i18n/config' // Initialize i18n
import './i18n/rtl.css' // RTL support for Arabic
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
