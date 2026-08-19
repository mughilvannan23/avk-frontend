import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowRight, FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { FREE_SHIPPING_THRESHOLD } from '../utils/calculateTotal';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    let text = "Hello AVK Pathira Maaligai, I would like to order:\n\n";
    cart.forEach((item, index) => {
      text += `${index + 1}. ${item.name} (${item.material}) - Qty: ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}\n`;
    });

    const subtotalFormatted = formatCurrency(subtotal);
    const delivery = subtotal >= FREE_SHIPPING_THRESHOLD ? "FREE" : "Rs.250";
    const totalFormatted = subtotal >= FREE_SHIPPING_THRESHOLD ? subtotalFormatted : formatCurrency(subtotal + 250);

    text += `\nSubtotal: ${subtotalFormatted}`;
    text += `\nDelivery Charges: ${delivery}`;
    text += `\nTotal: ${totalFormatted}`;
    text += `\n\nPlease process my checkout. Thank you!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917550394939?text=${encoded}`, '_blank');
  };

  return (
    <div className="container py-5">
      <h1 className="heading-serif mb-4">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-5 bg-white border shadow-sm">
          <FaShoppingCart size={50} className="text-muted mb-3" />
          <h3 className="heading-serif">Your Cart is Empty</h3>
          <p className="text-secondary small mb-4">Add some beautiful brassware to start your heritage journey.</p>
          <Link to="/shop" className="btn btn-luxury px-5 py-3">
            SHOP THE COLLECTIONS
          </Link>
        </div>
      ) : (
        <div className="row gy-4">
          {/* Cart Table List */}
          <div className="col-12 col-lg-8">
            <div className="bg-white border p-4 shadow-sm table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr className="text-uppercase text-secondary font-monospace" style={{ fontSize: '0.8rem' }}>
                    <th scope="col" className="border-bottom-2">Product</th>
                    <th scope="col" className="border-bottom-2 text-center">Price</th>
                    <th scope="col" className="border-bottom-2 text-center">Quantity</th>
                    <th scope="col" className="border-bottom-2 text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td style={{ minWidth: '220px' }}>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            style={{ width: '60px', height: '60px', objectFit: 'cover', border: '1px solid #e2dfd7' }}
                            className="me-3"
                          />
                          <div>
                            <Link to={`/product/${item.id}`} className="fw-semibold text-dark text-decoration-none small d-block mb-1">
                              {item.name}
                            </Link>
                            <span className="badge bg-light text-secondary border font-monospace xsmall">
                              {item.material}
                            </span>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="btn btn-link text-danger p-0 ms-3 xsmall align-middle"
                              title="Delete Item"
                            >
                              <FaTrash className="me-1" /> Remove
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="text-center small">{formatCurrency(item.price)}</td>
                      <td className="text-center">
                        <div className="qty-control-inline mx-auto">
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
                      </td>
                      <td className="text-end fw-bold small">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="col-12 col-lg-4">
            <div className="bg-white border p-4 shadow-sm sticky-top" style={{ top: '150px' }}>
              <h4 className="heading-serif h5 border-bottom pb-2 mb-3">Order Summary</h4>
              
              <div className="d-flex justify-content-between mb-2 small text-secondary">
                <span>Subtotal:</span>
                <span className="fw-semibold text-dark">{formatCurrency(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 small text-secondary">
                <span>Delivery:</span>
                <span className="fw-semibold text-success">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : formatCurrency(250)}
                </span>
              </div>

              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="alert alert-warning py-2 px-3 mb-4 rounded-0" style={{ fontSize: '0.75rem' }}>
                  Spend <strong>{formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> more to get free delivery!
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Estimated Total:</span>
                <span className="h4 mb-0 fw-bold text-danger">
                  {formatCurrency(subtotal >= FREE_SHIPPING_THRESHOLD ? subtotal : subtotal + 250)}
                </span>
              </div>

              <div className="d-flex flex-column gap-2">
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn btn-luxury w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: '0.9rem' }}
                >
                  PROCEED TO CHECKOUT <FaArrowRight size={12} />
                </button>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="btn btn-success text-white w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: '0.9rem', borderRadius: 0 }}
                >
                  <FaWhatsapp size={18} /> CHECKOUT VIA WHATSAPP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
