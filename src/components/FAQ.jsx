import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './FAQ.css'

const FAQ = ({ 
  title = "Frequently Asked Questions",
  subtitle = "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Ut Et Massa Mi. Aliquam In Hendrerit Urna.",
  faqs = []
}) => {
  const defaultFAQs = [
    {
      id: 1,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci a diam viverra ultrices."
    },
    {
      id: 2,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci a diam viverra ultrices."
    },
    {
      id: 3,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci a diam viverra ultrices."
    },
    {
      id: 4,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci a diam viverra ultrices."
    },
    {
      id: 5,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci a diam viverra ultrices."
    },
    {
      id: 6,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci a diam viverra ultrices."
    }
  ]

  const [expandedItem, setExpandedItem] = useState(2) // Default to item 2 being expanded
  const displayFAQs = faqs.length > 0 ? faqs : defaultFAQs

  const toggleExpanded = (id) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  return (
    <div className="faq-section">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="faq-container">
              {displayFAQs.map((faq, index) => (
                <div key={faq.id} className="faq-item">
                  <div 
                    className={`faq-question ${expandedItem === faq.id ? 'expanded' : ''}`}
                    onClick={() => toggleExpanded(faq.id)}
                  >
                    <div className="question-content">
                      <span className="question-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="question-text">{faq.question}</span>
                    </div>
                    <div className="question-arrow">
                      <span className={`arrow ${expandedItem === faq.id ? 'rotated' : ''}`}>
                        →
                      </span>
                    </div>
                  </div>
                  
                  {expandedItem === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FAQ
