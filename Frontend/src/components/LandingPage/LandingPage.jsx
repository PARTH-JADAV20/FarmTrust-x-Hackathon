import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import farmersImage from '../../assets/farmers-illustration.jpg';
import organicVegetables from '../../assets/organic-vegetables.jpg';
import freshFruits from '../../assets/fresh-fruits.jpg';
import organicGrains from '../../assets/organic-grains.jpg';
import rajeshKumar from '../../assets/rajesh-kumar.jpg';
import priyaSingh from '../../assets/priya-singh.jpg';
import amitPatel from '../../assets/rajesh-kumar.jpg';
import organicCompost from '../../assets/organic-compost.jpg';
import naturalPestControl from '../../assets/natural-pest-control.jpg';
import soilEnricher from '../../assets/soil-enricher.jpg';
import { FaUserPlus, FaCheck, FaStore, FaSearch, FaShoppingCart, FaCertificate, FaStar, FaUser } from 'react-icons/fa';
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdVerifiedUser } from "react-icons/md";
import { BiLeaf } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { loginWithPopup, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeGuide, setActiveGuide] = useState(null);

  const renderStars = (rating, total = 5) => {
    const stars = [];
    for (let i = 1; i <= total; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'star-icon-d6 filled-d6' : 'star-icon-d6 empty-d6'}
        />
      );
    }
    return (
      <div className="stars-d6">
        {stars}
        <span className="review-count-d6">{rating}/{total}</span>
      </div>
    );
  };

  const handleApplyForFarmer = async () => {
    if (isAuthenticated) {
      navigate('/farmer-application');
    } else {
      try {
        await loginWithPopup();
        if (isAuthenticated) {
          navigate('/farmer-application');
        }
      } catch (error) {
        console.error('Login failed or cancelled:', error);
        return;
      }
    }
  };

  const guideContent = {
    farmer: {
      title: t('farmer_guide_modal_title'),
      intro: t('farmer_guide_modal_intro'),
      steps: [
        t('farmer_guide_step_1'),
        t('farmer_guide_step_2'),
        t('farmer_guide_step_3'),
        t('farmer_guide_step_4'),
      ],
    },
    user: {
      title: t('user_guide_modal_title'),
      intro: t('user_guide_modal_intro'),
      steps: [
        t('user_guide_step_1'),
        t('user_guide_step_2'),
        t('user_guide_step_3'),
        t('user_guide_step_4'),
        t('user_guide_step_5'),
      ],
    },
  };

  useEffect(() => {
    document.body.classList.toggle('landing-guide-modal-open', Boolean(activeGuide));

    return () => {
      document.body.classList.remove('landing-guide-modal-open');
    };
  }, [activeGuide]);



  return (
    <div className="landing-page-d6">

      <div className="banner-section-d6">
        <div className="farmer-banner-d6">
          <div className="banner-content-d6">
            <h1 className="banner-title-d6">{t('empowering_farmers')}</h1>
            <p className="banner-description-d6">{t('transparent_marketplace')}</p>
            <div>
              <button
                className="explore-button-d6"
                style={{ backgroundColor: 'black', marginRight: '10px' }}
                onClick={handleApplyForFarmer}
              >
                {t('apply_for_farmer')}
              </button>
              <Link to="/products">
                <button className="explore-button-d6">{t('explore_products')}</button>
              </Link>
            </div>
          </div>
          <div className="banner-image-d6">
            <img src={farmersImage} alt="Farmers Illustration" />
          </div>
        </div>
      </div>

      <div className="content-d6">
        {/* Why Choose Us Section */}
        <div className="why-choose-us-d6">
          <h2 className="section-title-d6">{t('why_choose_us')}</h2>
          <div className="features-d6">
            <div className="feature-item-d6">
              <MdVerifiedUser className="feature-icon-d6" />
              <h3 className="feature-title-d6">{t('verified_farmers')}</h3>
              <p className="feature-description-d6">{t('verified_farmers_desc')}</p>
            </div>
            <div className="feature-item-d6">
              <FaStore className="feature-icon-d6" />
              <h3 className="feature-title-d6">{t('direct_market')}</h3>
              <p className="feature-description-d6">{t('direct_market_desc')}</p>
            </div>
            <div className="feature-item-d6">
              <FaCertificate className="feature-icon-d6" />
              <h3 className="feature-title-d6">{t('certified_farmers')}</h3>
              <p className="feature-description-d6">{t('certified_farmers_desc')}</p>
            </div>
          </div>
        </div>

        {/* Guide Section */}
        <div className="guide-section-d6">
          <h2 className="section-title-d6">{t('guide_title')}</h2>
          <div className="guides-container-d6">
            <div className="guide-card-d6">
              <div className="guide-icon-d6">
                <BiLeaf />
              </div>
              <h3 className="guide-title-d6">{t('farmer_guide')}</h3>
              <p className="guide-description-d6">{t('farmer_guide_desc')}</p>
              <button className="read-more-btn-d6" onClick={() => setActiveGuide('farmer')}>
                {t('read_more')}
              </button>
            </div>
            <div className="guide-card-d6">
              <div className="guide-icon-d6">
                <FaUser />
              </div>
              <h3 className="guide-title-d6">{t('user_guide')}</h3>
              <p className="guide-description-d6">{t('user_guide_desc')}</p>
              <button className="read-more-btn-d6" onClick={() => setActiveGuide('user')}>
                {t('read_more')}
              </button>
            </div>
          </div>
        </div>

        {/* Shop Organic Products Section */}
        <div className="shop-section-d6">
          <div className="shop-banner-d6">
            <div className="shop-banner-copy-d6">
              <span className="sponsored-pill-d6">Sponsored Ad</span>
              <h2 className="shop-banner-title-d6">{t('shop_organic')}</h2>
              <p className="shop-banner-description-d6">{t('ad_banner_description')}</p>
              <div className="shop-banner-tags-d6">
                <div className="shop-tag-d6">
                  <img src={organicCompost} alt="Organic Compost" />
                  <span>{t('organic_compost')}</span>
                </div>
                <div className="shop-tag-d6">
                  <img src={naturalPestControl} alt="Natural Pest Control" />
                  <span>{t('natural_pest_control')}</span>
                </div>
                <div className="shop-tag-d6">
                  <img src={soilEnricher} alt="Soil Enricher" />
                  <span>{t('soil_enricher')}</span>
                </div>
              </div>
              <Link to="/products" className="shop-banner-cta-d6">
                {t('explore_products')}
              </Link>
            </div>
            <div className="shop-banner-visual-d6">
              <img src={organicCompost} alt="Organic compost banner" className="shop-banner-image-d6" />
              <div className="shop-banner-note-d6">
                <span className="shop-banner-note-label-d6">{t('sponsored_ad')}</span>
                <span>{t('ad_banner_note')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="featured-products-d6">
          <h2 className="section-title-d6">{t('featured_products')}</h2>
          <div className="products-d6">
            <Link to="/products?category=Vegetables">
              <div className="product-card-d6">
                <img src={organicVegetables} alt="Organic Vegetables" className="product-image-d6" />
                <h3 className="product-title-d6">{t('organic_vegetables')}</h3>
                <p className="product-price-d6">₹249/kg</p>
                <button className="view-details-button-d6">{t('view_details')}</button>
              </div>
            </Link>
            <Link to="/products?category=Fruits">
              <div className="product-card-d6">
                <img src={freshFruits} alt="Fresh Fruits" className="product-image-d6" />
                <h3 className="product-title-d6">{t('organic_fruits')}</h3>
                <p className="product-price-d6">₹199/kg</p>
                <button className="view-details-button-d6">{t('view_details')}</button>
              </div>
            </Link>
            <Link to="/products?category=Grains">
              <div className="product-card-d6">
                <img src={organicGrains} alt="Organic Grains" className="product-image-d6" />
                <h3 className="product-title-d6">{t('organic_grains')}</h3>
                <p className="product-price-d6">₹89/kg</p>
                <button className="view-details-button-d6">{t('view_details')}</button>
              </div>
            </Link>
          </div>
        </div>

        {/* Recommended Farmers Section */}
        <div className="recommended-farmers-d6">
          <h2 className="section-title-d6">{t('recommended_farmers')}</h2>
          <div className="farmers-d6">
            <div className="farmer-card-d6">
              <img src={rajeshKumar} alt="Rajesh Kumar" className="farmer-image-d6" />
              <div className="farmer-info-d6">
                <h3 className="farmer-name-d6">{t('rajesh_kumar')}</h3>
                <p className="farmer-type-d6">{t('organic_farming')}</p>
                {renderStars(4)}
              </div>
              <MdVerifiedUser className="verified-icon-d6" />
            </div>
            <div className="farmer-card-d6">
              <img src={priyaSingh} alt="Priya Singh" className="farmer-image-d6" />
              <div className="farmer-info-d6">
                <h3 className="farmer-name-d6">{t('priya_singh')}</h3>
                <p className="farmer-type-d6">{t('vegetable_farming')}</p>
                {renderStars(3)}
              </div>
              <MdVerifiedUser className="verified-icon-d6" />
            </div>
            <div className="farmer-card-d6">
              <img src={amitPatel} alt="Amit Patel" className="farmer-image-d6" />
              <div className="farmer-info-d6">
                <h3 className="farmer-name-d6">{t('amit_patel')}</h3>
                <p className="farmer-type-d6">{t('sustainable_farming')}</p>
                {renderStars(5)}
              </div>
              <MdVerifiedUser className="verified-icon-d6" />
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="how-it-works-d6">
          <h2 className="section-title-d6">{t('how_it_works')}</h2>
          <div className="works-container-d6">
            <div className="works-column-d6">
              <h3 className="column-title-d6">{t('for_farmers')}</h3>
              <div className="works-step-d6">
                <FaUserPlus className="step-icon-d6" />
                <div className="step-line-d6"></div>
                <FaCheck className="step-icon-d6" />
                <div className="step-line-d6"></div>
                <FaStore className="step-icon-d6" />
              </div>
              <p className="works-description-d6">{t('for_farmers_steps')}</p>
            </div>
            <div className="works-column-d6">
              <h3 className="column-title-d6">{t('for_consumers')}</h3>
              <div className="works-step-d6">
                <FaSearch className="step-icon-d6" />
                <div className="step-line-d6"></div>
                <IoDocumentTextOutline className="step-icon-d6" />
                <div className="step-line-d6"></div>
                <FaShoppingCart className="step-icon-d6" />
              </div>
              <p className="works-description-d6">{t('for_consumers_steps')}</p>
            </div>
          </div>
        </div>

        {/* Customer Testimonials Section */}
        <div className="testimonials-d6">
          <h2 className="section-title-d6">{t('testimonials')}</h2>
          <div className="testimonials-container-d6">
            <div className="testimonial-card-d6">
              {renderStars(5)}
              <p className="testimonial-text-d6">{t('sarah_testimonial')}</p>
              <div className="customer-info-d6">
                <img src={rajeshKumar} alt="Sarah Johnson" className="customer-image-d6" />
                <div className="customer-details-d6">
                  <h3 className="customer-name-d6">{t('sarah_name')}</h3>
                  <p className="customer-role-d6">{t('sarah_role')}</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card-d6">
              {renderStars(5)}
              <p className="testimonial-text-d6">{t('michael_testimonial')}</p>
              <div className="customer-info-d6">
                <img src={priyaSingh} alt="Michael Chen" className="customer-image-d6" />
                <div className="customer-details-d6">
                  <h3 className="customer-name-d6">{t('michael_name')}</h3>
                  <p className="customer-role-d6">{t('michael_role')}</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card-d6">
              {renderStars(5)}
              <p className="testimonial-text-d6">{t('emma_testimonial')}</p>
              <div className="customer-info-d6">
                <img src={amitPatel} alt="Emma Wilson" className="customer-image-d6" />
                <div className="customer-details-d6">
                  <h3 className="customer-name-d6">{t('emma_name')}</h3>
                  <p className="customer-role-d6">{t('emma_role')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Join Our Growing Community Section */}
        <div className="community-section-d6">
          <h2 className="community-title-d6">{t('join_community')}</h2>
          <div className="community-buttons-d6">
            <button className="community-button-d6 register-farmer">{t('register_farmer')}</button>
            <button className="community-button-d6 register-consumer">{t('register_consumer')}</button>
          </div>
        </div>

        {activeGuide && (
          <div className="guide-modal-overlay-d6" onClick={() => setActiveGuide(null)}>
            <div className="guide-modal-d6" onClick={(event) => event.stopPropagation()}>
              <button
                className="guide-modal-close-d6"
                type="button"
                onClick={() => setActiveGuide(null)}
                aria-label={t('guide_modal_close')}
              >
                ×
              </button>
              <span className="guide-modal-eyebrow-d6">{t('read_more')}</span>
              <h3 className="guide-modal-title-d6">{guideContent[activeGuide].title}</h3>
              <p className="guide-modal-intro-d6">{guideContent[activeGuide].intro}</p>
              <ol className="guide-modal-steps-d6">
                {guideContent[activeGuide].steps.map((step, index) => (
                  <li key={step}>
                    <span className="guide-step-index-d6">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;