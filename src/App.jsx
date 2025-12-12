import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Help from './pages/Help'
import BeginnersGuide from './pages/BeginnersGuide'
import CustomHairSystem from './pages/CustomHairSystem'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import OTPVerification from './pages/OTPVerification'
import ResetPassword from './pages/ResetPassword'
import DashboardRouter from './dashboards/DashboardRouter'
import Profile from './pages/Profile'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import HairCustomization from './pages/HairCustomization'
import { ToastProvider } from './components/Toast'
import './App.css'

function App() {
  return (
    <ToastProvider>
      <div className="App">
        <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/help" element={<Layout><Help /></Layout>} />
        <Route path="/beginners-guide" element={<Layout><BeginnersGuide /></Layout>} />
        <Route path="/custom-hair-system" element={<Layout><CustomHairSystem /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
        <Route path="/otp-verification" element={<Layout><OTPVerification /></Layout>} />
        <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/admin/dashboard" element={<DashboardRouter />} />
        <Route path="/subadmin/dashboard" element={<DashboardRouter />} />
        <Route path="/factory/dashboard" element={<DashboardRouter />} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/hair-customization" element={<Layout><HairCustomization /></Layout>} />
        <Route path="*" element={<Layout><Home /></Layout>} />
      </Routes>
    </div>
    </ToastProvider>
  )
}

export default App
