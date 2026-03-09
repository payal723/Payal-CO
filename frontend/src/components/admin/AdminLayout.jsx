import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/products', label: 'Products', icon: '🛍️' },
  { path: '/admin/orders', label: 'Orders', icon: '📦' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex-shrink-0 hidden md:block">
        <div className="p-4 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Panel</span>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${location.pathname === item.path
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 mt-4">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <span>🏪</span> View Store
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white border-b border-gray-100 w-full">
        <div className="flex gap-1 p-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${location.pathname === item.path ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
