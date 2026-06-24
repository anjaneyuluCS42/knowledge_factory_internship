import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import orderService from '../services/orderService';
import { FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaSpinner } from 'react-icons/fa';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart, fetchCart, getTotalPrice, getTotalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState('');
  
  // Shipping Form State
  const [shipping, setShipping] = useState({
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    zip: '',
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.phone || !shipping.addressLine || !shipping.city || !shipping.state || !shipping.zip) {
      setError('Please fill in all shipping details');
      return;
    }

    if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      setError('Please fill in card details');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Place order via backend API
      const response = await orderService.placeOrder();
      
      // Successfully placed on server. Clear local/context cart state
      setOrderPlaced(true);
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (err) {
      setError(err.detail || 'An error occurred while placing your order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-md max-w-md mx-auto">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">There are no items in your cart to checkout.</p>
          <Link to="/products" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md">
            Go Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-gray-50">
      {orderPlaced ? (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-10 text-center flex flex-col items-center justify-center border border-green-100">
          <FaCheckCircle className="text-green-500 text-7xl mb-4 animate-bounce" />
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order was placed successfully.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg w-full mb-6 text-sm text-gray-500">
            Redirecting to your orders dashboard...
          </div>
          <Link to="/orders" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors">
            View Orders Now
          </Link>
        </div>
      ) : (
        <div>
          {/* Progress Tracker */}
          <div className="flex items-center justify-center mb-8 gap-4 text-sm font-semibold">
            <span className="text-amber-600">Cart</span>
            <span className="text-gray-300">——</span>
            <span className="bg-amber-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center">2</span>
            <span className="text-gray-800">Checkout</span>
            <span className="text-gray-300">——</span>
            <span className="border border-gray-300 text-gray-400 rounded-full w-6 h-6 inline-flex items-center justify-center">3</span>
            <span className="text-gray-400">Order History</span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Secure Checkout</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Forms */}
            <form onSubmit={handlePlaceOrder} className="lg:col-span-8 space-y-6">
              
              {/* Delivery Address */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-3 border-b pb-4 mb-5">
                  <FaMapMarkerAlt className="text-amber-500 text-xl" />
                  <h2 className="text-xl font-bold text-gray-800">Shipping Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={shipping.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shipping.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="10-digit number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Flat, House no., Building, Apartment</label>
                    <input
                      type="text"
                      name="addressLine"
                      value={shipping.addressLine}
                      onChange={handleInputChange}
                      required
                      placeholder="123 Main St, Apt 4B"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Town/City</label>
                    <input
                      type="text"
                      name="city"
                      value={shipping.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Mumbai"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={shipping.state}
                      onChange={handleInputChange}
                      required
                      placeholder="Maharashtra"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode / ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={shipping.zip}
                      onChange={handleInputChange}
                      required
                      placeholder="400001"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-3 border-b pb-4 mb-5">
                  <FaCreditCard className="text-amber-500 text-xl" />
                  <h2 className="text-xl font-bold text-gray-800">Select Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {/* Card Payment */}
                  <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-amber-500 bg-amber-50/30' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 font-semibold text-gray-800">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span>Credit / Debit Card</span>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 grid grid-cols-3 gap-3 animate-fadeIn">
                        <div className="col-span-3">
                          <input
                            type="text"
                            name="number"
                            placeholder="Card Number"
                            value={cardDetails.number}
                            onChange={handleCardChange}
                            required={paymentMethod === 'card'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                            required={paymentMethod === 'card'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="password"
                            name="cvv"
                            placeholder="CVV"
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                            required={paymentMethod === 'card'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </label>

                  {/* UPI */}
                  <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-amber-500 bg-amber-50/30' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 font-semibold text-gray-800">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span>UPI (Google Pay, PhonePe, BHIM)</span>
                    </div>
                    {paymentMethod === 'upi' && (
                      <div className="mt-3 animate-fadeIn">
                        <input
                          type="text"
                          placeholder="yourname@okaxis"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter your virtual payment address to pay.</p>
                      </div>
                    )}
                  </label>

                  {/* COD */}
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-amber-500 bg-amber-50/30' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <div className="font-semibold text-gray-800">Cash on Delivery (COD)</div>
                  </label>
                </div>
              </div>

              {/* Complete Order Buttons */}
              <div className="flex gap-4">
                <Link
                  to="/cart"
                  className="flex-1 py-3.5 px-4 text-center font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all border border-gray-200"
                >
                  Return to Cart
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 w-full flex items-center justify-center gap-2 py-3.5 px-6 font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Placing Order...
                    </>
                  ) : (
                    'Confirm & Pay'
                  )}
                </button>
              </div>
            </form>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Summary</h2>
              
              <div className="max-h-48 overflow-y-auto divide-y mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 py-3 items-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border flex-shrink-0">
                      <img
                        src={item.image_url ? 'http://127.0.0.1:8000/' + item.image_url : 'https://via.placeholder.com/60'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.cartQuantity}</p>
                    </div>
                    <p className="font-semibold text-sm text-amber-600 text-right">
                      ₹{(item.price * item.cartQuantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t text-sm font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items):</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (Estimated 10%):</span>
                  <span>₹{(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg text-gray-900 pt-3 border-t">
                  <span>Order Total:</span>
                  <span className="text-2xl font-extrabold text-amber-600">
                    ₹{(getTotalPrice() * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl text-xs text-amber-800 mt-6 border border-amber-100 flex items-start gap-2">
                <span>🛡️</span>
                <span>All transactions are secure and encrypted. Buy with confidence.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
