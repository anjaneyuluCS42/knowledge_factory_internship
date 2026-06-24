import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FaSearch, FaSlidersH, FaSort, FaTimes, FaFilter
} from 'react-icons/fa';

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'latest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Top Rated', value: 'rating' },
];

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹2,000', min: 500, max: 2000 },
  { label: '₹2,000 – ₹10,000', min: 2000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: Infinity },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeSearch, setActiveSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const paramSearch = searchParams.get('search') || '';
    setSearchQuery(paramSearch);
    setActiveSearch(paramSearch);
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [products, sortBy, selectedPriceRange, inStockOnly, activeSearch]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.detail || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (selectedPriceRange) {
      filtered = filtered.filter(
        (p) => p.price >= selectedPriceRange.min && p.price < selectedPriceRange.max
      );
    }

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.id % 20 - a.id % 20);
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
    setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-6 text-sm">
      {/* Sort */}
      <div>
        <h3 className="font-black text-gray-800 flex items-center gap-2 mb-3">
          <FaSort className="text-blue-600" /> Sort By
        </h3>
        <div className="space-y-2">
          {SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={sortBy === opt.value}
                onChange={() => setSortBy(opt.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className={sortBy === opt.value ? 'font-bold text-blue-600' : 'text-gray-700'}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Price Range */}
      <div>
        <h3 className="font-black text-gray-800 flex items-center gap-2 mb-3">
          <FaSlidersH className="text-blue-600" /> Price Range
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={selectedPriceRange === null}
              onChange={() => setSelectedPriceRange(null)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className={!selectedPriceRange ? 'font-bold text-blue-600' : 'text-gray-700'}>
              All Prices
            </span>
          </label>
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={selectedPriceRange?.label === range.label}
                onChange={() => setSelectedPriceRange(range)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span
                className={
                  selectedPriceRange?.label === range.label
                    ? 'font-bold text-blue-600'
                    : 'text-gray-700'
                }
              >
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Availability */}
      <div>
        <h3 className="font-black text-gray-800 mb-3">Availability</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Reset Filters */}
      {(selectedPriceRange || inStockOnly || sortBy !== 'latest') && (
        <button
          onClick={() => {
            setSelectedPriceRange(null);
            setInStockOnly(false);
            setSortBy('latest');
          }}
          className="w-full text-center text-xs font-bold text-red-600 hover:text-red-700 flex items-center justify-center gap-1 border border-red-200 rounded-lg py-2"
        >
          <FaTimes className="text-xs" /> Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">
          {activeSearch ? `Results for "${activeSearch}"` : 'All Products'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {!loading && `Showing ${filteredProducts.length} of ${products.length} products`}
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm text-sm"
        >
          Search
        </button>
        {/* Mobile Filter Toggle */}
        <button
          type="button"
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm text-sm font-semibold"
        >
          <FaFilter /> Filters
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar: Desktop */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterPanel />
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-black text-gray-900 text-lg">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              <FilterPanel />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Main Products Area */}
        <div className="lg:col-span-3">
          {loading && <LoadingSpinner />}

          {error && !loading && (
            <div className="text-center py-16 bg-white rounded-2xl border p-8 shadow-sm">
              <p className="text-4xl mb-4">😕</p>
              <p className="text-red-600 font-bold mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border p-8 shadow-sm">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-bold text-gray-700 text-lg mb-2">No products found</p>
              <p className="text-sm text-gray-500 mb-6">
                {activeSearch
                  ? `We couldn't find anything matching "${activeSearch}".`
                  : 'Try adjusting your filters.'}
              </p>
              <button
                onClick={clearSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm"
              >
                Clear Search
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}