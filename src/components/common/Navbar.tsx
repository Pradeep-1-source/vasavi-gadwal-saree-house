import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  ShieldAlert, 
  Package, 
  MapPin, 
  Sparkles,
  Phone
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { api } from '../../services/api';
import { Product } from '../../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, signOut, isAdmin, switchDemoRole } = useAuth();
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Live search handler
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        const results = await api.getProducts({ search: searchQuery });
        setSearchResults(results.slice(0, 5));
        setIsSearching(false);
        setShowSearchDropdown(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      onNavigate('shop', { search: searchQuery });
    }
  };

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Gadwal Silk', page: 'shop', category: 'gadwal-silk-sarees' },
    { label: 'Traditional Silk', page: 'shop', category: 'traditional-silk-sarees' },
    { label: 'Wedding Sarees', page: 'shop', category: 'wedding-sarees' },
    { label: 'Festive Sarees', page: 'shop', category: 'festive-sarees' },
    { label: 'Cotton Sarees', page: 'shop', category: 'cotton-sarees' },
    { label: 'All Sarees', page: 'shop' },
    { label: 'Our Heritage', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-stone-700 hover:text-[#58101E] hover:bg-stone-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="cursor-pointer transition-transform hover:opacity-95"
        >
          <BrandLogo size="md" />
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
              placeholder="Search pure Gadwal silk, Kuttu borders, wedding zari..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F9F6F0] border border-stone-200 rounded-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-[#8E6B2C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {isSearching && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
            )}
          </form>

          {/* Autocomplete Results Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 animate-in fade-in duration-200">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
                  <div className="px-4 py-2 text-[11px] font-semibold tracking-wider uppercase text-[#8E6B2C] bg-amber-50/50">
                    Saree Suggestions ({searchResults.length})
                  </div>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                        onNavigate('product', { slug: product.slug });
                      }}
                      className="p-3 flex items-center gap-3 hover:bg-stone-50 cursor-pointer transition-colors"
                    >
                      <img
                        src={product.images[0]?.image_url}
                        alt={product.name}
                        className="w-12 h-14 object-cover rounded-md border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif font-bold text-xs text-stone-900 truncate">
                          {product.name}
                        </h5>
                        <p className="text-[11px] text-stone-500 font-mono">
                          {product.fabric}
                        </p>
                        <div className="text-xs font-semibold text-[#58101E] mt-0.5">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={handleSearchSubmit}
                    className="p-2.5 text-center text-xs font-medium text-[#6B1425] hover:bg-stone-100 cursor-pointer transition-colors"
                  >
                    View all matching results for "{searchQuery}" →
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-stone-500">
                  No sarees matched your search term.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Icons: Wishlist, Cart, Account */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Wishlist */}
          <button
            onClick={() => onNavigate('account', { tab: 'wishlist' })}
            className="relative p-2 text-stone-700 hover:text-[#6B1425] hover:bg-stone-100 rounded-full transition-colors"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#801A2D] text-[#F7F1DC] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative p-2 text-stone-700 hover:text-[#6B1425] hover:bg-stone-100 rounded-full transition-colors"
            title="Shopping Bag"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C5A059] text-[#241E1C] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Customer / Admin Account Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
              aria-label="Account menu"
            >
              <div className="w-8 h-8 rounded-full bg-[#58101E] text-amber-200 flex items-center justify-center text-xs font-semibold shadow-xs">
                {user ? user.full_name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-amber-100" />}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:inline" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in duration-200">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/50">
                      <p className="font-serif font-bold text-sm text-stone-900 truncate">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                          isAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {isAdmin ? 'Store Admin' : 'Customer'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-[#58101E] hover:bg-amber-50 font-semibold flex items-center gap-2"
                        >
                          <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
                          <span>Admin Control Panel</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('account', { tab: 'profile' });
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        <span>My Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('account', { tab: 'orders' });
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-stone-400" />
                        <span>Order History & Tracking</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('account', { tab: 'addresses' });
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-stone-400" />
                        <span>Saved Addresses</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('account', { tab: 'wishlist' });
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4 text-stone-400" />
                        <span>My Wishlist ({wishlistCount})</span>
                      </button>
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-stone-100 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-3 space-y-2">
                    <p className="text-xs text-stone-600 px-1 mb-1">
                      Welcome to Vasavi Gadwal Saree House. Sign in to view orders and express checkout.
                    </p>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('account', { tab: 'login' });
                      }}
                      className="w-full bg-[#6B1425] hover:bg-[#801A2D] text-white text-xs font-semibold py-2 rounded-xl transition-colors"
                    >
                      Sign In / Register
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation Bar */}
      <nav className="hidden lg:block border-t border-stone-100 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center space-x-8 py-2.5 text-xs font-medium tracking-wide uppercase">
            {navLinks.map((link, idx) => {
              const isActive = currentPage === link.page;
              return (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate(link.page, link.category ? { category: link.category } : undefined)}
                    className={`transition-colors py-1 relative ${
                      isActive 
                        ? 'text-[#6B1425] font-bold' 
                        : 'text-stone-700 hover:text-[#6B1425]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059] rounded-full" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="w-4/5 max-w-sm h-full bg-[#FFFDF9] shadow-2xl p-5 overflow-y-auto flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <BrandLogo size="sm" />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full text-stone-500 hover:bg-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mt-4 mb-6">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sarees..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-100 rounded-lg text-xs"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </form>
              </div>

              {/* Links */}
              <nav className="space-y-1 text-sm font-medium">
                {navLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate(link.page, link.category ? { category: link.category } : undefined);
                    }}
                    className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-amber-50 hover:text-[#6B1425] text-stone-800 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile Footer with WhatsApp link */}
            <div className="pt-6 border-t border-stone-200 space-y-3">
              <a
                href="https://wa.me/917660833168"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <span>WhatsApp Helpline: 7660833168</span>
              </a>
              <div className="text-[11px] text-center text-stone-400">
                Flat ₹100 Express Delivery Across India
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
