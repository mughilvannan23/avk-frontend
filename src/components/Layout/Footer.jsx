import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaPaperPlane, FaEnvelope, FaPhone } from 'react-icons/fa';
import { mockApi } from '../../services/mockApi';
import logo from '../../assets/logo.jpg';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, success: false, message: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus({ loading: true, success: false, message: '' });
    try {
      await mockApi.subscribeNewsletter(email);
      setStatus({ 
        loading: false, 
        success: true, 
        message: 'Thank you! You have subscribed successfully.' 
      });
      setEmail('');
    } catch (err) {
      setStatus({ 
        loading: false, 
        success: false, 
        message: 'Failed to subscribe. Please try again.' 
      });
    }
  };

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="row gy-5">
          {/* Brand Info & Socials */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-center mb-3">
              <img 
                src={logo} 
                alt="AVK Logo" 
                style={{ height: '58px', width: 'auto', objectFit: 'contain', marginRight: '10px' }}
              />
              <h5 className="text-uppercase fw-bold m-0 border-0" style={{ letterSpacing: '1px', paddingBottom: '0' }}>AVK Pathira Maaligai</h5>
            </div>
            <p className="small text-secondary mb-3" style={{ lineHeight: '1.8' }}>
              Kumbakonam's premium brass mansion offering high-quality traditional brassware, copperware, and luxury vessels. Pride of tradition, mark of quality.
            </p>
            <p className="small text-secondary fw-semibold mb-1">
              📍 No.74, T.S.R Big Street, Kumbakonam - 612001
            </p>
            <p className="small mb-2">
              <FaEnvelope className="gold-gradient me-2" />
              <a href="mailto:avkpathiramaaligai@gmail.com" className="text-secondary text-decoration-none" style={{ transition: 'color 0.2s' }}>
                avkpathiramaaligai@gmail.com
              </a>
            </p>
            <p className="small mb-4">
              <FaPhone className="gold-gradient me-2" />
              <a href="tel:+91 75503 94939" className="text-secondary text-decoration-none" style={{ transition: 'color 0.2s' }}>
                Tel: +91 75503 94939
              </a>
            </p>

            <div className="d-flex">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon rounded-circle" title="Facebook">
                <FaFacebookF size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon rounded-circle" title="Instagram">
                <FaInstagram size={14} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon rounded-circle" title="YouTube">
                <FaYoutube size={14} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon rounded-circle" title="Twitter">
                <FaTwitter size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-6 col-lg-3 ps-lg-4">
            <h5 className="text-uppercase fw-bold mb-4" style={{ letterSpacing: '1px' }}>Quick Links</h5>
            <ul className="footer-links-list">
              <li><Link to="/shop">Shop All Products</Link></li>
              <li><Link to="/shop?category=Gods%20%26%20Idols">Gods & Idols</Link></li>
              <li><Link to="/shop?category=Pooja%20Decor">Pooja Decor</Link></li>
              <li><Link to="/shop?category=Kitchen%20Utensils">Kitchen Utensils</Link></li>
              <li><Link to="/shop?category=Steel%20Vessels">Steel Vessels</Link></li>
              <li><Link to="/shop?category=Brass%20Antiques">Brass Antiques</Link></li>
              <li><Link to="/shop?category=Copper%20Bottles">Copperware</Link></li>
            </ul>
          </div>

          {/* Information & Care */}
          <div className="col-6 col-md-6 col-lg-2">
            <h5 className="text-uppercase fw-bold mb-4" style={{ letterSpacing: '1px' }}>Information</h5>
            <ul className="footer-links-list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/blog">Blog & Articles</Link></li>
              <li><Link to="/care-instructions">Metal Care Guide</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/admin/login" className="text-danger fw-semibold">🔑 Admin Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="col-12 col-md-6 col-lg-4">
            <h5 className="text-uppercase fw-bold mb-4" style={{ letterSpacing: '1px' }}>Sign Up and Save</h5>
            <p className="small text-secondary mb-3" style={{ lineHeight: '1.7' }}>
              Subscribe to get special discount codes, free giveaways, and once-in-a-lifetime deals delivered straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-input-group mb-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="newsletter-submit-btn"
                disabled={status.loading}
              >
                {status.loading ? '...' : <FaPaperPlane />}
              </button>
            </form>
            {status.message && (
              <div className={`small ${status.success ? 'text-success' : 'text-warning'} mt-2 fw-semibold`}>
                {status.message}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar with payment icons */}
        <div className="footer-bottom-bar d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-3 mb-md-0 text-center text-md-start">
            &copy; 2026 AVK Pathira Maaligai, Kumbakonam. All Rights Reserved.
          </div>
          <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
            <span className="small text-secondary me-2">Secure Payments:</span>
            <span className="badge bg-white text-dark py-2 px-3 fw-bold border border-light">GPay</span>
            <span className="badge bg-white text-dark py-2 px-3 fw-bold border border-light">Paytm</span>
            <span className="badge bg-white text-dark py-2 px-3 fw-bold border border-light">RuPay</span>
            <span className="badge bg-white text-dark py-2 px-3 fw-bold border border-light">PhonePe</span>
            <span className="badge bg-white text-dark py-2 px-3 fw-bold border border-light">VISA</span>
            <span className="badge bg-white text-dark py-2 px-3 fw-bold border border-light">Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
