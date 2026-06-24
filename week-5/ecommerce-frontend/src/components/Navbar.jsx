import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { FaShoppingCart, FaSearch, FaUser, FaSignOutAlt, FaBars, FaTimes, FaShoppingBag, FaTag, FaChevronDown } from 'react-icons/fa';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const categories = [
    { name: 'All Products', path: '/products' },
    { name: 'Electronics', path: '/products?category=Electronics' },
    { name: 'Fashion', path: '/products?category=Fashion' },
    { name: 'Mobiles', path: '/products?category=Mobiles' },
    { name: 'Home & Kitchen', path: '/products?category=Home' },
    { name: 'Books', path: '/products?category=Books' },
    { name: 'Sports', path: '/products?category=Sports' },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      {/* Top Navbar Tier */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="bg-yellow-400 text-blue-900 rounded-lg w-9 h-9 flex items-center justify-center font-black text-2xl shadow-sm transition-transform group-hover:scale-105">
              S
            </div>
            <span className="text-2xl font-black tracking-tight hidden sm:inline-block">
              Shop<span className="text-yellow-400">Hub</span>
            </span>
          </Link>

          {/* Search Bar - Center */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-white rounded-l-md focus:outline-none placeholder-gray-500 font-medium border-r border-gray-200"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-2 rounded-r-md transition-colors flex items-center justify-center font-bold"
            >
              <FaSearch className="text-lg" />
            </button>
          </form>

          {/* Desktop Right navigation */}
          <div className="hidden md:flex items-center gap-6 flex-shrink-0 font-semibold">
            {/* Orders Link */}
            <Link to="/orders" className="text-white hover:text-yellow-300 transition-colors text-sm flex items-center gap-1.5">
              <FaShoppingBag className="text-sm" />
              <span>Orders</span>
            </Link>

            {/* Profile / Dropdown */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1 text-white hover:text-yellow-300 transition-colors text-sm focus:outline-none"
                >
                  <FaUser className="text-sm" />
                  <span className="max-w-28 truncate">{user?.email?.split('@')[0]}</span>
                  <FaChevronDown className="text-xs ml-0.5" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b text-xs text-gray-500 font-semibold truncate">
                      {user?.email}
                    </div>
                    <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm">
                      My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm">
                      My Orders
                    </Link>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm flex items-center gap-2 font-semibold"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-white hover:text-yellow-300 transition-colors text-sm">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 py-1.5 rounded-lg transition-all shadow-sm hover:shadow text-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative group flex items-center gap-1.5 text-sm hover:text-yellow-300 transition-colors">
              <div className="relative p-1">
                <FaShoppingCart className="text-xl" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xxs font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center border-2 border-blue-600 animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </div>
              <span className="font-bold">Cart</span>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-4 flex-shrink-0">
            {/* Mobile Cart */}
            <Link to="/cart" className="relative p-2">
              <FaShoppingCart className="text-xl" />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xxs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Hamburger menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none p-1"
            >
              {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navbar Tier: Categories Ribbon (Desktop Only) */}
      <div className="bg-blue-700 text-sm font-semibold border-t border-blue-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-8 flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide py-2.5">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.path}
              className={`hover:text-yellow-300 transition-colors flex items-center gap-1.5 ${
                location.pathname + location.search === cat.path ? 'text-yellow-300' : ''
              }`}
            >
              <FaTag className="text-xs opacity-75" />
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800 text-white border-t border-blue-900 py-4 px-4 space-y-4 animate-slideDown">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 bg-white rounded-l-md focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-blue-900 px-4 rounded-r-md flex items-center justify-center font-bold"
            >
              <FaSearch />
            </button>
          </form>

          {/* Mobile Categories Links */}
          <div className="border-b border-blue-700 pb-3">
            <p className="text-xs uppercase text-gray-400 font-bold mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-1.5 hover:text-yellow-300 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Links */}
          <div className="space-y-3 font-semibold text-sm">
            <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block py-1 hover:text-yellow-300">
              My Orders
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block py-1 hover:text-yellow-300">
                  Profile Settings ({user?.email})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-red-400 hover:text-red-300 flex items-center gap-2"
                >
                  <FaSignOutAlt /> Log Out
                </button>
              </>
            ) : (
              <div className="flex gap-4 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white border border-blue-500"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}