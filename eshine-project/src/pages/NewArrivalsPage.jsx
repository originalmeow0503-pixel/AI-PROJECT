import React from 'react';
import { Link } from 'react-router-dom';

const NewArrivalsPage = () => {
  const newArrivalsProducts = [
    { img: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80', name: 'Oversized Hoodie', price: '₹1,299' },
    { img: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80', name: 'Street Style Jacket', price: '₹2,499' },
    { img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', name: 'Classic Denim', price: '₹1,799' },
    { img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', name: 'Summer Dress', price: '₹1,499' }
  ];

  return (
    <div className="product-page-wrapper" style={{ minHeight: '80vh' }}>
      <section className="container">
        <div style={{ textAlign: 'center', margin: '40px 0 60px' }}>
          <h1 className="section-title" style={{ marginBottom: '10px' }}>New Arrivals</h1>
          <p style={{ color: '#666', letterSpacing: '1px' }}>Discover the latest additions to our collection.</p>
        </div>

        <div className="grid-4" style={{ marginBottom: '80px' }}>
          {newArrivalsProducts.map((item, idx) => (
            <div className="product-card" key={idx}>
              <Link to="/product" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-img-wrapper">
                    <img src={item.img} alt={item.name} />
                </div>
                <div className="product-info" style={{ textAlign: 'center', marginTop: '15px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '400', marginBottom: '5px' }}>{item.name}</h3>
                    <p className="price" style={{ color: '#555' }}>{item.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NewArrivalsPage;
