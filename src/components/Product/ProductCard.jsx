import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaCartPlus } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const productId = product._id || product.id;
  const firstImage = (product.images && product.images.length > 0) ? product.images[0] : 'https://via.placeholder.com/400x400?text=No+Image';

  // Render star ratings helper
  const renderStars = (rating = 5) => {
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

  return (
    <div className="product-card">
      {/* Discount Badge */}
      {product.discount && (
        <span className="product-badge-sale">{product.discount}</span>
      )}

      {/* Product Image Link */}
      <Link to={`/product/${productId}`} className="product-image-container">
        <img
          src={firstImage}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
      </Link>

      {/* Card Info Body */}
      <div className="product-card-body">
        {/* Category tag */}
        <span className="text-uppercase text-secondary font-monospace mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
          {product.category}
        </span>

        {/* Title */}
        <Link to={`/product/${productId}`} className="product-card-title">
          {product.name}
        </Link>

        {/* Rating */}
        <div className="product-rating">
          {renderStars(product.rating)}
          <span className="text-muted small ms-2">({product.reviewsCount || 0} reviews)</span>
        </div>

        {/* Pricing block */}
        <div className="price-block mt-auto">
          <span className="price-current">{formatCurrency(product.price)}</span>
          {product.oldPrice && (
            <span className="price-old">{formatCurrency(product.oldPrice)}</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="product-card-footer mt-2">
          <button
            onClick={() => addToCart({ ...product, id: productId }, 1)}
            className="btn btn-luxury w-100 py-2 d-flex align-items-center justify-content-center gap-2"
          >
            <FaCartPlus size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
