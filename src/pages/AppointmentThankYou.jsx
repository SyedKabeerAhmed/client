import React from 'react'
import { Link } from 'react-router-dom'
import './AppointmentThankYou.css'

const AppointmentThankYou = () => {
  return (
    <section className="appointment-thank-you-page">
      <div className="appointment-thank-you-card">
        <p className="thank-you-kicker">Appointment Confirmed</p>
        <h1>Thank you for booking with us</h1>
        <p>
          Your consultation is scheduled. You will receive Calendly confirmation details
          and reminders in your email inbox.
        </p>
        <div className="thank-you-actions">
          <Link to="/help-me-choose" className="thank-you-btn">Back to Help Me Choose</Link>
          <Link to="/shop" className="thank-you-btn thank-you-btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </section>
  )
}

export default AppointmentThankYou
