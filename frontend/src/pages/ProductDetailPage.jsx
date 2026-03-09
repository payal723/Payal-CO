import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../api/index.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Badge, PageSpinner, Alert } from '../components/ui/index.jsx';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data.product);
      } catch {
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate('/login');
    setAdding(true);
    setError('');
    try {
      await addToCart(product._id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : [{ url: `https://picsum.photos/seed/${product._id}/600/500`, alt: product.name }];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
            <img src={images[activeImage]?.url} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-purple-600' : 'border-gray-200'}`}>
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-sm font-medium text-purple-700 capitalize bg-purple-50 px-3 py-1 rounded-full">
            {product.category}
          </span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-4 mb-3">{product.name}</h1>

          {/* Rating */}
          {product.ratings?.count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.ratings.average) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.ratings.average} ({product.ratings.count} reviews)</span>
            </div>
          )}

          <p className="text-4xl font-bold text-gray-900 mb-6">₹{product.price.toLocaleString()}</p>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-700">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg">−</button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg">+</button>
              </div>
            </div>
          )}

          {error && <Alert message={error} className="mb-4" />}

          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={handleAddToCart}
              loading={adding}
              disabled={product.stock === 0}
              variant={added ? 'secondary' : 'primary'}
              className="flex-1"
            >
              {added ? '✓ Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button size="lg" variant="outline" onClick={() => { handleAddToCart(); navigate('/cart'); }}>
              Buy Now
            </Button>
          </div>

          {/* COD badge */}
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-semibold text-gray-800">Cash on Delivery Available</p>
              <p className="text-xs text-gray-500">Pay when you receive your order</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
