import React, { useState, useRef, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import './Testimonials.css'
import avatar from '../assets/images/Ellipse 109.png'
import productImage from '../assets/images/Rectangle 1.png'
import testimonialImage from '../assets/images/Rectangle 2.png'

const Testimonials = ({ 
  title = "What Our Clients Say",
  subtitle = "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Ut Et Massa Mi. Aliquam In Hendrerit Urna.",
  testimonials = []
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const sliderRef = useRef(null)
  const defaultTestimonials = [
    {
      id: 1,
      name: "Harry Maquiro",
      role: "CEO, company",
      avatar: avatar,
      rating: 5,
      testimonialImage: testimonialImage,
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.",
      productImage: productImage,
      productName: "Neo Hair System"
    },
    {
      id: 2,
      name: "John Smith",
      role: "Business Owner",
      avatar: avatar,
      rating: 5,
      testimonialImage: testimonialImage,
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.",
      productImage: productImage,
      productName: "Neo Hair System"
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Entrepreneur",
      avatar: avatar,
      rating: 5,
      testimonialImage: testimonialImage,
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.",
      productImage: productImage,
      productName: "Neo Hair System"
    },
    {
      id: 4,
      name: "Mike Johnson",
      role: "Entrepreneur",
      avatar: avatar,
      rating: 5,
      testimonialImage: testimonialImage,
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.",
      productImage: productImage,
      productName: "Neo Hair System"
    },
    {
      id: 5,
      name: "Mike Johnson",
      role: "Entrepreneur",
      avatar: avatar,
      rating: 5,
      testimonialImage: testimonialImage,
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.",
      productImage: productImage,
      productName: "Neo Hair System"
    }
  ]

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials

  // Handle mouse/touch events for dragging
  const handleStart = (e) => {
    setIsDragging(true)
    setStartX(e.pageX || e.touches[0].pageX)
    setScrollLeft(sliderRef.current.scrollLeft)
  }

  const handleMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX || e.touches[0].pageX
    const walk = (x - startX) * 2
    sliderRef.current.scrollLeft = scrollLeft - walk
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging && sliderRef.current) {
        const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth
        const nextIndex = (currentIndex + 1) % displayTestimonials.length
        setCurrentIndex(nextIndex)
        
        sliderRef.current.scrollTo({
          left: (nextIndex * sliderRef.current.clientWidth),
          behavior: 'smooth'
        })
      }
    }, 5000) // Auto-scroll every 5 seconds

    return () => clearInterval(interval)
  }, [currentIndex, isDragging, displayTestimonials.length])

  return (
    <div className="testimonials-section">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        
        <div 
          className="testimonials-slider"
          ref={sliderRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          <div className="testimonials-track">
            {displayTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-slide">
                <div className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="client-info">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="client-avatar"
                      />
                      <div className="client-details">
                        <h5 className="client-name">{testimonial.name}</h5>
                        <p className="client-role">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="testimonial-image">
                    <img 
                      src={testimonial.testimonialImage} 
                      alt={testimonial.name}
                      className="testimonial-image"
                    />
                  </div>
                  <div className="testimonial-content">
                    <blockquote className="testimonial-quote">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                  
                  <div className="testimonial-footer">
                    <div className="product-info">
                      <img 
                        src={testimonial.productImage} 
                        alt={testimonial.productName}
                        className="product-image"
                      />
                      <span className="product-name">{testimonial.productName}</span>
                    </div>
                    <button className="shop-now-btn">Shop Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Testimonials
