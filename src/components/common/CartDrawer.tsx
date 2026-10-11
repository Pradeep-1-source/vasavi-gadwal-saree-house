import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onNavigate: (page: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryCharge,
    totalAmount,
    totalItemsCount,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#D4AF37]/30 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 bg-[#58101E] text-white flex items-center justify-between border-b border-[#8E6B2C]/50">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif font-bold text-xl text-[#F7F1DC]">
                Shopping Bag ({totalItemsCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 rounded-full text-amber-200/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Note */}
          <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200/60 flex items-center gap-2 text-xs text-[#6C5020]">
            <Truck className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>
              {deliveryCharge === 0 ? (
                <strong className="text-emerald-700">Congratulations! You unlocked Free Express Delivery!</strong>
              ) : (
                <>Flat <strong>₹100 Express Delivery</strong> across India applies to this order.</>
              )}
            </span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-stone-800 mb-1">Your bag is empty</h4>
                <p className="text-xs text-stone-500 mb-6 max-w-xs">
                  Discover timeless Gadwal Silk and pure handloom sarees handcrafted for life’s grandest moments.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('shop');
                  }}
                  className="bg-[#6B1425] hover:bg-[#801A2D] text-white text-xs font-semibold py-3 px-6 rounded-xl shadow-md transition-all"
                >
                  Explore Sarees
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]?.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-lg border border-stone-200 shadow-sm shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif font-bold text-sm text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                        SKU: {item.product.sku}
                      </p>
                      <p className="text-[11px] text-[#8E6B2C] mt-0.5">
                        {item.product.fabric}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1.5 hover:bg-stone-200 transition-colors text-stone-700"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1.5 hover:bg-stone-200 transition-colors text-stone-700"
                          disabled={item.quantity >= item.product.stock_quantity}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-semibold text-sm text-[#58101E]">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-stone-400">
                            ₹{item.product.price.toLocaleString('en-IN')} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 bg-stone-50 border-t border-stone-200 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    Standard Delivery Fee
                    <span className="text-[10px] text-stone-400">(Express Tracked)</span>
                  </span>
                  <span className={deliveryCharge === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-stone-800'}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-[#420B16]">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 py-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Authentic Handlooms • Direct PhonePe UPI Accepted</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('cart');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-200/60 text-xs font-semibold text-stone-800 text-center transition-colors"
                >
                  View Cart
                </button>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('checkout');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#6B1425] hover:bg-[#801A2D] text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
