import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import productService from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FaStar, FaStarHalfAlt, FaShoppingCart, FaBolt, FaCheckCircle,
  FaShieldAlt, FaUndo, FaTruck, FaHeadset, FaChevronLeft,
} from 'react-icons/fa';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const { data: product, loading: fetching, error } = useFetch(
    () => productService.getProductById(id),
    [id]
  );

  const rating = product ? ((product.id % 15) * 0.1 + 3.5).toFixed(1) : 0;
  const reviewsCount = product ? (product.id * 37) % 450 + 12 : 0;
  const mrp = product ? (product.price * 1.3).toFixed(0) : 0;
  const discount = '30% off';

  const renderStars = (r) => {
    const stars = [];
    const full = Math.floor(r);
    const half = r % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= full) stars.push(<FaStar key={i} className="text-yellow-500" />);
      else if (i === full + 1 && half) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      else stars.push(<FaStar key={i} className="text-gray-300" />);
    }
    return stars;
  };

  const setMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 2500);
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    try {
      setLoading(true);
      await addToCart(parseInt(id), quantity);
      setMsg('Added to cart successfully!', 'success');
    } catch (err) {
      setMsg('Failed to add to cart.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    try {
      setLoading(true);
      await addToCart(parseInt(id), quantity);
      navigate('/checkout');
    } catch (err) {
      setMsg('Failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="py-24"><LoadingSpinner /></div>;

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-red-600 font-bold text-lg mb-6">{error || 'Product not found'}</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const stockWarning = product.stock > 0 && product.stock <= 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm mb-6"
        >
          <FaChevronLeft className="text-xs" /> Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Left: Product Image */}
            <div className="relative bg-gray-50 flex items-center justify-center p-12 border-r border-gray-100 min-h-96">
              <img
                src={
                  product.image_url
                    ? 'http://127.0.0.1:8000/' + product.image_url
                    : 'https://via.placeholder.com/500x500?text=Product'
                }
                alt={product.name}
                className="max-h-80 max-w-full object-contain transition-transform duration-500 hover:scale-105"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xxs flex items-center justify-center">
                  <span className="bg-red-600 text-white font-black text-sm px-6 py-2.5 rounded-full shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
              {stockWarning && (
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow">
                  Only {product.stock} Left!
                </span>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="p-8 flex flex-col">

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating Row */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-600 text-white font-black text-xs px-2.5 py-1 rounded flex items-center gap-1">
                  {rating} <FaStar className="text-xxs" />
                </span>
                <div className="flex items-center gap-0.5">
                  {renderStars(parseFloat(rating))}
                </div>
                <span className="text-sm text-gray-500">({reviewsCount.toLocaleString()} ratings)</span>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                {/* Pricing */}
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-black text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base text-gray-400 line-through">₹{parseInt(mrp).toLocaleString('en-IN')}</span>
                  <span className="text-base font-bold text-green-600">{discount}</span>
                </div>
                <p className="text-xs text-gray-500">Inclusive of all taxes. Free delivery available.</p>

                {/* Stock Status */}
                <div className="mt-3">
                  {isOutOfStock ? (
                    <span className="text-red-600 font-bold text-sm">Out of Stock</span>
                  ) : (
                    <span className="text-green-600 font-bold text-sm flex items-center gap-1.5">
                      <FaCheckCircle /> In Stock
                      {stockWarning && <span className="text-orange-600 ml-1">— Hurry! Only {product.stock} left</span>}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 border-b border-gray-100 pb-6">
                {product.description || 'No description available for this product.'}
              </p>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-bold text-gray-700">Qty:</span>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors font-bold text-lg leading-none"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-black text-gray-900 border-l border-r border-gray-300 py-2.5">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors font-bold text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">{product.stock} units available</span>
                </div>
              )}

              {/* Status Message */}
              {message.text && (
                <div
                  className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message.type === 'success' ? <FaCheckCircle /> : '⚠️'} {message.text}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-3 flex-col sm:flex-row mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || loading}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-black text-sm transition-all border-2 ${
                    isOutOfStock
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-blue-600 text-blue-600 bg-white hover:bg-blue-50 shadow-sm'
                  }`}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || loading}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-black text-sm transition-all text-white shadow-md ${
                    isOutOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
                  }`}
                >
                  <FaBolt /> Buy Now
                </button>
              </div>

              {/* Assurances */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <FaTruck className="text-blue-600 text-base mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">Free Delivery</p>
                    <p>On orders over ₹500</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaUndo className="text-blue-600 text-base mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">7-Day Returns</p>
                    <p>Hassle-free return policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaShieldAlt className="text-blue-600 text-base mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">Secure Payment</p>
                    <p>100% secure checkout</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaHeadset className="text-blue-600 text-base mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">24/7 Support</p>
                    <p>Get help whenever needed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}