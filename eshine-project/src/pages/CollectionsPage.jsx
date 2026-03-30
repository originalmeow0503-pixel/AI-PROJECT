import React from 'react';
import { Link } from 'react-router-dom';

const CollectionsPage = () => {
  const collectionProducts = [
    { img: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSuKcK397XoyflQDPhpBILprk1pqbhA_vosElQ7EJuZEe-hx5ItrD1_2m9oRf8Kt4e_bLuJ_NfkdZ2E7x0y8WjM9phqT_vi0NBqfyhq-JZFjLLtm8oTkQ5aCw&usqp=CAc', name: 'Anarkali Set', price: '$1,290' },
    { img: 'https://kohsh.in/cdn/shop/files/DSC01142_533x.jpg?v=1742624895', name: 'Kurta Set', price: '$890' },
    { img: 'https://m.media-amazon.com/images/I/71KaZLBf6JL._AC_UY1000_.jpg', name: 'Dress', price: '$580' },
    { img: 'https://i.pinimg.com/236x/6c/21/1c/6c211c54df3e529075fdb25e761dcb33.jpg', name: 'Formal Shirt', price: '$420' },
    { img: 'https://www.crimsouneclub.com/cdn/shop/files/UntitledSession03249_1080x.jpg?v=1754568629', name: 'Blazer', price: '$1,290' },
    { img: 'https://medias.utsavfashion.com/media/catalog/product/cache/1/small_image/295x/040ec09b1e35df139433887a97daa66f/w/o/woven-viscose-rayon-jacquard-kurta-set-in-cream-v1-mnr217.jpg', name: 'Kurta Set', price: '$890' },
    { img: 'https://i.etsystatic.com/34650355/r/il/a2ce99/4020929058/il_fullxfull.4020929058_gefl.jpg', name: '3 Set Sherwani', price: '$580' },
    { img: 'https://m.media-amazon.com/images/I/41k8b5UDbML._AC_UY1100_.jpg', name: 'Formal Shirt', price: '$420' },
    { img: 'https://clothsvilla.com/cdn/shop/products/NavratriWearHeavyBollywoodLehengaIndianPartyIndianTraditionalLehengaDesignerLenghaCholiWedding_1_1024x1024.jpg?v=1660652580', name: 'Lehenga', price: '$1,290' },
    { img: 'https://cdn.shopify.com/s/files/1/0049/3649/9315/files/SSRM0043402_RANI_PINK_7_large.jpg?v=1741863899', name: 'Shrara', price: '$890' },
    { img: 'https://www.powersutra.co/cdn/shop/files/PS159_1.jpg?v=1762769354&width=2048', name: 'Coat Pant', price: '$420' },
    { img: 'https://www.theambitioncollective.in/cdn/shop/products/Untitled-Session0500-copy.jpg?v=1664273096', name: 'Formal Pant', price: '$580' }
  ];

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

export default CollectionsPage;
