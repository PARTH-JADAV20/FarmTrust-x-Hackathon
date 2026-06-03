import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './SingleProduct.css';
import { getProductById, getAllProducts, getUserByEmail, updateUser } from '../api';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { MdVerifiedUser } from "react-icons/md";

const SingleProduct = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartError, setCartError] = useState(null);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [showCertificatePopup, setShowCertificatePopup] = useState(null); // New state for certificate popup

  const { productId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        const allProductsData = await getAllProducts();

        setProduct(productData.product);

        const related = allProductsData.products
          .filter(p => p.category === productData.product.category && p.id !== productId)
          .slice(0, 5)
          .map(p => ({
            id: p.id,
            name: p.name,
            price: p.mrpPerKg,
            image: p.images[0] || 'https://via.placeholder.com/300',
          }));
        setRelatedProducts(related);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= roundedRating ? 'p-star p-filled' : 'p-star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) return <div className="p-product-page">Loading product...</div>;
  if (error || !product) return <div className="p-product-page">{error || 'Product not found'}</div>;

  const productImages = product.images.length > 0
    ? product.images
    : ['https://via.placeholder.com/500'];

  const openPopup = () => {
    setShowPopup(true);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setShowPopup(false);
    setOrderSuccess(false);
    setOrderError(null);
    document.body.style.overflow = 'auto';
  };

  const openCertificatePopup = (type) => {
    setShowCertificatePopup(type);
    document.body.style.overflow = 'hidden';
  };

  const closeCertificatePopup = () => {
    setShowCertificatePopup(null);
    document.body.style.overflow = 'auto';
  };

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const calculateSubtotal = () => {
    return product.mrpPerKg * quantity;
  };

  const calculateTotal = () => {
    const deliveryCharge = 40;
    return calculateSubtotal() + deliveryCharge;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setCartError('Please log in to add items to your cart.');
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const userResponse = await getUserByEmail(user.email, token);
      const userId = userResponse.user._id;

      const cartItem = {
        farmerId: product.farmer.email,
        productId: product.id,
        name: product.name,
        quantityInKg: quantity,
        pricePerKg: product.mrpPerKg,
      };

      const updatedData = {
        cart: JSON.stringify([cartItem]),
      };

      await updateUser(userId, updatedData, token);
      setCartSuccess(true);
      setCartError(null);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      setCartError('Failed to add to cart. Please try again.');
      setCartSuccess(false);
      console.error('Add to cart error:', err);
    }
  };

  const handleConfirmOrder = async () => {
    if (!isAuthenticated) {
      setOrderError('Please log in to place an order.');
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const userResponse = await getUserByEmail(user.email, token);
      const userId = userResponse.user._id;

      const orderItem = {
        farmerId: product.farmer.email,
        products: [{
          productId: product.id,
          name: product.name,
          quantityInKg: quantity,
          pricePerKg: product.mrpPerKg,
          totalPrice: calculateSubtotal(),
        }],
        totalAmount: calculateTotal(),
        status: 'pending',
      };

      const updatedData = {
        orders: [orderItem],
      };

      await updateUser(userId, updatedData, token);
      setOrderSuccess(true);
      setOrderError(null);
      setTimeout(() => {
        setOrderSuccess(false);
        closePopup();
      }, 3000);
    } catch (err) {
      setOrderError('Failed to place order. Please try again.');
      setOrderSuccess(false);
      console.error('Confirm order error:', err);
    }
  };

  const mainImage = productImages[selectedImage] || productImages[0];

  return (
    <div className="p-product-page">
      <div className="p-product-container">
        <div className="p-product-image-section">
          <div className="p-main-image">
            <img src={mainImage} alt={product.name} />
          </div>
          <div className="p-thumbnail-images">
            {productImages.map((image, index) => (
              <div
                key={index}
                className={`p-thumbnail ${selectedImage === index ? 'p-active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="p-product-details">
          <h1>{product.name}</h1>
          <p className="p-product-description">
            {product.description || 'No description available.'}
          </p>
          <div className="p-product-price">
            <span>₹{product.mrpPerKg}/kg</span>
          </div>

          <div className="p-seller-info">
            <div className="p-seller-profile">
              <img
                src={product.farmer.profilePic || 'https://randomuser.me/api/portraits/men/42.jpg'}
                alt="Seller"
              />
              <div className="p-seller-details">
                <p className="p-seller-name">
                  {product.farmer.name}
                  {product.farmer.isVerified && <span><MdVerifiedUser color='green' /></span>}
                </p>
                {product.farmer.isVerified && (
                  <p className="p-seller-title">Trusted By FarmTrust</p>
                )}
              </div>
            </div>
            <div className="p-profile-link">
              <Link to={`/farmer/${encodeURIComponent(product.farmer.email)}`}>View Profile</Link>
            </div>
            <div className="p-seller-actions">
              <button className="p-report-store">
                <span className="p-flag-icon">⚑</span> Report Store
              </button>
            </div>
          </div>

          <div className="p-certificate-buttons">
            {product.farmer.certificates.fssai && (
              <button
                className="p-view-certificate"
                onClick={() => openCertificatePopup('fssai')}
              >
                FSSAI Certificate
              </button>
            )}
            {product.farmer.certificates.organicFarm && (
              <button
                className="p-view-certificate"
                onClick={() => openCertificatePopup('organic')}
              >
                Organic Certificate
              </button>
            )}
          </div>

          <div className="p-action-buttons">
            <button className="p-buy-now-btn" onClick={openPopup}>Buy Now</button>
            <button className="p-add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
          </div>

          {cartSuccess && <p className="p-success-message">Added to cart successfully!</p>}
          {cartError && <p className="p-error-message">{cartError}</p>}
        </div>
      </div>

      <div className="p-related-products-section">
        <h2>Related Products</h2>
        <div className="p-related-products">
          {relatedProducts.map(related => (
            <Link to={`/product/${related.id}`} key={related.id}>
              <div className="p-related-product">
                <div className="p-related-product-image">
                  <img src={related.image} alt={related.name} />
                </div>
                <h3>{related.name}</h3>
                <p className="p-related-price">₹{related.price}/kg</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-reviews-section">
        <h2>Customer Reviews</h2>
        <div className="p-write-review">
          <h3>Write a Review</h3>
          <div className="p-rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="p-star">★</span>
            ))}
          </div>
          <textarea placeholder="Share your experience..."></textarea>
          <button className="p-submit-review">Submit Review</button>
        </div>
        <div className="p-review">
          <div className="p-reviewer-info">
            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Reviewer" />
            <div>
              <p className="p-reviewer-name">Riya Sharma</p>
              <div className="p-reviewer-stars">
                {renderStars(product.rating.average)}
              </div>
            </div>
          </div>
          <p className="p-review-text">Excellent quality! Very fresh and tasty. Will definitely buy again.</p>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay2">
          <div className="popup-container">
            <div className="popup-header">
              <h3>Complete Your Purchase</h3>
              <button className="close-popup" onClick={closePopup}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-content1">
              <div className="popup-product-info">
                <img src={mainImage} alt={product.name} className="popup-product-image" />
                <div className="popup-product-details">
                  <h4>{product.name}</h4>
                  <p className="popup-product-price">₹{product.mrpPerKg}/kg</p>
                </div>
              </div>
              <div className="quantity-selector">
                <h4>Select Quantity (kg)</h4>
                <div className="quantity-controls">
                  <button className="quantity-btn" onClick={decreaseQuantity} disabled={quantity <= 1}>
                    <FaMinus />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button className="quantity-btn" onClick={increaseQuantity}>
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Price:</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Delivery charge:</span>
                  <span>₹40</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              {orderSuccess && <p className="p-success-message">Order placed successfully!</p>}
              {orderError && <p className="p-error-message">{orderError}</p>}
            </div>
            <div className="popup-footer">
              <button className="cancel-btn" onClick={closePopup}>Cancel</button>
              <button className="confirm-btn" onClick={handleConfirmOrder}>Confirm Order</button>
            </div>
          </div>
        </div>
      )}

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
                src={`${showCertificatePopup === 'fssai' ? product.farmer.certificates.fssai : product.farmer.certificates.organicFarm}#view=FitH&toolbar=0&navpanes=0`}
                title={showCertificatePopup === 'fssai' ? 'FSSAI Certificate' : 'Organic Certificate'}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;