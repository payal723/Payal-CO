import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useState } from 'react';
import { Button } from '../ui/index.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { window.location.href = '/login'; return; }
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const imageUrl = product.images?.[0]?.url || `https://picsum.photos/seed/${product._id}/400/300`;

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${product._id}/400/400`; }}
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className="bg-white/90 backdrop-blur text-xs font-semibold text-purple-700 px-2 py-0.5 rounded-full capitalize">
              {product.category}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <h3 className="font-display font-semibold text-gray-900 line-clamp-2 text-xs sm:text-sm leading-tight mb-1 flex-1">
            {product.name}
          </h3>

          {/* Rating */}
          {product.ratings?.count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${s <= Math.round(product.ratings.average) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.ratings.count})</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mt-auto">
            <span className="text-base sm:text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0
                ${added ? 'bg-green-100 text-green-700' : 'bg-purple-700 text-white hover:bg-purple-800'}`}
            >
              {adding ? '...' : added ? '✓' : product.stock === 0 ? 'N/A' : '+ Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}