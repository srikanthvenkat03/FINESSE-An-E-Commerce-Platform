import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const userId = "testUser123"; // Replace with real user ID if authentication is implemented

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [userId]);

  const getTotal = () => {
    return cart.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0);
  };

  const goToPayment = () => {
    navigate('/payment');
  };

  return (
    <div className="cart-page">
      <header className="top-nav cart-nav">
        <button className="nav-btn" onClick={() => navigate('/home')}>Back to Home</button>
        <div className="nav-center">
          <img src="/assets/finesseLogo.png" alt="Finesse Logo" className="finesse-logo" />
        </div>
      </header>

      <h2>Your Cart</h2>

      <div className="cart-products">
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cart.map((product, index) => (
            <div key={index} className="cart-product">
              <img src={product.imageUrl} alt={product.title} className="cart-product-image" />
              <div className="cart-product-details">
                <h3>{product.title}</h3>
                <span className="price">₹{product.price} × {product.quantity || 1}</span>
              </div>
              {/* Optional: Add Remove feature using a backend DELETE/POST later */}
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-summary">
          <h3>Total: ₹{getTotal()}</h3>
          <button className="checkout-btn" onClick={goToPayment}>Proceed to Payment</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
