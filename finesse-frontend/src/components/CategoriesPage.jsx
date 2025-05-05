import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CategoriesPage.css'; // This can remain if it contains global styles

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('❌ Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="landing-page">
      <header className="top-nav">
        <button className="nav-btn" onClick={() => navigate('/home')}>
          Back to Home
        </button>
      </header>

      <h2 className="section-title">All Categories</h2>

      <div className="categories-section">
        {categories.map((cat, index) => (
          <div key={index} className="category-item">
            <img src={cat.imageUrl} alt={cat.name} className="category-image" />
            <p className="category-title">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
