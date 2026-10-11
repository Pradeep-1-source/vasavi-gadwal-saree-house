import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, SiteSettings } from '../types';
import { api } from '../services/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  totalItemsCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  settings: SiteSettings;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_CART_KEY = 'vgsh_customer_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<SiteSettings>({
    delivery_charge: 100,
    free_delivery_threshold: 15000,
    support_phone: '7660833168',
    whatsapp_number: '917660833168',
    announcement_bar: '✨ Pure Handcrafted Gadwal Weaves | Flat ₹100 Express Delivery Across India',
    is_announcement_enabled: true,
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync settings
  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock_quantity <= 0) {
      return { success: false, message: 'This exquisite saree is currently out of stock.' };
    }

    const existingIndex = cart.findIndex(item => item.product_id === product.id);

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      const targetQty = currentQty + quantity;

      if (targetQty > product.stock_quantity) {
        return { 
          success: false, 
          message: `Only ${product.stock_quantity} pieces available in loom stock for this design.` 
        };
      }

      const updated = [...cart];
      updated[existingIndex].quantity = targetQty;
      setCart(updated);
      setIsCartDrawerOpen(true);
      return { success: true };
    } else {
      if (quantity > product.stock_quantity) {
        return { 
          success: false, 
          message: `Only ${product.stock_quantity} pieces available in loom stock.` 
        };
      }

      const newItem: CartItem = {
        id: 'ci-' + Date.now() + Math.random().toString(36).substr(2, 4),
        product_id: product.id,
        product,
        quantity,
        created_at: new Date().toISOString(),
      };
      setCart(prev => [...prev, newItem]);
      setIsCartDrawerOpen(true);
      return { success: true };
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const targetItem = cart.find(item => item.product_id === productId);
    if (!targetItem) return { success: false, message: 'Item not in cart' };

    if (quantity > targetItem.product.stock_quantity) {
      return {
        success: false,
        message: `Maximum stock for this saree is ${targetItem.product.stock_quantity} units.`
      };
    }

    setCart(prev =>
      prev.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Delivery charge calculation: ₹100 fixed, waived if free delivery threshold is reached and subtotal > 0
  const isFreeDelivery = (settings.free_delivery_threshold && subtotal >= settings.free_delivery_threshold) || subtotal === 0;
  const deliveryCharge = isFreeDelivery ? 0 : (settings.delivery_charge || 100);
  
  const discountAmount = 0;
  const totalAmount = subtotal + deliveryCharge - discountAmount;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryCharge,
        discountAmount,
        totalAmount,
        totalItemsCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        settings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
