import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Banner from "../components/Banner";
import FeaturesBar from "../components/FeaturesBar";
import PremiumSystemsSection from "../components/PremiumSystemsSection";
import BestSellingSection from "../components/BestSellingSection";
import StylesSection from "../components/StylesSection";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Newsletter from "../components/Newsletter";
import { productService } from "../services/productService";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const { t } = useTranslation();
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loadingBestSelling, setLoadingBestSelling] = useState(true);

  // Premium Hair Systems Data
  const premiumSystems = [
    {
      name: "Skin",
      category: "Hair Systems",
      image: "/src/assets/images/basetype_skin.png",
      buttonText: t("product.explore"),
    },
    {
      name: "Lace",
      category: "Hair Systems",
      image: "/src/assets/images/basetype_lace.png",
      buttonText: t("product.explore"),
    },
    {
      name: "Hybrid",
      category: "Hair Systems",
      image: "/src/assets/images/basetype_hybrid.png",
      buttonText: t("product.explore"),
    },
    {
      name: "Mono",
      category: "Hair Systems",
      image: "/src/assets/images/basetype_mono.png",
      buttonText: t("product.explore"),
    },
  ];

  // Fetch best selling products from API
  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        setLoadingBestSelling(true);
        const response = await productService.getBestSellingProducts({
          limit: 4,
        });

        // Handle API response format
        let products = [];
        if (response.success && response.data && response.data.products) {
          products = response.data.products;
        } else if (response.products) {
          products = response.products;
        }

        setBestSellingProducts(products);
      } catch (error) {
        console.error("Error fetching best selling products:", error);
        setBestSellingProducts([]);
      } finally {
        setLoadingBestSelling(false);
      }
    };

    fetchBestSellingProducts();
  }, []);

  return (
    <div className="home-page">
      <Helmet>
        <title>Best Hair Systems Online | Custom Wigs & Hair Replacement</title>
        <meta
          name="description"
          content="Shop premium hair systems, custom wigs, and accessories. Free shipping, expert advice, and personalized hair solutions for natural look."
        />
        <meta
          name="keywords"
          content="hair systems, custom hair, wigs, hair replacement, hair extensions, wig accessories"
        />
      </Helmet>

      <Banner
        badge={t("home.badge")}
        title={t("home.title")}
        description={t("home.description")}
        backgroundImages={[
          "/src/assets/images/HeroSectionImAges/2604_hphero_NAES_d_8f751b1c-c596-42ae-a4b3-e8cdf55f8b85.webp",
          "/src/assets/images/HeroSectionImAges/2604_hphero_TheCut_d_5eaf1f49-17de-4ef3-b949-a37566947f1a.webp",
          "/src/assets/images/HeroSectionImAges/2604_hphero_WeatherProof_d_1.webp",
        ]}
      />

      <FeaturesBar />

      <PremiumSystemsSection
        title={t("home.premiumSystems.title")}
        subtitle={t("home.premiumSystems.subtitle")}
        products={premiumSystems}
      />

      <BestSellingSection
        title={t("home.bestSelling.title")}
        subtitle={t("home.bestSelling.subtitle")}
        products={bestSellingProducts}
        loading={loadingBestSelling}
      />

      <StylesSection />

      <Testimonials />

      <FAQ />

      <Newsletter />
    </div>
  );
};

export default Home;
