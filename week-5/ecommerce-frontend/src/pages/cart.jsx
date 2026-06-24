import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import orderService from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FaTrashAlt, FaMinus, FaPlus, FaShoppingBag, FaArrowRight,
  FaShieldAlt, FaTruck, FaTag,
} from 'react-icons/fa';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, loading, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const { isLoggedIn } = useAuth();
  const [removingId, setRemovingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdatingId(productId);
      await updateQuantity(productId, newQuantity);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      await removeFromCart(productId);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <div className="py-24"><LoadingSpinner /></div>;

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <FaShoppingBag className="text-5xl text-blue-200 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-800 mb-2">Please Log In</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to see your cart items.</p>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-md inline-block"
          >
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <p className="text-7xl mb-5">🛒</p>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm mb-8">
            Looks like you haven't added anything yet. Explore thousands of products now!
          </p>
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-black shadow-md inline-flex items-center gap-2"
          >
            <FaShoppingBag /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaShoppingBag className="text-blue-600 text-2xl" />
          <div>
            <h1 className="text-2xl font-black text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500">{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-opacity ${
                  removingId === item.id ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Item Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={
                          item.image_url
                            ? 'http://127.0.0.1:8000/' + item.image_url
                            : 'https://via.placeholder.com/100x100?text=Product'
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Item Details */}
                  <div className="flex-grow min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm md:text-base"
                    >
                      {item.name}
                    </Link>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded">
                        In Stock
                      </span>
                      <span className="text-xs text-blue-600 font-semibold">Free Delivery</span>
                    </div>

                    {/* Price + Controls Row */}
                    <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
                      <div>
                        <span className="text-lg font-black text-gray-900">
                          ₹{(item.price * item.cartQuantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          (₹{item.price.toLocaleString('en-IN')} each)
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Quantity Controls */}
                        <div className={`flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm ${updatingId === item.id ? 'opacity-60' : ''}`}>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.cartQuantity - 1)}
                            disabled={item.cartQuantity <= 1 || updatingId === item.id}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="px-4 py-2 font-black text-gray-900 border-l border-r border-gray-200 min-w-10 text-center text-sm">
                            {item.cartQuantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.cartQuantity + 1)}
                            disabled={item.cartQuantity >= item.stock || updatingId === item.id}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                          className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 transition-all px-3 py-2 rounded-xl border border-red-100"
                        >
                          <FaTrashAlt /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm mt-2"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Coupon Banner */}
            <div className="bg-white rounded-2xl border border-dashed border-blue-300 p-4 flex items-center gap-3">
              <FaTag className="text-blue-500 flex-shrink-0" />
              <div className="flex-grow">
                <p className="text-xs font-bold text-gray-700">Have a coupon code?</p>
                <p className="text-xs text-gray-400">Savings applied at checkout</p>
              </div>
              <button className="text-xs font-black text-blue-600 hover:underline">Apply</button>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-black text-gray-900 mb-5 pb-4 border-b border-gray-100">
                Price Details
              </h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Price ({getTotalItems()} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="font-semibold text-green-600">− ₹{(subtotal * 0.3).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10% GST)</span>
                  <span className="font-semibold text-gray-900">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-gray-900">
                    ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-green-600 font-bold mt-1 text-right">
                  You save ₹{(subtotal * 0.3).toFixed(0)} on this order 🎉
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-blue-900 font-black py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
              >
                Proceed to Checkout <FaArrowRight className="text-xs" />
              </button>

              {/* Safety Badges */}
              <div className="mt-5 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-500" />
                  <span>Safe and Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTruck className="text-blue-500" />
                  <span>Free delivery on orders over ₹500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}