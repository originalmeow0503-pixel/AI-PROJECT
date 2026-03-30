import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag } from 'lucide-react';

const Header = () => {
  return (
    <>
      <div className="top-bar">
        <p>Eshine</p>
      </div>

      <header>
        <div className="container header-content">
          <Link to="/" className="logo-link">
            {/* The user requested to leave image sources as '#' so they can apply their own images later, but here they literally told me it was landing-page/srcimgs/Eshine-Logo.png in the original. I will use the # since they explicitly asked for that for product images, but maybe I'll keep the text fallback just in case or keep # */}
            <span className="logo-text">ESHINE</span>
          </Link>

          <nav className="nav-center">
            <Link to="/new-arrival">New</Link>
            <Link to="/men">Men</Link>
            <Link to="/women">Women</Link>
            <Link to="/collections">Collections</Link>
            <Link to="/ai-stylist">AI Stylist</Link>
          </nav>

          <div className="nav-icons">
            <Link to="/account" className="nav-icon-link" title="Account">
              <User size={22} strokeWidth={1.8} />
            </Link>

            <Link to="/cart" className="nav-icon-link" title="Cart">
              <ShoppingBag size={22} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
