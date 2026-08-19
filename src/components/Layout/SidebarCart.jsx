import React from 'react';
import { FaTimes, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { FREE_SHIPPING_THRESHOLD } from '../../utils/calculateTotal';

export default function SidebarCart({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

  // Shipping threshold progress calculations
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    let text = "Hello AVK Pathira Maaligai, I would like to place an order for the following products:\n\n";
    cart.forEach((item, index) => {
      text += `${index + 1}. ${item.name} (${item.material}) - Qty: ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}\n`;
    });

    const subtotalFormatted = formatCurrency(subtotal);
    const delivery = subtotal >= FREE_SHIPPING_THRESHOLD ? "FREE" : "Rs.250";
    const totalFormatted = subtotal >= FREE_SHIPPING_THRESHOLD ? subtotalFormatted : formatCurrency(subtotal + 250);

    text += `\nSubtotal: ${subtotalFormatted}`;
    text += `\nDelivery Charges: ${delivery}`;
    text += `\nTotal: ${totalFormatted}`;
    text += `\n\nPlease confirm availability and payment details. Thank you!`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/917550394939?text=${encodedText}`, '_blank');
  };

  return (
    <>
      {/* Offcanvas Drawer panel */}
      <div 
        className={`offcanvas offcanvas-end ${isOpen ? 'show' : ''}`} 
        tabIndex="-1" 
        style={{ 
          visibility: isOpen ? 'visible' : 'hidden', 
          zIndex: 1050,
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="offcanvas-header py-3">
          <h5 className="offcanvas-title fw-bold" style={{ letterSpacing: '1px' }}>YOUR CART</h5>
          <button 
            type="button" 
            className="btn-close text-reset shadow-none" 
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column justify-content-between">
          <div>
            {/* Free Shipping Progress Indicator */}
            <div className="mb-4 bg-white p-3 border border-light shadow-sm">
              {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                <p className="small mb-2 text-success fw-semibold">
                  🎉 Free shipping unlocked!
                </p>
              ) : (
                <p className="small mb-2 text-dark">
                  Add <span className="fw-bold text-danger">{formatCurrency(remainingForFreeShipping)}</span> more to get <span className="fw-semibold">FREE shipping!</span>
                </p>
              )}
              <div className="progress shipping-progress-bar">
                <div 
                  className={`progress-bar ${subtotal >= FREE_SHIPPING_THRESHOLD ? 'bg-success' : 'bg-danger'}`} 
                  role="progressbar" 
                  style={{ width: `${progressPercent}%` }} 
                  aria-valuenow={progressPercent} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted mb-4">Your cart is currently empty.</p>
                <button 
                  onClick={onClose} 
                  className="btn btn-luxury"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              <div className="cart-items-wrapper">
                {cart.map((item) => (
                  <div key={item.id} className="sidebar-cart-item">
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="sidebar-cart-img"
                    />
                    <div className="sidebar-cart-details">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="sidebar-cart-title text-truncate pe-2">{item.name}</h6>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="bg-transparent border-0 text-secondary hover-danger p-0"
                          style={{ cursor: 'pointer' }}
                          title="Remove item"
                        >
                          <FaTrash size={12} className="text-danger" />
                        </button>
                      </div>
                      <p className="small text-muted mb-2">Material: {item.material}</p>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        {/* Quantity control */}
                        <div className="qty-control-inline">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="qty-control-btn"
                          >
                            -
                          </button>
                          <span className="qty-control-val">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="qty-control-btn"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Line item price */}
                        <span className="fw-bold text-dark small">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer Summary */}
          {cart.length > 0 && (
            <div className="cart-drawer-footer border-top pt-3 mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-semibold text-secondary">Subtotal:</span>
                <span className="h4 mb-0 fw-bold text-dark">{formatCurrency(subtotal)}</span>
              </div>
              <p className="xsmall text-muted mb-3 text-center">
                Shipping & taxes calculated at checkout.
              </p>
              
              <button 
                onClick={handleWhatsAppCheckout} 
                className="whatsapp-ask-btn w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: '1rem' }}
              >
                <FaWhatsapp size={20} /> ORDER VIA WHATSAPP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="offcanvas-backdrop fade show" 
          style={{ zIndex: 1040 }}
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
