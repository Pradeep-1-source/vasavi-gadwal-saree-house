import React from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Truck, ShieldCheck, ArrowLeft, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryCharge,
    totalAmount,
    totalItemsCount,
    settings,
  } = useCart();

  const threshold = settings.free_delivery_threshold || 15000;
  const differenceForFreeDelivery = Math.max(0, threshold - subtotal);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 text-center shadow-sm space-y-4">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#8E6B2C]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-stone-900">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
            Discover timeless Gadwal Silk and pure handloom sarees handcrafted for life’s grandest moments.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full py-3.5 bg-[#58101E] hover:bg-[#801A2D] text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md"
            >
              Explore Saree Collections
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#420B16]">
              Shopping Bag
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              You have {totalItemsCount} handcrafted saree(s) selected
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#8E6B2C] hover:text-[#58101E]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Free delivery threshold progress banner */}
        {settings.free_delivery_threshold && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs text-[#6C5020] flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#8E6B2C] shrink-0" />
            <div className="flex-1">
              {deliveryCharge === 0 ? (
                <span className="font-semibold text-emerald-800">
                  🎉 Congratulations! Your order qualifies for <strong>Free Express Delivery</strong> across India.
                </span>
              ) : (
                <span>
                  Add sarees worth <strong>₹{differenceForFreeDelivery.toLocaleString('en-IN')}</strong> more to unlock <strong>Free Express Delivery</strong>! (Otherwise flat ₹100 applies).
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart items list */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="divide-y divide-stone-100">
              {cart.map((item) => (
                <div key={item.id} className="py-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <img
                    src={item.product.images[0]?.image_url}
                    alt={item.product.name}
                    className="w-24 h-28 object-cover rounded-xl border border-stone-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-serif font-bold text-base text-stone-900 line-clamp-1">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono">
                      SKU: {item.product.sku}
                    </p>
                    <p className="text-xs text-[#8E6B2C]">
                      {item.product.fabric}
                    </p>
                    <div className="font-serif font-bold text-base text-[#420B16] sm:hidden pt-1">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-2 hover:bg-stone-200 transition-colors text-stone-700"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3.5 text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock_quantity}
                        className="p-2 hover:bg-stone-200 transition-colors text-stone-700"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="hidden sm:block text-right min-w-[100px]">
                      <div className="font-serif font-bold text-lg text-[#420B16]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        ₹{item.product.price.toLocaleString('en-IN')} each
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 transition-colors"
                      title="Remove saree"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200">
              <button
                onClick={clearCart}
                className="text-xs text-stone-500 hover:text-red-600 font-semibold transition-colors"
              >
                Clear Entire Bag
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className="sm:hidden text-xs text-[#58101E] font-semibold"
              >
                + Add More Sarees
              </button>
            </div>
          </div>

          {/* Cart summary box */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6 sticky top-24">
            <h3 className="font-serif font-bold text-xl text-stone-900 pb-3 border-b border-stone-200">
              Payment Summary
            </h3>

            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#8E6B2C]" />
                  Delivery Charge (All-India)
                </span>
                <span className={deliveryCharge === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-stone-900'}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline">
                <div>
                  <span className="font-serif font-bold text-base text-stone-900">
                    Grand Total
                  </span>
                  <p className="text-[11px] text-stone-400">Includes all GST taxes</p>
                </div>
                <span className="font-serif font-bold text-2xl text-[#420B16]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-4 rounded-xl bg-[#58101E] hover:bg-[#801A2D] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-center gap-2 text-[11px] text-emerald-800">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Direct WhatsApp Order • Genuine Handloom Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
