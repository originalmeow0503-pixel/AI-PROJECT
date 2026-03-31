import React from 'react';
import { Link } from 'react-router-dom';

const NewArrivalsPage = () => {
  const newArrivalsProducts = [
    {
      id: 'oversized-hoodie',
      name: 'Oversized Hoodie',
      price: 'Rs. 1,299',
      img: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
      ],
      description:
        'A cozy oversized hoodie with a clean streetwear silhouette, made for effortless layering and everyday comfort.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        {
          id: 'charcoal',
          label: 'Charcoal',
          hex: '#2b2b2b',
          images: [
            'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
          ],
        },
        {
          id: 'stone',
          label: 'Stone',
          hex: '#d8d2c8',
          images: [
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
          ],
        },
      ],
      reviews: [
        {
          name: 'Priya M.',
          text: 'Absolutely love the quality and fit. Eshine never disappoints!',
          stars: 5,
        },
        {
          name: 'Rohan K.',
          text: 'A perfect wardrobe staple. Very versatile and fashionable.',
          stars: 4,
        },
        {
          name: 'Ananya S.',
          text: 'Got so many compliments wearing this. Beautifully packaged too.',
          stars: 5,
        },
      ],
    },
    {
      id: 'street-style-jacket',
      name: 'Street Style Jacket',
      price: 'Rs. 2,499',
      img: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      ],
      description:
        'A structured jacket with bold lines and a polished finish that adds edge to casual and smart looks alike.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        {
          id: 'ink',
          label: 'Ink',
          hex: '#1a2433',
          images: [
            'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
          ],
        },
        {
          id: 'sand',
          label: 'Sand',
          hex: '#cbb89d',
          images: [
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
          ],
        },
      ],
      reviews: [
        {
          name: 'Priya M.',
          text: 'Absolutely love the quality and fit. Eshine never disappoints!',
          stars: 5,
        },
        {
          name: 'Rohan K.',
          text: 'A perfect wardrobe staple. Very versatile and fashionable.',
          stars: 4,
        },
        {
          name: 'Ananya S.',
          text: 'Got so many compliments wearing this. Beautifully packaged too.',
          stars: 5,
        },
      ],
    },
    {
      id: 'classic-denim',
      name: 'Classic Denim',
      price: 'Rs. 1,799',
      img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      ],
      description:
        'Timeless denim designed with a flattering cut and everyday versatility, perfect for effortless styling.',
      sizes: ['28', '30', '32', '34'],
      colors: [
        {
          id: 'blue',
          label: 'Blue',
          hex: '#3a5d8c',
          images: [
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
          ],
        },
        {
          id: 'washed',
          label: 'Washed Blue',
          hex: '#7f9cb7',
          images: [
            'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
          ],
        },
      ],
      reviews: [
        {
          name: 'Priya M.',
          text: 'Absolutely love the quality and fit. Eshine never disappoints!',
          stars: 5,
        },
        {
          name: 'Rohan K.',
          text: 'A perfect wardrobe staple. Very versatile and fashionable.',
          stars: 4,
        },
        {
          name: 'Ananya S.',
          text: 'Got so many compliments wearing this. Beautifully packaged too.',
          stars: 5,
        },
      ],
    },
    {
      id: 'summer-dress',
      name: 'Summer Dress',
      price: 'Rs. 1,499',
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
      ],
      description:
        'A breezy summer dress crafted for warm days, light movement, and an easy elevated finish.',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [
        {
          id: 'rose',
          label: 'Rose',
          hex: '#d8a8a8',
          images: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
          ],
        },
        {
          id: 'ivory',
          label: 'Ivory',
          hex: '#f4f0e8',
          images: [
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=800&q=80',
          ],
        },
      ],
      reviews: [
        {
          name: 'Priya M.',
          text: 'Absolutely love the quality and fit. Eshine never disappoints!',
          stars: 5,
        },
        {
          name: 'Rohan K.',
          text: 'A perfect wardrobe staple. Very versatile and fashionable.',
          stars: 4,
        },
        {
          name: 'Ananya S.',
          text: 'Got so many compliments wearing this. Beautifully packaged too.',
          stars: 5,
        },
      ],
    },
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

export default NewArrivalsPage;
