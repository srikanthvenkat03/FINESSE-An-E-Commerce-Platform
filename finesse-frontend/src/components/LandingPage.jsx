import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const slides = ["/assets/newLook.png", "/assets/finesse.png"];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [productRes, categoryRes, reviewRes] = await Promise.all([
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/categories'),
        fetch('http://localhost:5000/api/reviews'),
      ]);
      const [products, categories, reviews] = await Promise.all([
        productRes.json(),
        categoryRes.json(),
        reviewRes.json(),
      ]);
      setProducts(products);
      setCategories(categories);
      setReviews(reviews);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNext = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setFade(false);
    }, 500);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setFade(false);
    }, 500);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const goToCart = () => navigate('/cart');
  const goToCategories = () => navigate('/categories');
  const goToProfile = () => navigate('/profile');
  const goToProductPage = (id) => navigate(`/product/${id}`);

  return (
    <div className="landing-page">
      <header className="top-nav">
        <div className="nav-left">
          <button className="nav-btn" onClick={goToCategories}>Categories</button>
        </div>
        <div className="nav-center">
          <img src="/assets/finesseLogo.png" alt="Finesse Logo" className="finesse-logo" />
        </div>
        <div className="nav-right">
          <button className="nav-btn" onClick={goToCart}>Cart</button>
          <button className="nav-btn profile-btn">
            <img src="/assets/icon.png" alt="Profile" className="profile-icon" />
          </button>
        </div>
      </header>

      <div className="slider-container">
        <button className="arrow-btn left-arrow" onClick={handlePrev}>&#10094;</button>
        <div className="slide">
          <img src={slides[currentSlide]} alt="Slide" className={`slide-image ${fade ? 'fade' : ''}`} />
        </div>
        <button className="arrow-btn right-arrow" onClick={handleNext}>&#10095;</button>
      </div>

      <button className="offers-btn">Offers</button>

      <h2 className="section-title">Top Categories</h2>
      <div className="categories-section">
        {categories.map((cat, i) => (
          <div key={i} className="category-item">
            <img src={cat.imageUrl} alt={cat.name} className="category-image" />
            <p className="category-title">{cat.name}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Products</h2>
      <div className="oversized-grid">
        {products.map((product, i) => (
          <div key={i} className="oversized-item" onClick={() => goToProductPage(product._id)}>
            <img src={product.imageUrl} alt={product.title} className="oversized-image" />
            <h3 className="oversized-title">{product.title}</h3>
            <p className="oversized-desc">{product.description}</p>
            <div className="price-section">
              <span className="current-price">₹{product.price}</span>
              <span className="old-price">₹{product.oldPrice}</span>
              <span className="discount">{product.discount}</span>
            </div>
            <div className="oversized-buttons">
              <button className="oversized-add-btn">Add to cart</button>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonials">
        <h2>Testimonials</h2>
        <div className="testimonial-list">
          {reviews.map((review, i) => (
            <div key={i} className="testimonial">
              <p>❝ {review.content} ❞</p>
              <cite>- {review.name}</cite>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
