import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { mockApi } from '../services/mockApi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import ProductGallery from '../components/Product/ProductGallery';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc'); // local tab state if needed

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Product fetch error:", err);
        navigate('/not-found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading product...</span>
        </div>
      </div>
    );
  }

  if (!product) return null;

  // Star ratings helper
  const renderStars = (rating) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<FaStar key={i} />);
      } else if (i === floorRating + 1 && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  // WhatsApp individual product inquiry handler
  const handleProductInquiry = () => {
    const message = `Hello AVK Pathira Maaligai, I am interested in purchasing: ${product.name} (${product.id}) priced at ${formatCurrency(product.price)}. Can you please provide more information regarding shipping time and stock?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/917550394939?text=${encoded}`, '_blank');
  };

  // Buy Now checkout flow
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container py-4">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb breadcrumb-luxury">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/shop">Shop</Link></li>
          <li className="breadcrumb-item"><Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      {/* Main Product Panel */}
      <div className="row gy-5">
        {/* Left: Gallery Column */}
        <div className="col-12 col-md-6 col-lg-5">
          <ProductGallery images={product.images} />
        </div>

        {/* Right: Info & Pricing Column */}
        <div className="col-12 col-md-6 col-lg-7 ps-lg-5">
          <h1 className="product-details-title heading-serif">{product.name}</h1>
          
          {/* Rating */}
          <div className="product-rating mb-3 fs-6">
            {renderStars(product.rating)}
            <span className="text-muted small ms-2">({product.reviewsCount} reviews)</span>
          </div>

          {/* Pricing Row */}
          <div className="d-flex align-items-center gap-3 mb-2 flex-wrap">
            <span className="details-price-current fw-bold">{formatCurrency(product.price)}</span>
            {product.oldPrice && (
              <span className="details-price-old">{formatCurrency(product.oldPrice)}</span>
            )}
            {product.discount && (
              <span className="details-discount-badge">{product.discount}</span>
            )}
          </div>
          <p className="small text-muted mb-4">(Inclusive Of All Taxes)</p>

          <p className="text-secondary small mb-4" style={{ lineHeight: '1.7' }}>
            {product.description}
          </p>

          {/* Add-to-cart controls */}
          <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
            <span className="small fw-semibold text-secondary">Quantity:</span>
            <div className="qty-selector-large">
              <button 
                onClick={() => setQuantity(prev => Math.max(prev - 1, 1))} 
                className="qty-selector-large-btn"
              >
                -
              </button>
              <span className="qty-selector-large-val">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)} 
                className="qty-selector-large-btn"
              >
                +
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="d-flex flex-column gap-2 mb-4">
            <button
              onClick={() => addToCart(product, quantity)}
              className="btn btn-luxury w-100 py-3 fw-bold"
              style={{ fontSize: '1rem' }}
            >
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              className="btn btn-luxury-outline w-100 py-3 fw-bold"
              style={{ fontSize: '1rem' }}
            >
              BUY IT NOW
            </button>
          </div>

          <div className="border p-3 mb-4 bg-white" style={{ fontSize: '0.8rem', borderStyle: 'dashed !important' }}>
            🚚 <span className="fw-semibold text-dark">Delivery Info:</span> Please note that domestic orders arrive within 5-7 working days, while international deliveries take 7-14 days.
          </div>

          {/* Contact Lead Card */}
          <div className="whatsapp-ask-box shadow-sm">
            <h5 className="heading-serif mb-2" style={{ fontSize: '1.15rem' }}>Do You Have Any Questions About The Product?</h5>
            <p className="xsmall text-secondary mb-3">
              If you have queries or need customized weight/sizes, feel free to reach our customer care desk.
            </p>
            <div className="row g-2 mb-3">
              <div className="col-12 col-sm-6">
                <div className="p-2 border bg-white d-flex align-items-center gap-2 small">
                  <FaPhoneAlt className="text-secondary" /> <span className="fw-bold">+91 75503 94939</span>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="p-2 border bg-white d-flex align-items-center gap-2 small">
                  <FaEnvelope className="text-secondary" /> <span className="fw-bold">hello@avkpathiramaaligai.com</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleProductInquiry}
              className="whatsapp-ask-btn"
            >
              <FaWhatsapp size={18} /> Ask About This Piece on WhatsApp
            </button>
          </div>

          {/* Technical Specifications Accordion */}
          <div className="accordion accordion-luxury mt-3" id="detailsAccordion">
            {/* Description Tab */}
            <div className="accordion-item border-bottom">
              <h2 className="accordion-header" id="headingDesc">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDesc" aria-expanded="false" aria-controls="collapseDesc">
                  Description
                </button>
              </h2>
              <div id="collapseDesc" className="accordion-collapse collapse" aria-labelledby="headingDesc" data-bs-parent="#detailsAccordion">
                <div className="accordion-body small text-secondary" style={{ lineHeight: '1.8' }}>
                  {product.description}
                </div>
              </div>
            </div>

            {/* Specifications Tab */}
            <div className="accordion-item border-bottom">
              <h2 className="accordion-header" id="headingSpecs">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSpecs" aria-expanded="false" aria-controls="collapseSpecs">
                  Specifications
                </button>
              </h2>
              <div id="collapseSpecs" className="accordion-collapse collapse" aria-labelledby="headingSpecs" data-bs-parent="#detailsAccordion">
                <div className="accordion-body p-0">
                  <table className="table table-bordered table-striped mb-0 small" style={{ backgroundColor: '#ffffff' }}>
                    <tbody>
                      {product.specifications.map((spec, index) => (
                        <tr key={index}>
                          <td className="fw-semibold text-secondary w-40" style={{ padding: '0.75rem 1rem' }}>{spec.label}</td>
                          <td className="text-dark" style={{ padding: '0.75rem 1rem' }}>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Disclaimer Tab */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingDisclaimer">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDisclaimer" aria-expanded="false" aria-controls="collapseDisclaimer">
                  Disclaimer
                </button>
              </h2>
              <div id="collapseDisclaimer" className="accordion-collapse collapse" aria-labelledby="headingDisclaimer" data-bs-parent="#detailsAccordion">
                <div className="accordion-body small text-secondary" style={{ lineHeight: '1.8' }}>
                  {product.disclaimer}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
