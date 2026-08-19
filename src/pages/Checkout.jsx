import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { FREE_SHIPPING_THRESHOLD } from '../utils/calculateTotal';
import { mockApi } from '../services/mockApi';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const deliveryCharges = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const totalAmount = subtotal + deliveryCharges;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const payload = {
        customer: shippingInfo,
        items: cart,
        subtotal,
        deliveryCharges,
        totalAmount
      };

      const res = await mockApi.placeOrder(payload);
      setOrderResult(res);
      clearCart(); // Empty cart state upon completion
    } catch (err) {
      console.error("Order submission failure:", err);
    } finally {
      setLoading(false);
    }
  };

  // If order was successfully completed, show checkout landing success panel
  if (orderResult) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: '600px' }}>
        <div className="bg-white border p-5 shadow-sm">
          <FaCheckCircle size={60} className="text-success mb-4" />
          <h2 className="heading-serif mb-2 text-success">Order Confirmed!</h2>
          <p className="fw-semibold text-dark mb-4">Your order reference ID is: {orderResult.orderId}</p>
          <p className="text-secondary small mb-4">
            Thank you for shopping at AVK Pathira Maaligai. We have received your order details and are preparing your package. A confirmation message has been logged to your register.
          </p>
          <div className="border-top pt-4">
            <Link to="/shop" className="btn btn-luxury w-100 py-3 fw-bold">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="heading-serif mb-4">Checkout Details</h1>

      {cart.length === 0 ? (
        <div className="text-center py-5 bg-white border">
          <FaShoppingCart size={48} className="text-muted mb-3" />
          <h3 className="heading-serif">Your Cart is Empty</h3>
          <p className="text-secondary small mb-4">You cannot checkout without items in your cart.</p>
          <Link to="/shop" className="btn btn-luxury">GO TO SHOP</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmitOrder}>
          <div className="row gy-4">
            {/* Shipping Form Panel */}
            <div className="col-12 col-lg-7">
              <div className="bg-white border p-4 shadow-sm">
                <h4 className="heading-serif h5 border-bottom pb-2 mb-4">Shipping Address</h4>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="form-control form-control-luxury"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="form-control form-control-luxury"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="form-control form-control-luxury"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 7550394939"
                      className="form-control form-control-luxury"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="House number, apartment, street name, etc."
                      className="form-control form-control-luxury"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="form-control form-control-luxury"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      className="form-control form-control-luxury"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      className="form-control form-control-luxury"
                      value={shippingInfo.pincode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <h4 className="heading-serif h5 border-bottom pb-2 mt-5 mb-3">Payment Method</h4>
                <div className="form-check p-3 border mb-3" style={{ backgroundColor: '#fcfcfc' }}>
                  <input
                    className="form-check-input form-check-input-luxury ms-1 me-3"
                    type="radio"
                    name="paymentMethod"
                    id="codRadio"
                    defaultChecked
                  />
                  <label className="form-check-label small fw-bold text-dark" htmlFor="codRadio">
                    Cash On Delivery (COD) / Bank Transfer
                  </label>
                  <p className="xsmall text-muted mb-0 mt-1 ms-4">
                    Pay in cash upon delivery, or scan GooglePay/Paytm QR code with our courier agent during package arrival.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Checkout Column (Right) */}
            <div className="col-12 col-lg-5">
              <div className="bg-white border p-4 shadow-sm">
                <h4 className="heading-serif h5 border-bottom pb-2 mb-3">Your Order</h4>
                
                {/* List items */}
                <div className="mb-4" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {cart.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                      <div className="d-flex align-items-center" style={{ maxWidth: '75%' }}>
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                          className="me-2 border"
                        />
                        <div>
                          <span className="small text-dark fw-semibold d-block text-truncate">{item.name}</span>
                          <span className="xsmall text-muted font-monospace">{item.quantity} x {formatCurrency(item.price)}</span>
                        </div>
                      </div>
                      <span className="small fw-semibold">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>Subtotal:</span>
                  <span className="fw-semibold text-dark">{formatCurrency(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 small text-secondary">
                  <span>Delivery Charges:</span>
                  <span className="fw-semibold text-success">
                    {deliveryCharges === 0 ? 'FREE' : formatCurrency(deliveryCharges)}
                  </span>
                </div>

               <hr />

                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold">Total Amount:</span>
                  <span className="h4 mb-0 fw-bold text-danger">{formatCurrency(totalAmount)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-luxury w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: '1rem' }}
                >
                  <FaLock size={14} /> {loading ? 'PLACING ORDER...' : 'PLACE ORDER (COD)'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
