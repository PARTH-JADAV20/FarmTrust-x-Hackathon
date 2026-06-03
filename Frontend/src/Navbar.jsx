import React, { useState, useEffect } from 'react';
import { FaBell, FaComment, FaBars, FaLeaf, FaSearch } from 'react-icons/fa';
import './Navbar.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByEmail } from './components/api';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { loginWithPopup, logout, isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0();
  const navigate = useNavigate();
  const { i18n } = useTranslation(); 

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const fetchUserRole = async () => {
    if (!isAuthenticated || !user?.email) return;
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getUserByEmail(user.email, token);
      sessionStorage.setItem('email', user.email);
      sessionStorage.setItem('role', data.user.role);
      setUserRole(data.user.role);
    } catch (err) {
      setError(err.message);
      setUserRole(sessionStorage.getItem('role') || 'customer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [isAuthenticated, user]);

  const handleProfileClick = () => {
    if (loading) return;
    if (userRole === 'farmer') {
      navigate('/farmerpanel/dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (userRole === 'customer') {
      navigate('/user/profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSignIn = async () => {
    try {
      await loginWithPopup();
      await getAccessTokenSilently(); // Ensure token is fetched post-login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
    setUserRole(null);
    setIsNotificationOpen(false);
  };

  const notifications = [
    {
      id: 1,
      title: 'Fresh produce available nearby',
      message: 'New batches of organic vegetables and fruits are now available from verified farmers.',
      time: '10 min ago',
      type: 'market',
    },
    {
      id: 2,
      title: 'Seasonal harvest update',
      message: 'Check the latest harvests for tomatoes, spinach, apples, and mangoes before placing your order.',
      time: '1 hour ago',
      type: 'update',
    },
    {
      id: 3,
      title: 'Verified farmer spotlight',
      message: 'A new verified farmer profile is live with organic certification and transparent reviews.',
      time: 'Today',
      type: 'verification',
    },
  ];

  const effectiveRole = userRole || sessionStorage.getItem('role');

  const handleChatClick = () => {
    if (!isAuthenticated || loading) return;

    const role = effectiveRole;
    if (role === 'farmer') {
      navigate('/farmerpanel/messages');
    } else {
      navigate('/user/messages');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleNavInteraction = () => {
    setIsNotificationOpen(false);
    setIsSearchOpen(false);
  };

  const categorySuggestions = [
    {
      label: 'Vegetables',
      category: 'Vegetables',
      terms: ['vegetable', 'vegetables', 'veg'],
    },
    {
      label: 'Fruits',
      category: 'Fruits',
      terms: ['fruit', 'fruits', 'frutis', 'fruites'],
    },
    {
      label: 'Grains',
      category: 'Grains',
      terms: ['grain', 'grains', 'garin', 'grian'],
    },
  ];

  const getSuggestedCategories = () => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return categorySuggestions;
    }

    return categorySuggestions.filter((item) =>
      [item.label, item.category, ...item.terms].some((term) =>
        term.toLowerCase().includes(normalizedQuery)
      )
    );
  };

  const resolveSearchCategory = (query) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return null;
    }

    const matchedCategory = categorySuggestions.find((item) =>
      [item.label, item.category, ...item.terms].some((term) =>
        normalizedQuery.includes(term.toLowerCase()) || term.toLowerCase().includes(normalizedQuery)
      )
    );

    return matchedCategory?.category || null;
  };

  const handleSearchSubmit = (value = searchQuery) => {
    const category = resolveSearchCategory(value);
    if (category) {
      navigate(`/products?category=${encodeURIComponent(category)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setIsSearchOpen(true);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleSearchSuggestionClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      const notificationRoot = document.querySelector('.notification-wrapper-d6');
      const searchRoot = document.querySelector('.navbar-search-wrapper-d6');
      if (notificationRoot && !notificationRoot.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (searchRoot && !searchRoot.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar" onClick={handleNavInteraction}>
      {/* Logo */}
      <Link to="/" className='navbar-logo-a'>
        <div className="navbar-logo" >
          <FaLeaf className="logo-icon" /> FarmTrust
        </div>
      </Link>

      {/* Hamburger Menu for Mobile */}
      <div className="hamburger" onClick={toggleDrawer}>
        <FaBars />
      </div>

      {/* Navbar Items */}
      <div className={`navbar-items ${isDrawerOpen ? 'open' : ''}`}>
        <div className="language-switcher">
          <select
            value={i18n.language} // Current language from i18n
            onChange={(e) => changeLanguage(e.target.value)} // Update language on change
            className="language-select"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>
        {/* Search Bar */}
        <div className="navbar-search-wrapper-d6" onClick={(event) => event.stopPropagation()}>
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search vegetables, fruits or grains..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
            />
            <button
              type="button"
              className="search-icon-button-d6"
              onClick={() => handleSearchSubmit()}
              aria-label="Search products"
            >
              <FaSearch className="search-icon" />
            </button>
          </div>

          {isSearchOpen && (
            <div className="search-suggestions-d6">
              <div className="search-suggestions-header-d6">
                <span>Suggestions</span>
              </div>
              <div className="search-suggestion-chips-d6">
                {getSuggestedCategories().map((item) => (
                  <button
                    key={item.category}
                    type="button"
                    className="search-suggestion-chip-d6"
                    onClick={() => handleSearchSuggestionClick(item.category)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="navbar-icons">
          <div className="notification-wrapper-d6" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="icon-button-d6"
              onClick={toggleNotifications}
              aria-label="Show notifications"
            >
              <FaBell />
              <span className="badge">3</span>
            </button>

            {isNotificationOpen && (
              <div className="notification-dropdown-d6">
                <div className="notification-dropdown-header-d6">
                  <h4>Notifications</h4>
                  <span>For customers</span>
                </div>
                <div className="notification-list-d6">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`notification-item-d6 ${notification.type}`}>
                      <div className="notification-dot-d6" />
                      <div className="notification-content-d6">
                        <div className="notification-title-row-d6">
                          <strong>{notification.title}</strong>
                          <span>{notification.time}</span>
                        </div>
                        <p>{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <button
              type="button"
              className="icon-button-d6 chat-button-d6"
              onClick={handleChatClick}
              aria-label="Open chat"
            >
              <FaComment />
            </button>
          )}
        </div>

        {isLoading || loading ? (
          <img
            src="https://www.svgrepo.com/download/192247/man-user.svg"
            alt="Loading"
            className="profile-pic"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        ) : isAuthenticated ? (
          <div style={{ cursor: 'pointer' }} onClick={handleProfileClick}>
            <img
              src={user?.picture || 'https://www.svgrepo.com/download/192247/man-user.svg'}
              alt="Profile"
              className="profile-pic"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              onError={(e) => {
                e.target.src = 'https://www.svgrepo.com/download/192247/man-user.svg';
              }}
            />
          </div>
        ) : (
          <div
            id="signin"
            onClick={handleSignIn}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <button className="sign-in-btn">Sign In</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;