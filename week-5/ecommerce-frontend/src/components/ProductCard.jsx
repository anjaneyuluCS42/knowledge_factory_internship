import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaBolt } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Deterministically generate a mock rating (3.5 to 4.9) and reviews count based on product ID
  const rating = ((product.id % 15) * 0.1 + 3.5).toFixed(1);
  const reviewsCount = (product.id * 37) % 450 + 12;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Stop click from bubbling up to Link
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await addToCart(product.id, 1);
      setStatusMessage('Added!');
      setTimeout(() => setStatusMessage(''), 2000);
    } catch (err) {
      setStatusMessage('Failed');
      setTimeout(() => setStatusMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault(); // Stop click from bubbling up to Link
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await addToCart(product.id, 1);
      navigate('/checkout');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render rating stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500 text-sm" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500 text-sm" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 flex flex-col h-full overflow-hidden relative transform hover:-translate-y-1">
      {/* Product Link wrapper */}
      <Link to={`/product/${product.id}`} className="flex flex-col h-full flex-grow">
        
        {/* Product Image Panel */}
        <div className="relative bg-gray-50 h-56 flex items-center justify-center overflow-hidden border-b border-gray-100 p-4">
          <img
            src={product.image_url ? 'http://127.0.0.1:8000/' + product.image_url : 'https://via.placeholder.com/250x250?text=Product'}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xxs flex items-center justify-center">
              <span className="bg-red-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md tracking-wider uppercase">
                Out of Stock
              </span>
            </div>
          )}

          {product.stock > 0 && product.stock <= 5 && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white font-black text-xxs px-2 py-0.5 rounded shadow">
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Product Content Details */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors flex-grow">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2 mb-1.5">
            <span className="bg-green-600 text-white font-bold text-xxs px-1.5 py-0.5 rounded flex items-center gap-0.5">
              {rating} <FaStar className="text-xxs" />
            </span>
            <div className="flex items-center">
              {renderStars(parseFloat(rating))}
            </div>
            <span className="text-xs text-gray-500">
              ({reviewsCount})
            </span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-xl md:text-2xl font-black text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-500 line-through">
              ₹{(product.price * 1.3).toFixed(0).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-green-600 font-bold">
              30% Off
            </span>
          </div>

          <div className="text-xxs text-gray-400 mt-1">
            Free Delivery
          </div>
        </div>
      </Link>

      {/* Buy & Add Actions Row */}
      <div className="p-4 pt-0 border-t border-gray-50 mt-auto flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || loading}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-bold rounded-lg transition-colors border select-none ${
            isOutOfStock
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'
          }`}
        >
          <FaShoppingCart className="text-xs" />
          <span>{statusMessage ? statusMessage : 'Add to Cart'}</span>
        </button>
        
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock || loading}
          className={`flex-1 flex items-center justify-center gap-1 py-2 px-1 text-xs font-bold rounded-lg transition-colors select-none text-white ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-sm'
          }`}
        >
          <FaBolt className="text-xs" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}