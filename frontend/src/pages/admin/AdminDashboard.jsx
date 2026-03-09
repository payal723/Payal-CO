import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/index.js';
import { Badge, PageSpinner, Card } from '../../components/ui/index.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

const StatCard = ({ title, value, icon, color }) => (
  <Card className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
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

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" color="text-purple-700" />
        <StatCard title="Revenue (Delivered)" value={`₹${stats.totalRevenue.toLocaleString()}`} icon="💰" color="text-green-700" />
        <StatCard title="Products" value={stats.totalProducts} icon="🛍️" color="text-blue-700" />
        <StatCard title="Customers" value={stats.totalUsers} icon="👥" color="text-orange-700" />
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
              <div key={status} className="flex items-center justify-between">
                <Badge label={status} />
                <span className="font-bold text-gray-900">{stats.ordersByStatus[status] || 0}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-purple-700 font-medium hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <Link key={order._id} to={`/orders/${order._id}`} className="flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.user?.name}</p>
                  <p className="text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <Badge label={order.orderStatus} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/products">
          <Card className="p-5 hover:border-purple-200 transition-colors cursor-pointer flex items-center gap-4">
            <span className="text-3xl">🛍️</span>
            <div>
              <p className="font-semibold text-gray-900">Manage Products</p>
              <p className="text-sm text-gray-500">Add, edit, or remove products</p>
            </div>
          </Card>
        </Link>
        <Link to="/admin/orders">
          <Card className="p-5 hover:border-purple-200 transition-colors cursor-pointer flex items-center gap-4">
            <span className="text-3xl">📋</span>
            <div>
              <p className="font-semibold text-gray-900">Manage Orders</p>
              <p className="text-sm text-gray-500">Update order status and track deliveries</p>
            </div>
          </Card>
        </Link>
      </div>
    </AdminLayout>
  );
}
