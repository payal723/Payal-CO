// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext.jsx';
// import { CartProvider } from './context/CartContext.jsx';
// import { ProtectedRoute, AdminRoute, GuestRoute } from './components/common/ProtectedRoute.jsx';

// // Layout
// import Navbar from './components/layout/Navbar.jsx';
// import Footer from './components/layout/Footer.jsx';

// // Pages
// import HomePage from './pages/HomePage.jsx';
// import ProductsPage from './pages/ProductsPage.jsx';
// import ProductDetailPage from './pages/ProductDetailPage.jsx';
// import CartPage from './pages/CartPage.jsx';
// import CheckoutPage from './pages/CheckoutPage.jsx';
// import LoginPage from './pages/LoginPage.jsx';
// import RegisterPage from './pages/RegisterPage.jsx';
// import OrdersPage from './pages/OrdersPage.jsx';
// import OrderDetailPage from './pages/OrderDetailPage.jsx';

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard.jsx';
// import AdminProducts from './pages/admin/AdminProducts.jsx';
// import AdminOrders from './pages/admin/AdminOrders.jsx';

// function AppShell() {
//   return (
//     <CartProvider>
//       <div className="min-h-screen flex flex-col">
//         <Navbar />
//         <main className="flex-1">
//           <Routes>
//             {/* Public */}
//             <Route path="/" element={<HomePage />} />
//             <Route path="/products" element={<ProductsPage />} />
//             <Route path="/products/:id" element={<ProductDetailPage />} />

//             {/* Auth */}
//             <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
//             <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

//             {/* Protected */}
//             <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
//             <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
//             <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
//             <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

//             {/* Admin */}
//             <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
//             <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
//             <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </CartProvider>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <AppShell />
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/common/ProtectedRoute.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';

function AppShell() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </Router>
  );
}

export default App;