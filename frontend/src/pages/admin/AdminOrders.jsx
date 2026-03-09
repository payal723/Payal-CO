import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../api/index.js';
import { Button, Badge, Card, Spinner, Select, Alert } from '../../components/ui/index.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

const STATUS_TRANSITIONS = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.getAll({ page, limit: 15, status: statusFilter });
      setOrders(data.orders);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating((prev) => ({ ...prev, [orderId]: true }));
    setError('');
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setSuccess(`Order updated to ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900">Orders</h1>
        <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="min-w-[160px]">
          <option value="all">All Status</option>
          {['Pending','Confirmed','Shipped','Delivered','Cancelled'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      {success && <Alert type="success" message={success} />}
      {error && <Alert message={error} />}

      {loading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : (
        <Card className="overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Order ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-500">No orders found</td></tr>
                ) : orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/orders/${order._id}`} className="font-mono text-xs text-purple-700 hover:underline">
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{order.user?.name}</p>
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{order.grandTotal.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <Badge label={order.orderStatus} />
                        <Badge label={order.paymentStatus} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {updating[order._id] ? (
                        <Spinner size="sm" />
                      ) : (
                        <div className="flex justify-end gap-1 flex-wrap">
                          {STATUS_TRANSITIONS[order.orderStatus]?.map((next) => (
                            <Button
                              key={next}
                              size="sm"
                              variant={next === 'Cancelled' ? 'danger' : 'primary'}
                              onClick={() => handleStatusUpdate(order._id, next)}
                            >
                              → {next}
                            </Button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40">Prev</button>
              <span className="px-3 py-1.5 text-sm text-gray-600">{page} / {pagination.totalPages} ({pagination.total} orders)</span>
              <button onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.totalPages} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40">Next</button>
            </div>
          )}
        </Card>
      )}
    </AdminLayout>
  );
}
