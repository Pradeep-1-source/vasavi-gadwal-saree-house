import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, MessageCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

interface OrderTrackingPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ onNavigate }) => {
  const [orderQuery, setOrderQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    const result = await api.getOrderById(orderQuery.trim());
    setOrder(result);
    setLoading(false);
  };

  const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = order ? steps.indexOf(order.order_status) : -1;

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8E6B2C]">
            Loom To Doorstep
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#420B16]">
            Track Your Saree Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Enter your Order ID (e.g. VGSH-...) received on confirmation to track real-time loom dispatch status.
          </p>
        </div>

        {/* Search Input */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Enter Order Number (e.g. VGSH-2025-...)"
                className="w-full pl-10 pr-4 py-3 bg-[#FDFBF7] border border-stone-300 rounded-xl text-xs text-stone-900 font-mono"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#58101E] hover:bg-[#801A2D] text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-colors shadow-xs"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Tracking Details */}
        {searched && (
          <div>
            {order ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
                {/* Status Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-stone-900">
                      Order #{order.order_number}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Placed: {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-semibold text-xs uppercase tracking-wide">
                      {order.order_status}
                    </span>
                    <p className="text-[11px] text-stone-400 mt-1">Payment: {order.payment_status}</p>
                  </div>
                </div>

                {/* Visual Step Timeline */}
                <div className="py-2">
                  <div className="grid grid-cols-5 gap-2 text-center text-[10px] sm:text-xs">
                    {steps.map((step, idx) => {
                      const isComplete = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div key={step} className="space-y-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-[#58101E] text-white ring-4 ring-[#C5A059]/40'
                                : isComplete
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-100 text-stone-400'
                            }`}
                          >
                            {isComplete && !isCurrent ? '✓' : idx + 1}
                          </div>
                          <p
                            className={`font-semibold ${
                              isCurrent
                                ? 'text-[#58101E]'
                                : isComplete
                                ? 'text-emerald-800'
                                : 'text-stone-400'
                            }`}
                          >
                            {step}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping Details Snapshot */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1">
                  <p className="font-bold text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#8E6B2C]" />
                    <span>Destination Address</span>
                  </p>
                  <p>{order.address_snapshot.full_name}</p>
                  <p>{order.address_snapshot.house_number}, {order.address_snapshot.street}, {order.address_snapshot.locality}</p>
                  <p>{order.address_snapshot.city}, {order.address_snapshot.state} - {order.address_snapshot.pincode}</p>
                </div>

                {/* Sarees */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    Sarees in this Consignment ({order.items.length})
                  </h4>
                  <div className="divide-y divide-stone-100">
                    {order.items.map((i) => (
                      <div key={i.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={i.product_image_snapshot}
                            alt=""
                            className="w-10 h-12 object-cover rounded-md border"
                          />
                          <div>
                            <p className="font-bold text-stone-900">{i.product_name_snapshot}</p>
                            <p className="text-[11px] text-stone-500">Qty: {i.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#420B16]">
                          ₹{i.line_total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Help */}
                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-stone-500">Need immediate dispatch assistance?</span>
                  <a
                    href={`https://wa.me/917660833168?text=${encodeURIComponent(
                      `Namaste, I need a status update for Order ID: ${order.order_number}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#25D366] font-semibold hover:underline"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Direct WhatsApp Inquiry (+91 7660833168)</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center text-xs text-stone-500 space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-serif font-bold text-base text-stone-800">
                  No order found with number "{orderQuery}"
                </h3>
                <p className="max-w-xs mx-auto">
                  Please verify your Order ID from your confirmation email or order receipt.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
