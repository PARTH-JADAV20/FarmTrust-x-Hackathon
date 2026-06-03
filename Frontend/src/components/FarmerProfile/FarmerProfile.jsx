import React, { useState, useEffect } from 'react';
import './FarmerProfile.css';
import { FaEnvelope, FaPhoneAlt, FaFlag, FaTimes } from 'react-icons/fa';
import { MdVerifiedUser } from 'react-icons/md';
import { FiMessageCircle } from 'react-icons/fi';
import { FaLocationDot } from 'react-icons/fa6';
import { IoStar, IoLeaf } from 'react-icons/io5';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFarmerByEmail } from '../api';
import { BsTelephoneX } from 'react-icons/bs';
import Image1 from '../../assets/priya-singh.jpg';
import Image2 from '../../assets/rajesh-kumar.jpg';

const FarmerProfile = () => {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCertificatePopup, setShowCertificatePopup] = useState(null);
  const { email } = useParams();
  const navigate = useNavigate();

  const dummyReviews = [
    {
      id: '1',
      name: 'Sarah Johnson',
      date: '2 days ago',
      rating: 5,
      comment: 'The vegetables are always fresh and the service is excellent. Really appreciate the sustainable farming practices!',
      profilePic: Image1,
    },
    {
      id: '2',
      name: 'Michael Chen',
      date: '1 week ago',
      rating: 4,
      comment: 'Quality products and reliable delivery. The organic certification gives me confidence in the produce.',
      profilePic: Image2,
    },
  ];

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const farmerData = await getFarmerByEmail(email);
        setFarmer(farmerData);
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to load farmer profile.');
      } finally {
        setLoading(false);
      }
    };
    if (email) fetchFarmer();
  }, [email]);

  const handleMessageClick = () => {
    if (farmer && farmer.email) {
      const lowercaseFarmerEmail = farmer.email.toLowerCase();
      navigate(`/user/messages?farmerEmail=${lowercaseFarmerEmail}`);
    }
  };

  if (loading) return <div className="farmer-profile-container">Loading...</div>;
  if (error || !farmer) return <div className="farmer-profile-container">{error || 'Farmer not found'}</div>;

  const displayPhone = farmer.showPhoneToUsers
    ? farmer.phone
    : `******${farmer.phone.slice(-4)}`;

  const displayAddress = `${farmer.address.street ? farmer.address.street + ', ' : ''}${
    farmer.address.city ? farmer.address.city + ', ' : ''
  }${farmer.address.state ? farmer.address.state + ' ' : ''}${farmer.address.zipCode || ''}`.trim();

  const openCertificatePopup = (type) => {
    setShowCertificatePopup(type);
    document.body.style.overflow = 'hidden';
  };

  const closeCertificatePopup = () => {
    setShowCertificatePopup(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="farmer-profile-container">
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-header">
            <img src={farmer.profilePic} alt={farmer.name} className="profile-image" />
            <div className="profile-info">
              <h2>
                {farmer.name} {farmer.isVerified && <span className="verified"><MdVerifiedUser /></span>}
              </h2>
              <p className="trusted-by">
                <MdVerifiedUser /> Trusted by FarmTrust
              </p>
              <p className="contact-info">
                <FaEnvelope /> {farmer.email}
              </p>
              <p className="contact-info">
                <FaPhoneAlt /> {displayPhone}
              </p>
              <p className="contact-info">
                <FaLocationDot /> {displayAddress || 'Address not provided'}
              </p>
              <div className="contact-buttons">
                <button className="message-btn" onClick={handleMessageClick}>
                  <FiMessageCircle /> Message
                </button>
                <button className={`call-btn ${!farmer.showPhoneToUsers ? 'disabled' : ''}`} disabled={!farmer.showPhoneToUsers}>
                  {farmer.showPhoneToUsers ? <FaPhoneAlt /> : <BsTelephoneX />} Call
                </button>
              </div>
            </div>
            <button className="report-btn">
              <FaFlag /> Report
            </button>
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="certifications-section">
        <div className="certifications-card">
          <h3>Certifications</h3>
          <div className="certification-items">
            {farmer.certificates.fssai && (
              <div className="certification-item">
                <div className="cert-icon"><IoStar /></div>
                <p>FSSAI Certified <br /> Valid until Dec 2025</p>
                <span
                  className="view-certificate-link"
                  onClick={() => openCertificatePopup('fssai')}
                >
                  View Certificate
                </span>
              </div>
            )}
            {farmer.certificates.organicFarm && (
              <div className="certification-item">
                <div className="cert-icon"><IoLeaf /></div>
                <p>Organic Farming <br /> Valid until Nov 2025</p>
                <span
                  className="view-certificate-link"
                  onClick={() => openCertificatePopup('organic')}
                >
                  View Certificate
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Farmer Section */}
      <div className="about-farmer-section">
        <div className="about-farmer-card">
          <h3>About the Farmer</h3>
          <p>{farmer.description || 'No description provided.'}</p>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section-d">
        <div className="products-card-d">
          <div className="products-header-d">
            <h3>Products</h3>
            <a href="#" className="view-all-link">View All</a>
          </div>
          <div className="products-grid-d">
            {farmer.products.length > 0 ? (
              farmer.products.map((product) => (
                <div key={product.id} className="product-item-d">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="product-image-d"
                    />
                  </Link>
                  <p className="product-name-d">{product.name}</p>
                  <div className="products123-d">
                    <p className="product-price-d">
                      ₹{product.mrpPerKg}/kg
                    </p>
                    <Link to={`/product/${product.id}`} className="view-product-btn-d">
                      View Product
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-card">
          <div className="reviews-header">
            <h3>Reviews</h3>
            <div className="rating">
              <span className="stars">★★★★☆</span> {farmer.farmerRating} ({dummyReviews.length} reviews)
            </div>
          </div>
          <div className="review-items">
            {dummyReviews.map((review) => (
              <div key={review.id} className="review-item">
                <img src={review.profilePic} alt={review.name} className="review-profile-pic" />
                <div className="review-content">
                  <div className="review-header">
                    <span className="reviewer-name">{review.name}</span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="review-text">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all-reviews">
            <a href="#" className="view-all-link">View All Reviews →</a>
          </div>
        </div>
      </div>

      {/* Certificate Popup */}
      {showCertificatePopup && (
        <div className="certificate-popup-overlay">
          <div className="certificate-popup-container">
            <div className="certificate-popup-header">
              <h3>
                {showCertificatePopup === 'fssai' ? 'FSSAI Certificate' : 'Organic Certificate'}
              </h3>
              <button className="close-certificate-popup" onClick={closeCertificatePopup}>
                <FaTimes />
              </button>
            </div>
            <div className="certificate-popup-content">
              <iframe
                src={showCertificatePopup === 'fssai' ? farmer.certificates.fssai : farmer.certificates.organicFarm}
                title={showCertificatePopup === 'fssai' ? 'FSSAI Certificate' : 'Organic Certificate'}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProfile;