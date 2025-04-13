import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupPage.css';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('Something went wrong');
    }
  };

  return (
    <div
      className="signup-container"
      style={{
        backgroundImage: "url('/assets/bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <form className="signup-form" onSubmit={handleSubmit}>
        <img src="/assets/finesseLogo.png" alt="Finesse Logo" className="finesse-signup-logo" />
        <h2>Sign Up</h2>
        {message && <p className="message">{message}</p>}
        <div className="input-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Phone</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
