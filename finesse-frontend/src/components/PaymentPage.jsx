import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentPage.css';

const PaymentPage = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (method) => {
    setSelected(method);
    setTimeout(() => {
      navigate('/thankyou');
    }, 1500);
  };

  return (
    <div className="payment-page">
        <header className="top-nav">
        <button className="nav-btn" onClick={() => navigate('/home')}>Back to Home</button>
        <div className="nav-center">
          <img src="/assets/finesseLogo.png" alt="Finesse Logo" className="finesse-logo" />
        </div>
      </header>
       
      {!selected ? (
        <>
          <h2>Choose your payment option:</h2>
          <div className="payment-options">
            <div><button onClick={() => handleSelect('Credit Card')}>Credit Card</button>
            </div>
            <div><button onClick={() => handleSelect('Net Banking')}>Net Banking</button></div>
            <div><button onClick={() => handleSelect('UPI')}>UPI</button></div>
          </div>
        </>
      ) : (
        <h2>Processing payment via {selected}...</h2>
      )}
    </div>
  );
};

export default PaymentPage;
