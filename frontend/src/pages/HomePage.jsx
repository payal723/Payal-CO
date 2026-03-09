import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productAPI } from '../api/index.js';
import ProductCard from '../components/common/ProductCard.jsx';
import { PageSpinner } from '../components/ui/index.jsx';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ limit: 8, sort: 'rating' }),
      productAPI.getCategories(),
    ]).then(([productsRes, catsRes]) => {
      setFeatured(productsRes.data.products);
      setCategories(catsRes.data.categories.slice(0, 8));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
          <span className="bg-white/10 text-purple-200 text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full mb-5 sm:mb-6">
            🎉 Free shipping on orders above ₹500
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4 sm:mb-6">
           Where Style Meets <br />Trust
          </h1>
          <p className="text-purple-200 text-base sm:text-lg max-w-xl mb-8 sm:mb-10 px-4">
            Discover thousands of products with Cash on Delivery. No card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link to="/products" className="bg-white text-purple-900 font-bold px-8 py-3 rounded-xl hover:bg-purple-50 transition-colors text-center">
              Shop Now
            </Link>
            <Link to="/products" className="border border-white/30 text-white font-medium px-8 py-3 rounded-xl hover:bg-white/10 transition-colors text-center">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹500' },
            { icon: '💳', title: 'Cash on Delivery', desc: 'Pay when you receive' },
            { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
            { icon: '🔒', title: 'Secure', desc: 'Your data is safe' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 text-xs sm:text-sm">{f.title}</p>
                <p className="text-gray-500 text-xs hidden sm:block">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-5 sm:mb-8">Shop by Category</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="bg-purple-50 text-purple-700 font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full capitalize hover:bg-purple-100 transition-colors text-xs sm:text-sm"
              >
                {cat}
              </Link>
            ))}
            <Link to="/products" className="bg-gray-100 text-gray-600 font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-gray-200 transition-colors text-xs sm:text-sm">
              View All →
            </Link>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16 sm:pb-20">
        <div className="flex items-center justify-between mb-5 sm:mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">Top Rated Products</h2>
          <Link to="/products" className="text-purple-700 font-semibold text-sm hover:underline whitespace-nowrap">
            View All →
          </Link>
        </div>
        {loading ? <PageSpinner /> : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}