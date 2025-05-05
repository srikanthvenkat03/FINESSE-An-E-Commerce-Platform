import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // 👈 Hook to navigate
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [message, setMessage] = useState('');

  const userId = 'testUser123';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product:', err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setMessage('❌ Please select a size');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: product._id,
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          size: selectedSize
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('✅ Added to cart');
      } else {
        setMessage(`❌ ${result.error || 'Failed to add to cart'}`);
      }
    } catch (err) {
      setMessage('❌ Error adding to cart');
      console.error(err);
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-page">
      {/* 🔙 Back Button */}
      <button className="back-home-btn" onClick={() => navigate('/home')}>
        Back to Home
      </button>

      <div className="product-container">
        <div className="product-image-section">
          <img src={product.imageUrl} alt={product.title} className="product-image" />
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-description">
            {product.detailedDescription || product.description}
          </p>

          <div className="price-info">
            <span className="current-price">₹{product.price}</span>
            {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
            {product.discount && <span className="discount">({product.discount})</span>}
          </div>

          {product.sizes?.length > 0 && (
            <div className="option-group">
              <label htmlFor="size-dropdown">Select Size:</label>
              <select
                id="size-dropdown"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="dropdown-select"
              >
                <option value="">-- Choose Size --</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}

          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
          {message && <p style={{ marginTop: '1rem', color: 'lightgreen' }}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
