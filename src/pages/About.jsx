import React from "react";
import { useTranslation } from "react-i18next";
import Banner from "../components/Banner";
import FeaturesBar from "../components/FeaturesBar";
import AboutSection from "../components/AboutSection";
import VisionSection from "../components/VisionSection";
import PremiumSystemsSection from "../components/PremiumSystemsSection";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import { Helmet } from "react-helmet-async";

const About = () => {
  const { t } = useTranslation();

  const premiumSystems = [
    {
      name: "Skin",
      category: t("nav.hairSystems"),
      image: "/src/assets/images/Rectangle_2.png",
      buttonText: t("product.shopNow"),
    },
    {
      name: "Lace",
      category: t("nav.hairSystems"),
      image: "/src/assets/images/Rectangle_2.png",
      buttonText: t("product.shopNow"),
    },
    {
      name: "Hybrid",
      category: t("nav.hairSystems"),
      image: "/src/assets/images/Rectangle_2.png",
      buttonText: t("product.shopNow"),
    },
    {
      name: "Mono",
      category: t("nav.hairSystems"),
      image: "/src/assets/images/Rectangle_2.png",
      buttonText: t("product.shopNow"),
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Harry Maguire",
      role: "CEO, company",
      avatar: "/src/assets/images/Ellipse_109.png",
      rating: 5,
      testimonialImage: "/src/assets/images/Rectangle_2.png",
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.",
      productImage: "/src/assets/images/Rectangle_1.png",
      productName: "Neo Hair System",
    },
    {
      id: 2,
      name: "John Smith",
      role: "Business Owner",
      avatar: "/src/assets/images/Ellipse_109.png",
      rating: 5,
      testimonialImage: "/src/assets/images/Rectangle_2.png",
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.",
      productImage: "/src/assets/images/Rectangle_1.png",
      productName: "Neo Hair System",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Entrepreneur",
      avatar: "/src/assets/images/Ellipse_109.png",
      rating: 5,
      testimonialImage: "/src/assets/images/Rectangle_2.png",
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur.",
      productImage: "/src/assets/images/Rectangle_1.png",
      productName: "Neo Hair System",
    },
  ];

  return (
    <div className="about-page">
      <Helmet>
        <title>About Us | Leading Hair Systems & Wig Experts</title>
        <meta
          name="description"
          content="Learn about our hair systems expertise. We provide custom wigs, hair replacement solutions, and personalized care for confidence."
        />
        <meta
          name="keywords"
          content="about hair systems, wig experts, hair replacement company, custom hair solutions"
        />
      </Helmet>

      <Banner
        badge={t("about.badge")}
        title={t("about.title")}
        description={t("about.description")}
        backgroundImage="/src/assets/images/scandinavian-interior-mockup-wall-decal-background_2.png"
      />

      <FeaturesBar />

      <AboutSection
        badge={t("about.mission.badge")}
        title={t("about.mission.title")}
        description={t("about.mission.description")}
        image="/src/assets/images/scandinavian-interior-mockup-wall-decal-background_2.png"
        reverse={false}
      />

      <VisionSection
        badge={t("about.vision.badge")}
        title={t("about.vision.title")}
        description={t("about.vision.description")}
      />

      <PremiumSystemsSection
        title={t("home.premiumSystems.title")}
        subtitle={t("home.premiumSystems.subtitle")}
        products={premiumSystems}
      />

      <Testimonials
        title={t("about.testimonialsTitle")}
        subtitle="Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Ut Et Massa Mi. Aliquam In Hendrerit Urna."
        testimonials={testimonials}
      />

      <Newsletter />
    </div>
  );
};

export default About;
