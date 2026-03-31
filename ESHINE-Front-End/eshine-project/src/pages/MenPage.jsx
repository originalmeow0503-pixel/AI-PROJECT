import React from 'react';
import { Link } from 'react-router-dom';

const MenPage = () => {
  const menProducts = [
    { img: 'https://www.crimsouneclub.com/cdn/shop/files/UntitledSession03249_1080x.jpg?v=1754568629', name: 'Blazer', price: '$1290' },
    { img: 'https://cdn.lookastic.com/looks/tan-suit-black-crew-neck-t-shirt-black-velvet-loafers-original-72175.jpg', name: 'Kurta Set', price: '$890' },
    { img: 'https://i.etsystatic.com/34650355/r/il/a2ce99/4020929058/il_fullxfull.4020929058_gefl.jpg', name: '3 Set Sherwani', price: '$580' },
    { img: 'https://m.media-amazon.com/images/I/41k8b5UDbML._AC_UY1100_.jpg', name: 'Formal Shirt', price: '$420' },
    { img: 'https://www.nihalfashions.com/media/catalog/product/cache/caa15edf98145413286703527de7b8dd/l/i/light-brown-art-silk-mens-sherwani-nmk-6875.jpg', name: 'Sherwani', price: '$1290' },
    { img: 'https://static.fursac.com/data/waistcoat-men-3-piece-suit-taupe-brown-g3bilg-gc17-a008-pl3133166.1749824406.jpg', name: 'Waist Coat', price: '$890' },
    { img: 'https://i.pinimg.com/originals/51/39/51/5139510b643681466e6129df18fe82bf.jpg', name: 'Coat Pant', price: '$420' },
    { img: 'https://dqp736wsu6w3m.cloudfront.net/s3bucket/w1000/looks/1860/beige-suit-green-shirt-1.png', name: 'Formal Pant', price: '$580' },
    { img: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTE3By8di4o2pci59uhuCdozSlzoAOp49ihJtdxh3zJl65C1acHDihI8vL4exA7hT9PyppNk_CS4I5ykCFahtXX1qu-6P8hE6dXvP6cxzKimx9OBYvMG7Va&usqp=CAc', name: 'Hoodie', price: '$1290' },
    { img: 'https://sc04.alicdn.com/kf/H19b133f1e6054197a33b1f0aac43d4e34.jpg_350x350.jpg', name: 'Jacket', price: '$890' },
    { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgafPUTOB2DC4SsbPwFGlpLBElO_SRmaMTFw&s', name: 'Sweater', price: '$580' },
    { img: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRdirAzI016R6oeKaKfT-dGp8Mp8TL_AAQVJUhEeiXzcGh6kOu3eZlMlSpxaK8Mnlj9l5WH6uwwtymMf6XkmPCDfoc3zUa7h5lxEr7G6Fg&usqp=CAc', name: 'Sweatshirt', price: '$420' },
  ];

  return (
    <div className="product-page-wrapper" style={{ minHeight: '80vh' }}>
      <section className="container">
        <div style={{ textAlign: 'center', margin: '40px 0 60px' }}>
          <h1 className="section-title" style={{ marginBottom: '10px' }}>Men's Collection</h1>
          <p style={{ color: '#666', letterSpacing: '1px' }}>Explore the latest arrivals and editorial fits.</p>
        </div>

        <div className="grid-4" style={{ marginBottom: '80px' }}>
          {menProducts.map((item, idx) => (
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

export default MenPage;
