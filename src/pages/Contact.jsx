import React, { useState } from 'react'
import Newsletter from '../components/Newsletter'
import { contactService } from '../services/contactService'
import './Contact.css'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  requirements: ''
}

const Contact = () => {
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')

    try {
      setLoading(true)
      await contactService.submit(formData)
      setSuccessMessage('Message sent successfully. Our team will contact you shortly.')
      setFormData(initialForm)
    } catch (error) {
      setErrorMessage(error.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-overlay">
          <h1>Contact Us</h1>
          <p>Now is your time to shine.</p>
          <p>Tell us about you and your needs.</p>
          <p>You&apos;re one click away from your own amazing transformation.</p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-main-inner">
          <h2>Lordhair Customer Service Is Available 24 Hours A Day</h2>
          <p className="contact-note">
            Exceptions to our 24-hour customer service are Sundays and all public holidays.
            However, email support continues within daytime working hours and we endeavor to answer all emails within 24 hours.
          </p>

          <div className="contact-info-card">
            <p><strong>Email:</strong> support@lordhair.com</p>
            <p><strong>WhatsApp:</strong> +1 626 341 7321</p>
            <p><strong>US:</strong> +1 800 231 5503</p>
            <p><strong>UK:</strong> 00800 0825 1058</p>
          </div>

          <h3 className="contact-form-title">Email Us Now</h3>

          <form className="contact-form-card" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name here *"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email here *"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone here *"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="requirements"
              placeholder="Requirements *"
              rows="6"
              value={formData.requirements}
              onChange={handleInputChange}
              required
            />

            {successMessage && <p className="form-success">{successMessage}</p>}
            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </form>

          <p className="contact-small-text">
            If you have any questions, you can contact us through the chat function directly on the website.
            A friendly and real customer service person will be online to help you!
          </p>
          <a href="/help" className="contact-link">Chat Online Now</a>
        </div>
      </section>

      <section className="contact-regions">
        <p className="contact-region-head">
          If you are already a customer with a dedicated customer service representative, please contact us
          at the following times, and we will reply to your message within 24 hours.
        </p>
        <div className="contact-region-grid">
          <div className="region-card">
            <h4>USA/Canada</h4>
            <p>Sun-Fri: 7:30pm-4:30am EST</p>
            <p>Fri: 8:00pm-11:00pm EST</p>
          </div>
          <div className="region-card">
            <h4>UK/Ireland</h4>
            <p>Mon-Fri: 12:30am-9:30am GMT</p>
            <p>Sat: 1:00am-4:00am GMT</p>
          </div>
          <div className="region-card">
            <h4>Central Europe</h4>
            <p>Mon-Fri: 1:30am-10:30am CET</p>
            <p>Sat: 2:00am-5:00am CET</p>
          </div>
          <div className="region-card">
            <h4>India</h4>
            <p>Mon-Fri: 6:00am-3:00pm IST</p>
            <p>Sat: 6:30am-9:30am IST</p>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  )
}

export default Contact
