import React from 'react'
import { Link } from 'react-router-dom'
import Newsletter from '../components/Newsletter'
import './HelpMeChoose.css'

const HelpMeChoose = () => {
  return (
    <div className="help-me-choose-page">
      <section className="hmc-hero">
        <div className="hmc-container">
          <div className="hmc-hero-content">
            <p className="hmc-eyebrow">Not sure which hair system is right for you?</p>
            <p className="hmc-eyebrow">You&apos;re not alone.</p>
            <h1>We make finding your perfect match simple and fast.</h1>
          </div>
          <div className="hmc-hero-image hmc-placeholder">Hero Image Placeholder</div>
        </div>
      </section>

      <section className="hmc-section">
        <div className="hmc-container hmc-grid">
          <div className="hmc-copy">
            <h2>Take our quiz</h2>
            <p>Our short quiz analyzes your needs and matches you with the perfect products.</p>
            <button type="button" className="hmc-btn">Get Started</button>
          </div>
          <div className="hmc-large-image hmc-placeholder">Quiz Preview Placeholder</div>
        </div>
      </section>

      <section className="hmc-section hmc-section-alt">
        <div className="hmc-container hmc-grid">
          <div className="hmc-medium-image hmc-placeholder">Consultation Image Placeholder</div>
          <div className="hmc-copy">
            <h2>Online Consultation</h2>
            <p>
              Hair loss can feel overwhelming, but you don&apos;t have to face it alone.
              With 10+ years of experience, our experts offer a free 30-minute video consultation
              to help you find the system that feels right for you.
            </p>
            <p className="hmc-note">
              A $20 deposit is required to schedule your consultation.
              After your session, you will receive a $20 discount coupon for your next purchase with us.
            </p>
            <Link to="/book-appointment" className="hmc-btn hmc-btn-link">Book an Appointment</Link>
          </div>
        </div>
      </section>

      <section className="hmc-section">
        <div className="hmc-container hmc-grid">
          <div className="hmc-copy">
            <h2>Connect with Support Team</h2>
            <p>
              Exceptions to our 24-hour customer service are Sundays and all public holidays.
              However, email support continues within daytime working hours and we endeavor to answer
              all emails within 24 hours.
            </p>
            <Link to="/contact" className="hmc-btn hmc-btn-link">Contact Us</Link>
          </div>
          <div className="hmc-medium-image hmc-placeholder">Support Team Image Placeholder</div>
        </div>
      </section>

      <section className="hmc-section hmc-section-alt">
        <div className="hmc-container hmc-grid">
          <div className="hmc-dual-placeholder">
            <div className="hmc-small-image hmc-placeholder">Product Model Placeholder</div>
            <div className="hmc-small-image hmc-placeholder">Product Detail Placeholder</div>
          </div>
          <div className="hmc-copy">
            <h2>Must-Haves for First-Timers</h2>
            <h3>Neo</h3>
            <p className="hmc-tag">The Best Choice for Beginners</p>
            <ul>
              <li>All-in-One</li>
              <li>Breathable lace center for better airflow</li>
              <li>Easy to cut and care for with skin perimeter</li>
              <li>A front contour crafted to match your genetic hairline</li>
            </ul>
            <Link to="/shop" className="hmc-btn hmc-btn-link">Shop Now</Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  )
}

export default HelpMeChoose
