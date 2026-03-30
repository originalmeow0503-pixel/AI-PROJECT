import React, { useState } from 'react';
import { ShoppingBag, Star, CheckCircle2, XCircle, ChevronRight, Truck, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTryOn } from '../context/TryOnContext';

const ProductPage = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');
  
  const navigate = useNavigate();
  const { addGarment } = useTryOn();
  
  // Pincode functionality
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);

  // Using high-quality placeholder images for the Premium Wrap
  const images = [
    'https://images.unsplash.com/photo-1544211153-65913ef4b15c?q=80&w=1000&auto=format&fit=crop', 
    'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=1000&auto=format&fit=crop',
    '#', 
    '#'
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { id: 'black', hex: '#111' },
    { id: 'white', hex: '#F7F7F7' },
    { id: 'gold', hex: '#A88428' },
  ];

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      // Mock logic: Ends in '0' means undeliverable, else deliverable
      if (pincode.endsWith('0')) {
        setDeliveryStatus('error');
      } else {
        setDeliveryStatus('success');
      }
    } else {
      setDeliveryStatus('invalid');
    }
  };

  const handleTryOn = () => {
    // In a real app we'd pass the actual product details. Here we mock it based on the page.
    addGarment({
      id: 'prod-1', // Mock ID
      name: 'Premium Signature Wrap',
      price: 'Rs. 4,599',
      image: images[activeImage] || '#'
    });
    navigate('/ai-stylist');
  };

  return (
    <div className="product-page-wrapper container">
      <div className="product-grid">
        
        {/* Left Col: Image Gallery */}
        <div className="gallery-section">
          <div className="main-image-container">
            {images[activeImage] === '#' ? (
              <div className="placeholder-img skeleton">PROD IMG {activeImage + 1}</div>
            ) : (
              <img src={images[activeImage]} alt="Product" className="main-image" />
            )}
          </div>
          
          <div className="thumbnail-strip">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                onClick={() => setActiveImage(idx)}
              >
                {img === '#' ? (
                  <div className="placeholder-img" style={{ fontSize: '10px' }}>THUMB</div>
                ) : (
                  <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="product-details">
          
          <div className="product-header">
            <h1>Premium Signature Wrap</h1>
            <p className="product-price">Rs. 4,599</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div className="stars">
              <Star /><Star /><Star /><Star /><Star />
            </div>
            <span style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>(128 Reviews)</span>
          </div>

          <p className="product-desc">
            Elevate your wardrobe with the Premium Signature Wrap. Designed with minimal aesthetics and a modern, tailored fit, this piece brings editorial elegance to your everyday look. Crafted with sustainable fabrics that feel exceptionally soft against the skin.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />

          {/* Size Selector */}
          <div className="selector-group">
            <span className="selector-label">Size: {selectedSize}</span>
            <div className="options-row">
              {sizes.map(size => (
                <button 
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="selector-group" style={{ marginTop: '10px' }}>
            <span className="selector-label">Color: <span style={{ textTransform: 'capitalize' }}>{selectedColor}</span></span>
            <div className="options-row">
              {colors.map(c => (
                <button 
                  key={c.id}
                  className={`color-btn ${selectedColor === c.id ? 'selected' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setSelectedColor(c.id)}
                  aria-label={c.id}
                />
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn-black" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button className="btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleTryOn}>
              <Wand2 size={18} /> Try in AI Stylist
            </button>
          </div>

          {/* Pincode Checker (Amazon Style) */}
          <div className="pincode-checker">
            <div className="pincode-header">
              <Truck size={18} />
              <span>Check Delivery Availability</span>
            </div>
            
            <div className="pincode-input-group">
              <input 
                type="text" 
                placeholder="Enter 6-digit Pincode" 
                className="pincode-input"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              />
              <button className="btn-check" onClick={handlePincodeCheck}>
                Check
              </button>
            </div>

            {deliveryStatus === 'success' && (
              <div className="pincode-result pincode-success">
                <CheckCircle2 size={16} /> Delivery available for {pincode}. Standard delivery in 3-5 days.
              </div>
            )}
            
            {deliveryStatus === 'error' && (
              <div className="pincode-result pincode-error">
                <XCircle size={16} /> Sorry, we currently do not deliver to {pincode}.
              </div>
            )}

            {deliveryStatus === 'invalid' && (
              <div className="pincode-result pincode-error" style={{ color: '#888' }}>
                Please enter a valid 6-digit pincode.
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          <button className="btn-black" style={{ width: 'auto', padding: '10px 20px', fontSize: '12px' }}>
            Write a Review
          </button>
        </div>

        <div className="review-list">
          {[
            { name: "Priya M.", text: "Absolutely love the quality and fit. Eshine never disappoints! The material feels super premium.", stars: 5 },
            { name: "Rohan K.", text: "A perfect wardrobe staple. Very versatile and fashionable.", stars: 4 },
            { name: "Ananya S.", text: "Got so many compliments wearing this! True to size and beautifully packaged.", stars: 5 }
          ].map((review, i) => (
            <div key={i} className="review-card">
              <div className="review-meta">
                <div className="avatar">{review.name.charAt(0)}</div>
                <div className="reviewer-info">
                  <h4>{review.name}</h4>
                  <div className="stars">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} fill={idx < review.stars ? "currentColor" : "none"} strokeWidth={idx < review.stars ? 0 : 1} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="review-body">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default ProductPage;
