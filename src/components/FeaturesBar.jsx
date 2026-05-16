import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./FeaturesBar.css";

const FeaturesBar = () => {
  const { t } = useTranslation();
  const moneyBackBadge = new URL(
    "../assets/images/30-days.png",
    import.meta.url,
  ).href;

  const features = [
    {
      title: "Free Shipping",
      description: "Fast, reliable delivery on all orders.",
      iconType: "fontawesome",
      iconClass: "fa-regular fa-paper-plane",
    },
    {
      title: "30-Day Money-Back Warranty",
      description: "Shop with confidence, risk-free.",
      iconType: "image",
      iconSrc: moneyBackBadge,
      iconAlt: "30-day money-back warranty badge",
    },
    {
      title: "Secure Payment",
      description: "Your payments are protected and encrypted.",
      iconType: "svg-secure",
    },
    {
      title: "First Purchase Assurance",
      description: "Extra coverage for your first order.",
      iconType: "fontawesome",
      iconClass: "fa-regular fa-clipboard",
    },
  ];

  return (
    <div className="features-bar">
      <Container>
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col md={4} key={index}>
              <div className="feature-item">
                <div className="feature-icon">
                  {feature.iconType === "fontawesome" && (
                    <i className={feature.iconClass} aria-hidden="true"></i>
                  )}
                  {feature.iconType === "image" && (
                    <img src={feature.iconSrc} alt={feature.iconAlt} />
                  )}
                  {feature.iconType === "svg-secure" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#054C73"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <circle cx="12" cy="12" r="5.25" />
                      <path d="M9.5 12.5l1.7 1.7 3.3-3.3" />
                    </svg>
                  )}
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default FeaturesBar;
