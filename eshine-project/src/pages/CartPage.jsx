import React from 'react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  return (
    <section className="container" style={{ padding: '80px 20px', minHeight: '60vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Your Cart</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Your cart is currently empty.</p>
      <Link to="/collections">
        <button className="btn-black" style={{ display: 'inline-block', width: 'auto' }}>Continue Shopping</button>
      </Link>
    </section>
  );
};

export default CartPage;
