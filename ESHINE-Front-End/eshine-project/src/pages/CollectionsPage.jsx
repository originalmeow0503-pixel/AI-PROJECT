import React from 'react';
import { Link } from 'react-router-dom';
import { collectionProducts } from '../data/products';

const CollectionsPage = () => {
  return (
    <div className="product-page-wrapper" style={{ minHeight: '80vh' }}>
      <section className="container">
        <div style={{ textAlign: 'center', margin: '40px 0 30px' }}>
          <h1 className="section-title" style={{ marginBottom: '10px' }}>All Products</h1>
          <p style={{ color: '#666', letterSpacing: '1px' }}>Browse our complete collection of premium styles.</p>
        </div>

        <div className="filters" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
          <select style={{ padding: '10px 15px', border: '1px solid #ddd', backgroundColor: 'transparent', outline: 'none', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
            <option value="all">All Categories</option>
            <option value="outerwear">Outerwear</option>
            <option value="jackets">Jackets</option>
            <option value="tops">Tops</option>
            <option value="knitwear">Knitwear</option>
          </select>
          
          <select style={{ padding: '10px 15px', border: '1px solid #ddd', backgroundColor: 'transparent', outline: 'none', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
            <option value="all">All Prices</option>
            <option value="low">Below $500</option>
            <option value="mid">$500 - $1000</option>
            <option value="high">Above $1000</option>
          </select>
        </div>

        <div className="grid-4" style={{ marginBottom: '80px' }}>
          {collectionProducts.map((item, idx) => (
            <div className="product-card" key={item.id || idx}>
              <Link to="/product" state={{ product: item }} style={{ textDecoration: 'none', color: 'inherit' }}>
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

export default CollectionsPage;
