import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Truck, MessageCircle, ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

interface PaymentResultPageProps {
  orderId?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const PaymentResultPage: React.FC<PaymentResultPageProps> = ({ orderId, onNavigate }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#801A2D', '#C5A059', '#F7F1DC'],
      });
    } catch (e) {
      console.warn(e);
    }

    if (orderId) {
      api.getOrderById(orderId).then((ord) => {
        setOrder(ord);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-[#58101E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-stone-600">Verifying order & loom dispatch details...</p>
      </div>
    );
  }

  const orderNumber = order?.order_number || 'VGSH-ORD-CONFIRMED';
  const itemsText = (order?.items || []).map((it, idx) => 
    `${idx + 1}. *${it.product_name_snapshot}* (Qty: ${it.quantity}) - ₹${it.line_total.toLocaleString('en-IN')}`
  ).join('\n');
  const addrText = order?.address_snapshot ? 
    `\n*Delivery Address:*\n${order.address_snapshot.full_name}, ${order.address_snapshot.house_number}, ${order.address_snapshot.street}, ${order.address_snapshot.city}, ${order.address_snapshot.state} - ${order.address_snapshot.pincode} (📞 ${order.address_snapshot.phone})` : '';

  const whatsappMessage = 
    `*NAMASTE VASAVI GADWAL SAREE HOUSE* 🥻✨\n\n` +
    `I have confirmed my order: *${orderNumber}*\n\n` +
    (itemsText ? `*Items:*\n${itemsText}\n\n` : '') +
    `*Total Amount:* ₹${(order?.total_amount || 0).toLocaleString('en-IN')}` +
    addrText +
    `\n\nPlease confirm dispatch details. Dhanyavadagalu! 🙏`;

  const whatsappUrl = `https://wa.me/917660833168?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Hero Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-md text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8E6B2C]">
              Vasavi Gadwal Saree House
            </span>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#420B16] mt-1">
              Order Confirmed & Secured!
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
              Thank you for trusting Vasavi Gadwal Saree House. Your pure handwoven saree is being carefully inspected, packed in tamper-evident velvet casing, and prepared for express dispatch.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200/80 font-mono text-xs text-stone-800 font-bold">
            <span>Order Number:</span>
            <span className="text-[#58101E]">{orderNumber}</span>
          </div>

          {/* WhatsApp Direct Notification */}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs tracking-wider uppercase shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Track / Chat on WhatsApp (+91 7660833168)</span>
            </a>
          </div>
        </div>

        {/* Order Details & Timeline */}
        {order && (
          <div className="mt-8 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-8">
            {/* Timeline */}
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
                Dispatch Status
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    ✓
                  </div>
                  <p className="font-semibold text-emerald-800">Confirmed</p>
                  <p className="text-[10px] text-stone-400">Paid via PhonePe UPI</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[#58101E] text-white flex items-center justify-center mx-auto">
                    <Package className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-stone-800">Quality Check</p>
                  <p className="text-[10px] text-stone-400">At Gadwal Loom</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto">
                    <Truck className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-stone-500">Express Transit</p>
                  <p className="text-[10px] text-stone-400">₹100 Insured</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto">
                    🏠
                  </div>
                  <p className="font-semibold text-stone-500">Delivered</p>
                  <p className="text-[10px] text-stone-400">3-5 Business Days</p>
                </div>
              </div>
            </div>

            {/* Address Snapshot */}
            <div className="pt-6 border-t border-stone-200">
              <h4 className="font-serif font-bold text-base text-stone-900 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#8E6B2C]" />
                <span>Delivery Address Snapshot</span>
              </h4>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1">
                <p className="font-bold text-stone-900">{order.address_snapshot.full_name}</p>
                <p>
                  {order.address_snapshot.house_number}, {order.address_snapshot.street}, {order.address_snapshot.locality}
                </p>
                <p>
                  {order.address_snapshot.city}, {order.address_snapshot.state} - <strong>{order.address_snapshot.pincode}</strong>
                </p>
                <p className="text-stone-500 font-mono pt-1">
                  📞 {order.address_snapshot.phone} | ✉️ {order.address_snapshot.email}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="pt-6 border-t border-stone-200">
              <h4 className="font-serif font-bold text-base text-stone-900 mb-3">
                Ordered Sarees ({order.items.length})
              </h4>
              <div className="divide-y divide-stone-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product_image_snapshot}
                        alt=""
                        className="w-14 h-16 object-cover rounded-xl border border-stone-200"
                      />
                      <div>
                        <p className="font-serif font-bold text-stone-900 text-sm">
                          {item.product_name_snapshot}
                        </p>
                        <p className="text-stone-500">
                          Qty: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-base text-[#420B16]">
                      ₹{item.line_total.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-stone-900">₹{order.delivery_charge}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-serif font-bold text-base text-[#420B16]">
                  <span>Total Amount Paid</span>
                  <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-3 rounded-xl bg-[#58101E] hover:bg-[#801A2D] text-white text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => onNavigate('account', { tab: 'orders' })}
            className="px-6 py-3 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold"
          >
            View in My Orders
          </button>
        </div>
      </div>
    </div>
  );
};
