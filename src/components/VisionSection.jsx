import React from 'react'
import { Container } from 'react-bootstrap'
import './VisionSection.css'

const VisionSection = ({ 
  badge = "Our Vision",
  title = "Leading the Way in Hair System Excellence",
  description
}) => {
  return (
    <div className="vision-section">
      <Container>
        <div className="vision-content">
          <div className="vision-badge">
            {badge}
          </div>
          <h2 className="vision-title">
            {title}
          </h2>
          <p className="vision-description">
            {description}
          </p>
        </div>
      </Container>
    </div>
  )
}

export default VisionSection

