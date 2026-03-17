import React, { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './BookAppointment.css'

const DEFAULT_THEME = {
  primaryColor: '1e3a8a',
  textColor: '111827',
  backgroundColor: 'ffffff'
}

const buildCalendlyUrl = (baseUrl, user) => {
  if (!baseUrl) return ''

  const fullName = user?.fullName || ''
  const email = user?.email || ''
  const hasQuery = baseUrl.includes('?')
  const joiner = hasQuery ? '&' : '?'
  const prefillParams = []

  if (fullName) prefillParams.push(`name=${encodeURIComponent(fullName)}`)
  if (email) prefillParams.push(`email=${encodeURIComponent(email)}`)

  const colorParams = [
    `primary_color=${DEFAULT_THEME.primaryColor}`,
    `text_color=${DEFAULT_THEME.textColor}`,
    `background_color=${DEFAULT_THEME.backgroundColor}`,
    'hide_event_type_details=1',
    'hide_landing_page_details=1',
    'hide_gdpr_banner=1'
  ]

  const query = [...prefillParams, ...colorParams].join('&')
  return query ? `${baseUrl}${joiner}${query}` : baseUrl
}

const BookAppointment = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const calendlyBaseUrl = import.meta.env.VITE_CALENDLY_EVENT_URL || ''

  const calendlyUrl = useMemo(
    () => buildCalendlyUrl(calendlyBaseUrl, user),
    [calendlyBaseUrl, user]
  )

  useEffect(() => {
    const handleCalendlyEvent = (event) => {
      if (!event?.data?.event || !String(event.data.event).startsWith('calendly.')) {
        return
      }

      if (event.data.event === 'calendly.event_scheduled') {
        navigate('/appointment-thank-you')
      }
    }

    window.addEventListener('message', handleCalendlyEvent)
    return () => window.removeEventListener('message', handleCalendlyEvent)
  }, [navigate])

  if (!calendlyBaseUrl) {
    return (
      <section className="book-appointment-page">
        <div className="book-appointment-container">
          <h1>Book an Appointment</h1>
          <p className="book-appointment-message">
            Calendly is not configured yet.
            Please add <code>VITE_CALENDLY_EVENT_URL</code> in client <code>.env</code>.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="book-appointment-page">
      <div className="book-appointment-container">
        <div className="book-appointment-header">
          <h1>Book Your Free Consultation</h1>
          <p>
            Choose a slot that works for you. We pre-filled your details to make booking faster.
          </p>
        </div>

        <div className="calendly-widget-shell">
          <iframe
            title="Calendly Appointment Booking"
            src={calendlyUrl}
            className="calendly-iframe"
            loading="lazy"
            key={calendlyUrl}
          />
        </div>

        <div className="book-appointment-actions">
          <Link to="/help-me-choose" className="book-back-link">Back to Help Me Choose</Link>
        </div>
      </div>
    </section>
  )
}

export default BookAppointment
