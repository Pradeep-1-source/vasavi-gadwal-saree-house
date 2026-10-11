import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { CartDrawer } from './components/common/CartDrawer';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentResultPage } from './pages/PaymentResultPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { CancellationRefundPage } from './pages/CancellationRefundPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';

interface NavigationState {
  page: string;
  params?: Record<string, any>;
}

export function App() {
  const [navState, setNavState] = useState<NavigationState>(() => {
    // Check initial hash or default to home
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const [p, q] = hash.split('?');
      const params: Record<string, string> = {};
      if (q) {
        new URLSearchParams(q).forEach((v, k) => {
          params[k] = v;
        });
      }
      return { page: p || 'home', params };
    }
    return { page: 'home' };
  });

  const handleNavigate = (page: string, params?: Record<string, any>) => {
    setNavState({ page, params });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash for SPA shareability & back button support
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    window.history.pushState(null, '', `#${page}${qs}`);
  };

  // Sync popstate for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const [p, q] = hash.split('?');
        const params: Record<string, string> = {};
        if (q) {
          new URLSearchParams(q).forEach((v, k) => {
            params[k] = v;
          });
        }
        setNavState({ page: p || 'home', params });
      } else {
        setNavState({ page: 'home' });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO Page Titles
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'Vasavi Gadwal Saree House | Authentic Handwoven Gadwal Silk Sarees',
      shop: 'Saree Catalogue | Vasavi Gadwal Saree House',
      product: 'Handwoven Gadwal Saree | Vasavi Gadwal Saree House',
      cart: 'Shopping Bag | Vasavi Gadwal Saree House',
      checkout: 'Secure Checkout | Vasavi Gadwal Saree House',
      'payment-result': 'Order Confirmation | Vasavi Gadwal Saree House',
      account: 'Customer Account | Vasavi Gadwal Saree House',
      admin: 'Store Admin Dashboard | Vasavi Gadwal Saree House',
      'track-order': 'Track Your Saree Order | Vasavi Gadwal Saree House',
      about: 'Our Heritage & Weavers | Vasavi Gadwal Saree House',
      contact: 'Customer Care (+91 7660833168) | Vasavi Gadwal Saree House',
      'shipping-policy': 'Shipping & Delivery Policy | Vasavi Gadwal Saree House',
      'refund-policy': 'Cancellation & Refund Policy | Vasavi Gadwal Saree House',
      terms: 'Terms and Conditions | Vasavi Gadwal Saree House',
      privacy: 'Privacy Policy | Vasavi Gadwal Saree House',
    };

    document.title = titles[navState.page] || 'Vasavi Gadwal Saree House';
  }, [navState.page]);

  const renderCurrentPage = () => {
    const { page, params = {} } = navState;

    switch (page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'shop':
        return (
          <ShopPage
            initialCategory={params.category}
            initialSearch={params.search}
            onNavigate={handleNavigate}
          />
        );
      case 'product':
        return (
          <ProductDetailPage
            slug={params.slug || 'royal-crimson-gold-pure-gadwal-silk-saree'}
            onNavigate={handleNavigate}
          />
        );
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'payment-result':
        return (
          <PaymentResultPage
            orderId={params.orderId}
            onNavigate={handleNavigate}
          />
        );
      case 'account':
        return (
          <AccountPage
            initialTab={params.tab || 'profile'}
            returnTo={params.returnTo}
            onNavigate={handleNavigate}
          />
        );
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'track-order':
        return <OrderTrackingPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      case 'shipping-policy':
        return <ShippingPolicyPage />;
      case 'refund-policy':
        return <CancellationRefundPage />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      default:
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#241E1C]">
            {/* Announcement bar at top */}
            <AnnouncementBar />

            {/* Navigation Header */}
            <Navbar currentPage={navState.page} onNavigate={handleNavigate} />

            {/* Slide-over Cart Drawer */}
            <CartDrawer onNavigate={handleNavigate} />

            {/* Active Page Content */}
            <main className="flex-1">{renderCurrentPage()}</main>

            {/* Luxury Footer */}
            <Footer onNavigate={handleNavigate} />

            {/* Floating WhatsApp Support Button */}
            <WhatsAppButton />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
