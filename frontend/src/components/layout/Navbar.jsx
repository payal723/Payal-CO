import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    setMobileNavOpen(false);
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const close = () => { setMenuOpen(false); setMobileNavOpen(false); };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="font-display text-xl sm:text-2xl font-bold text-purple-700 tracking-tight flex-shrink-0">
            Payal<span className="text-gray-900">&amp;Co</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className={`text-sm font-medium transition-colors ${isActive('/products') ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>
              Products
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className={`text-sm font-medium transition-colors ${isActive('/orders') ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>
                My Orders
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className={`text-sm font-medium transition-colors ${location.pathname.startsWith('/admin') ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'}`}>
                Admin
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Cart Icon */}
            <Link to={isAuthenticated ? '/cart' : '/login'} className="relative p-2 text-gray-600 hover:text-purple-700 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Desktop Auth */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse hidden md:block" />
            ) : isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden lg:block max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium capitalize">{user?.role}</span>
                      </div>
                      <Link to="/profile" onClick={close} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                        👤 My Profile
                      </Link>
                      <Link to="/orders" onClick={close} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                        📦 My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={close} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                          ⚙️ Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          🚪 Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors px-2">Sign In</Link>
                <Link to="/register" className="text-sm font-medium bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-purple-700 transition-colors"
            >
              {mobileNavOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50 md:hidden">
            <div className="px-4 py-3 space-y-1">
              {isAuthenticated && (
                <div className="flex items-center gap-3 px-2 py-3 border-b border-gray-100 mb-2">
                  <div className="w-9 h-9 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              )}
              <Link to="/products" onClick={close} className="flex items-center gap-2 px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-purple-700 rounded-lg hover:bg-purple-50">
                🛍️ Products
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/profile" onClick={close} className="flex items-center gap-2 px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-purple-700 rounded-lg hover:bg-purple-50">
                    👤 My Profile
                  </Link>
                  <Link to="/orders" onClick={close} className="flex items-center gap-2 px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-purple-700 rounded-lg hover:bg-purple-50">
                    📦 My Orders
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={close} className="flex items-center gap-2 px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-purple-700 rounded-lg hover:bg-purple-50">
                  ⚙️ Admin Panel
                </Link>
              )}
              <div className="border-t border-gray-100 pt-2 mt-2">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-2 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                    🚪 Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" onClick={close} className="px-2 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={close} className="px-2 py-2.5 text-sm font-medium bg-purple-700 text-white rounded-lg text-center">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}