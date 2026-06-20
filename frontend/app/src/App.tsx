import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider } from '@/context/AppContext';
import GradientCanvas from '@/components/GradientCanvas';
import Navigation from '@/components/Navigation';
import Footer from '@/sections/Footer';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import WishlistPage from '@/pages/WishlistPage';
import AccountPage from '@/pages/AccountPage';

function App() {
  return (
    <HashRouter>
      <AppProvider>
        {/* Background gradient - only on home */}
        <Routes>
          <Route path="/" element={<GradientCanvas />} />
        </Routes>
        
        <div className="min-h-[100dvh] bg-[#0a0a0f]">
          <Navigation />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
          
          <Footer />
        </div>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#12121a',
              border: '1px solid #2a2a3a',
              color: '#f8f9fa',
            },
          }}
        />
      </AppProvider>
    </HashRouter>
  );
}

export default App;
