import React, { useState, useEffect } from 'react';
import './ProductList.css';
import { getAllProducts } from '../api';
import { Link, useSearchParams } from 'react-router-dom';

const ProductList = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(500);
  const [sortBy, setSortBy] = useState('Newest');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store original fetched products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        console.log("Fetched data:", data); // Debug log
        if (!data || !Array.isArray(data.products)) {
          throw new Error('Invalid response from server: products array missing');
        }
        const mappedProducts = data.products.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.mrpPerKg,
          unit: 'kg',
          rating: product.rating?.average || 0, // Optional chaining for safety
          reviews: product.rating?.count || 0, // Optional chaining for safety
          image: product.images?.[0] || 'https://via.placeholder.com/400' // Check if images exists
        }));
        setAllProducts(mappedProducts);
        setDisplayedProducts(mappedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Fetch only on mount

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Filter and sort products when filters change
  useEffect(() => {
    if (loading || error) return;

    let filtered = [...allProducts]; // Start with all products

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by price
    filtered = filtered.filter(product => product.price <= priceRange);

    // Sort products
    switch (sortBy) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest':
        // Since backend doesn't provide a timestamp, we'll keep original order
        // If you add createdAt to backend, you could sort by it here
        break;
      default:
        break;
    }

    setDisplayedProducts(filtered);
  }, [activeCategory, priceRange, sortBy, allProducts, loading, error]);

  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.round(rating) ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div className="product-container">Loading products...</div>;
  }

  if (error) {
    return <div className="product-container">{error}</div>;
  }

  return (
    <div className="product-container">
      <h1>Explore Natural Products</h1>

      {/* Category Filters */}
      <div className="category-filters">
        <button
          className={activeCategory === 'All' ? 'active' : ''}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        <button
          className={activeCategory === 'Vegetables' ? 'active' : ''}
          onClick={() => setActiveCategory('Vegetables')}
        >
          Vegetables
        </button>
        <button
          className={activeCategory === 'Fruits' ? 'active' : ''}
          onClick={() => setActiveCategory('Fruits')}
        >
          Fruits
        </button>
        <button
          className={activeCategory === 'Grains' ? 'active' : ''}
          onClick={() => setActiveCategory('Grains')}
        >
          Grains
        </button>
      </div>

      {/* Price Range and Sort */}
      <div className="filter-controls">
        <div className="price-range">
          <span>Price Range:</span>
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
          />
          <span>₹0 - ₹{priceRange}</span>
        </div>

        <div className="sort-by">
          <label>Sort by: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="Newest">Newest</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {displayedProducts.map(product => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <div className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <div className="rating">
                  {renderStars(product.rating)}
                  <span className="reviews">({product.reviews} reviews)</span>
                </div>
                <div className="price-action">
                  <span className="price">₹{product.price}/{product.unit}</span>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Message when no products match */}
      {displayedProducts.length === 0 && (
        <div className="no-products-message">
          No products match your current filters. Try adjusting your price range or category.
        </div>
      )}
    </div>
  );
};

export default ProductList;