import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { orderAPI } from '../api/index.js';
import { Button, Input, Card, Alert } from '../components/ui/index.jsx';

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
    phone: user?.phone || '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setFormErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.street.trim()) errs.street = 'Required';
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.state.trim()) errs.state = 'Required';
    if (!form.zipCode.trim()) errs.zipCode = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await orderAPI.place({ shippingAddress: form });
      navigate(`/orders/${data.order._id}?success=true`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items?.length) { navigate('/cart'); return null; }

  const shipping = cart.totalPrice >= 500 ? 0 : 50;
  const tax = Math.round(cart.totalPrice * 0.18 * 100) / 100;
  const total = cart.totalPrice + shipping + tax;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-5">
          <Card className="p-4 sm:p-6">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div className="space-y-3 sm:space-y-4">
              <Input label="Street Address" name="street" value={form.street} onChange={handleChange} placeholder="123 Main Street, Apt 4" error={formErrors.street} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="City" name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" error={formErrors.city} />
                <Input label="State" name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" error={formErrors.state} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="ZIP Code" name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="400001" error={formErrors.zipCode} />
                <Input label="Country" name="country" value={form.country} onChange={handleChange} />
              </div>
              <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" error={formErrors.phone} type="tel" />
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-3">Payment Method</h2>
            <div className="flex items-center gap-3 sm:gap-4 bg-purple-50 border-2 border-purple-200 rounded-xl p-3 sm:p-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center text-lg sm:text-xl flex-shrink-0">💰</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-purple-900 text-sm sm:text-base">Cash on Delivery (COD)</p>
                <p className="text-xs sm:text-sm text-purple-600">Pay in cash when your order arrives</p>
              </div>
              <div className="w-4 h-4 rounded-full bg-purple-600 border-4 border-white ring-2 ring-purple-600 flex-shrink-0" />
            </div>
          </Card>
        </div>

        {/* Summary */}
        <Card className="lg:col-span-2 p-4 sm:p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto mb-4 pr-1">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm gap-2">
                <span className="text-gray-600 truncate flex-1">{item.product?.name} × {item.quantity}</span>
                <span className="font-medium text-gray-900 whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{cart.totalPrice.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="flex justify-between text-gray-600"><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
              <span>Grand Total</span><span>₹{total.toLocaleString()}</span>
            </div>
          </div>
          {error && <Alert message={error} className="mt-4" />}
          <Button size="lg" className="w-full mt-4" loading={loading} onClick={handleSubmit}>
            🎯 Place Order (COD)
          </Button>
          <p className="text-xs text-gray-400 text-center mt-3">By placing this order you agree to our terms</p>
        </Card>
      </div>
    </div>
  );
}