import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";

const Banner = ({
  badge,
  title,
  description,
  backgroundImage,
  backgroundImages,
  imageAlt = "Banner Image",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use backgroundImages array if provided, otherwise fallback to single backgroundImage
  const images =
    backgroundImages && backgroundImages.length > 0
      ? backgroundImages
      : backgroundImage
        ? [backgroundImage]
        : [];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    beforeChange: (current, next) => setCurrentSlide(next),
    arrows: false,
    lazyLoad: "ondemand",
  };

  return (
    <div className="banner-section">
      {images.length > 1 ? (
        <div className="banner-slider-wrapper">
          <Slider {...sliderSettings} className="banner-slider">
            {images.map((image, index) => (
              <div key={index} className="banner-slide">
                <div
                  className="banner-background"
                  style={{ backgroundImage: `url(${image})` }}
                >
                  {/* <div className="banner-overlay">
                    <Container>
                      <Row className="align-items-center min-vh-50">
                        <Col lg={6} md={8}>
                          <div className="banner-content">
                            <div className="banner-badge">{badge}</div>
                            <h1 className="banner-title">{title}</h1>
                            <p className="banner-description">{description}</p>
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  </div> */}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="banner-slide">
          <div
            className="banner-background"
            style={{ backgroundImage: `url(${images[0] || backgroundImage})` }}
          >
            <div className="banner-overlay">
              <Container>
                <Row className="align-items-center min-vh-50">
                  <Col lg={6} md={8}>
                    <div className="banner-content">
                      <div className="banner-badge">{badge}</div>
                      <h1 className="banner-title">{title}</h1>
                      <p className="banner-description">{description}</p>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
