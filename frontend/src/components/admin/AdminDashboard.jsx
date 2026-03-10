import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/products', label: 'Products', icon: '🛍️' },
  { path: '/admin/orders', label: 'Orders', icon: '📦' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile as drawer */}
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-64px)] z-50 w-64 bg-white border-r border-gray-100 shadow-xl
        transform transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 md:shadow-none md:w-56 md:flex-shrink-0 md:block
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Panel</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-600 text-lg"
          >✕</button>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive(item.path)
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 mt-4">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span>🏪</span> View Store
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-16 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {navItems.find(n => isActive(n.path))?.label || 'Admin'}
          </span>
        </div>

        <main className="flex-1 p-3 sm:p-5 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}