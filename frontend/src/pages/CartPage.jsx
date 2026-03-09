import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Button, Spinner, Card } from '../components/ui/index.jsx';
import { useState } from 'react';

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState({});

  const handleQty = async (productId, qty) => {
    setUpdating((p) => ({ ...p, [productId]: true }));
    try {
      if (qty < 1) await removeItem(productId);
      else await updateItem(productId, qty);
    } finally {
      setUpdating((p) => ({ ...p, [productId]: false }));
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;

  if (!cart?.items?.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🛒</div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-6 sm:mb-8">Start adding products you love!</p>
        <Link to="/products"><Button size="lg">Browse Products</Button></Link>
      </div>
    );
  }

  const shipping = cart.totalPrice >= 500 ? 0 : 50;
  const tax = Math.round(cart.totalPrice * 0.18 * 100) / 100;
  const total = cart.totalPrice + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
        Cart <span className="text-gray-400 font-normal text-lg">({cart.totalItems} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cart.items.map((item) => {
            const product = item.product;
            if (!product) return null;
            const img = product.images?.[0]?.url || `https://picsum.photos/seed/${product._id}/200/200`;
            return (
              <Card key={item._id} className="p-3 sm:p-4 flex gap-3 sm:gap-4">
                <Link to={`/products/${product._id}`} className="flex-shrink-0">
                  <img src={img} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-gray-100" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product._id}`} className="font-semibold text-gray-900 hover:text-purple-700 text-sm line-clamp-2">
                    {product.name}
                  </Link>
                  <p className="text-purple-700 font-bold mt-1 text-sm sm:text-base">₹{item.price.toLocaleString()}</p>
                  {product.stock < item.quantity && (
                    <p className="text-xs text-red-500 mt-0.5">Only {product.stock} left</p>
                  )}
                  {/* Mobile: qty + remove inline */}
                  <div className="flex items-center justify-between mt-2 sm:hidden">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => handleQty(product._id, item.quantity - 1)} disabled={updating[product._id]} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-sm">−</button>
                      <span className="w-7 text-center text-xs font-semibold">
                        {updating[product._id] ? '...' : item.quantity}
                      </span>
                      <button onClick={() => handleQty(product._id, item.quantity + 1)} disabled={updating[product._id] || item.quantity >= product.stock} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-sm">+</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                      <button onClick={() => handleQty(product._id, 0)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  </div>
                </div>
                {/* Desktop: qty on right */}
                <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => handleQty(product._id, item.quantity - 1)} disabled={updating[product._id]} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40">−</button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {updating[product._id] ? <Spinner size="sm" /> : item.quantity}
                    </span>
                    <button onClick={() => handleQty(product._id, item.quantity + 1)} disabled={updating[product._id] || item.quantity >= product.stock} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40">+</button>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                  <button onClick={() => handleQty(product._id, 0)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Summary — sticky on desktop */}
        <Card className="p-5 sm:p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-lg sm:text-xl font-bold text-gray-900 mb-5">Order Summary</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cart.totalItems} items)</span>
              <span>₹{cart.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (18%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            {shipping === 0 ? (
              <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">🎉 Free shipping unlocked!</p>
            ) : (
              <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                Add ₹{(500 - cart.totalPrice).toFixed(0)} more for free shipping
              </p>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-4 bg-purple-50 rounded-xl p-3 text-sm text-purple-700 font-medium text-center">
            💰 Cash on Delivery
          </div>
          <Button size="lg" className="w-full mt-4" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
          <Link to="/products">
            <Button variant="ghost" size="md" className="w-full mt-2 text-sm">Continue Shopping</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}