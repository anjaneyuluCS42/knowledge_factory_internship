import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import orderService from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FaBoxOpen, FaShoppingBag, FaClipboardList,
  FaCheckCircle, FaHourglassHalf, FaTimesCircle,
} from 'react-icons/fa';

const STATUS_CONFIGS = {
  delivered: { label: 'Delivered', icon: <FaCheckCircle />, color: 'text-green-600 bg-green-50 border-green-200' },
  processing: { label: 'Processing', icon: <FaHourglassHalf />, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  shipped: { label: 'Shipped', icon: <FaBoxOpen />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  cancelled: { label: 'Cancelled', icon: <FaTimesCircle />, color: 'text-red-600 bg-red-50 border-red-200' },
};

// Deterministically assign a status and a date to each order based on its ID
function getDerivedOrderMeta(order) {
  const statuses = ['delivered', 'processing', 'shipped', 'delivered', 'delivered'];
  const statusKey = statuses[order.id % statuses.length];

  // Derive a date: go back N days from today based on order ID
  const daysAgo = (order.id * 7) % 90 + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  return {
    statusKey,
    statusConfig: STATUS_CONFIGS[statusKey],
    date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
}

export default function Orders() {
  const { isLoggedIn } = useAuth();
  const { data: orders = [], loading, error } = useFetch(
    orderService.getOrders,
    [isLoggedIn]
  );

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <FaShoppingBag className="text-5xl text-blue-200 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-800 mb-2">Please Log In</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to view your order history.</p>
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

  if (loading) return <div className="py-24"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaClipboardList className="text-blue-600 text-2xl" />
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500">Track and manage all your purchases</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
            <p className="text-7xl mb-5">📦</p>
            <h2 className="text-2xl font-black text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 text-sm mb-8">
              You haven't placed any orders. Start shopping to fill your order history!
            </p>
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-black shadow-md inline-flex items-center gap-2"
            >
              <FaShoppingBag /> Start Shopping
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const { statusKey, statusConfig, date } = getDerivedOrderMeta(order);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xxs font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                          <p className="text-base font-black text-gray-900">#{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xxs font-bold text-gray-400 uppercase tracking-wider">Ordered On</p>
                          <p className="text-sm font-bold text-gray-700">{date}</p>
                        </div>
                        <div>
                          <p className="text-xxs font-bold text-gray-400 uppercase tracking-wider">Total</p>
                          <p className="text-lg font-black text-gray-900">
                            ₹{order.total_price?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border ${statusConfig.color}`}
                      >
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Progress Bar */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-0">
                      {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                        const progressMap = { delivered: 4, shipped: 3, processing: 2, cancelled: 1 };
                        const progress = progressMap[statusKey] || 1;
                        const isActive = i < progress;
                        const isCurrent = i === progress - 1;
                        return (
                          <div key={step} className="flex-1 flex flex-col items-center relative">
                            {/* Connector line */}
                            {i > 0 && (
                              <div
                                className={`absolute top-3 -left-1/2 w-full h-0.5 ${
                                  isActive ? 'bg-blue-500' : 'bg-gray-200'
                                }`}
                              />
                            )}
                            {/* Dot */}
                            <div
                              className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                                isCurrent
                                  ? 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1'
                                  : isActive
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              {isActive ? '✓' : i + 1}
                            </div>
                            <p
                              className={`text-xxs mt-1 font-bold text-center ${
                                isCurrent ? 'text-blue-600' : isActive ? 'text-gray-700' : 'text-gray-400'
                              }`}
                            >
                              {step}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-gray-500">
                      {statusKey === 'delivered'
                        ? '🎉 Your order was delivered successfully!'
                        : statusKey === 'shipped'
                        ? '🚚 Your order is on the way!'
                        : statusKey === 'processing'
                        ? '⏳ We are preparing your order.'
                        : '❌ This order was cancelled.'}
                    </div>
                    <div className="flex gap-3">
                      <button className="text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors">
                        Invoice
                      </button>
                      {statusKey === 'delivered' && (
                        <Link
                          to="/products"
                          className="text-xs font-bold text-blue-600 border border-blue-200 rounded-xl px-4 py-2 hover:bg-blue-50 transition-colors"
                        >
                          Buy Again
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}