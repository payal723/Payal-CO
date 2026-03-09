import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { orderAPI } from '../api/index.js';
import { Badge, Button, PageSpinner, Card, Alert } from '../components/ui/index.jsx';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      const { data } = await orderAPI.getById(id);
      setOrder(data.order);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await orderAPI.cancel(id, 'Cancelled by customer');
      fetchOrder();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';
  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="font-display text-xl font-bold text-green-800">Order Placed Successfully!</h2>
          <p className="text-green-600 text-sm mt-1">Your order has been confirmed. We'll notify you as it progresses.</p>
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500 text-sm mt-1">#{order._id.slice(-12).toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge label={order.orderStatus} />
          <Badge label={order.paymentStatus} />
        </div>
      </div>

      {error && <Alert message={error} className="mb-4" />}

      {/* Status Timeline */}
      {!isCancelled && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-5 h-1 bg-gray-100 z-0">
              <div
                className="h-full bg-purple-600 transition-all duration-500"
                style={{ width: currentStep === -1 ? '0%' : `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
            </div>
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center z-10 gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${i <= currentStep ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i <= currentStep ? 'text-purple-700' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <Card className="p-5">
          <h3 className="font-display font-bold text-gray-900 mb-4">Items ({order.items.length})</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item._id} className="flex gap-3">
                <img
                  src={item.image || `https://picsum.photos/seed/${item.product}/80/80`}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">₹{item.price.toLocaleString()} × {item.quantity}</p>
                </div>
                <p className="font-semibold text-sm text-gray-900 whitespace-nowrap">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Shipping & Payment */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-bold text-gray-900 mb-3">Shipping Address</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}<br />
              📞 {order.shippingAddress.phone}
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-bold text-gray-900 mb-3">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.itemsTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>₹{order.tax.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>₹{order.grandTotal.toLocaleString()}</span></div>
            </div>
            <div className="mt-3 text-xs text-purple-700 bg-purple-50 rounded-lg px-3 py-2 font-medium">
              💰 Payment: {order.paymentMethod} · Status: {order.paymentStatus}
            </div>
          </Card>
        </div>
      </div>

      {/* Cancel */}
      {canCancel && (
        <div className="mt-6 text-right">
          <Button variant="danger" loading={cancelling} onClick={handleCancel}>
            Cancel Order
          </Button>
        </div>
      )}
    </div>
  );
}
