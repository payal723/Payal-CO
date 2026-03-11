import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/index.js';
import { Badge, PageSpinner, Card } from '../../components/ui/index.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

const StatCard = ({ title, value, icon, color }) => (
  <Card className="p-4 sm:p-5">
    <div className="flex items-start justify-between">
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{title}</p>
        <p className={`text-2xl sm:text-3xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
      <span className="text-2xl sm:text-3xl ml-2 flex-shrink-0">{icon}</span>
    </div>
  </Card>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(({ data }) => {
      setStats(data.stats);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><PageSpinner /></AdminLayout>;
  if (!stats) return <AdminLayout><div className="p-8 text-center text-gray-500">Failed to load stats. Please refresh.</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-8">
        Dashboard Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard title="Total Orders" value={stats?.totalOrders ?? 0} icon="📦" color="text-purple-700" />
        <StatCard title="Revenue" value={`₹${(stats?.totalRevenue ?? 0).toLocaleString()}`} icon="💰" color="text-green-700" />
        <StatCard title="Products" value={stats?.totalProducts ?? 0} icon="🛍️" color="text-blue-700" />
        <StatCard title="Customers" value={stats?.totalUsers ?? 0} icon="👥" color="text-orange-700" />
      </div>

      {/* Order Status + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-6">
        <Card className="p-4 sm:p-5">
          <h2 className="font-display text-base sm:text-lg font-bold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-2.5">
            {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
              <div key={status} className="flex items-center justify-between py-1">
                <Badge label={status} />
                <span className="font-bold text-gray-900 text-sm">
                  {stats?.ordersByStatus?.[status] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base sm:text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs sm:text-sm text-purple-700 font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-1">
            {(stats?.recentOrders ?? []).map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="flex items-center justify-between hover:bg-gray-50 rounded-lg px-2 py-2.5 transition-colors"
              >
                <div className="min-w-0 mr-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{order.user?.name}</p>
                  <p className="text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <Badge label={order.orderStatus} />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Link to="/admin/products">
          <Card className="p-4 sm:p-5 hover:border-purple-200 transition-colors cursor-pointer flex items-center gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl">🛍️</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Manage Products</p>
              <p className="text-xs sm:text-sm text-gray-500">Add, edit, or remove products</p>
            </div>
          </Card>
        </Link>
        <Link to="/admin/orders">
          <Card className="p-4 sm:p-5 hover:border-purple-200 transition-colors cursor-pointer flex items-center gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl">📋</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Manage Orders</p>
              <p className="text-xs sm:text-sm text-gray-500">Update order status and track deliveries</p>
            </div>
          </Card>
        </Link>
      </div>
    </AdminLayout>
  );
}