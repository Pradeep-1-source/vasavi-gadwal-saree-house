import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../../types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discountAmount?: number;
  totalAmount: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  deliveryCharge,
  discountAmount = 0,
  totalAmount,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#8E6B2C]" />
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Order Summary ({items.reduce((s, i) => s + i.quantity, 0)})
          </h3>
        </div>
      </div>

      {/* Items list */}
      <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="py-3.5 flex gap-3.5">
            <img
              src={item.product.images[0]?.image_url}
              alt={item.product.name}
              className="w-16 h-20 object-cover rounded-lg border border-stone-200 shrink-0"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-bold text-xs text-stone-900 line-clamp-1">
                  {item.product.name}
                </h4>
                <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                  SKU: {item.product.sku}
                </p>
                <p className="text-[11px] text-stone-500">
                  Qty: <span className="font-semibold text-stone-700">{item.quantity}</span>
                </p>
              </div>
              <div className="text-right font-serif font-bold text-sm text-[#58101E]">
                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Breakdown */}
      <div className="space-y-2.5 pt-4 border-t border-stone-200 text-xs text-stone-600">
        <div className="flex justify-between">
          <span>Items Subtotal</span>
          <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#8E6B2C]" />
            <span>Delivery Charge (All-India Express)</span>
          </div>
          <span className={deliveryCharge === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-stone-900'}>
            {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Promotional Discount</span>
            </div>
            <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* Total */}
        <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
          <div>
            <span className="font-serif font-bold text-base text-stone-900">
              Total Payable Amount
            </span>
            <p className="text-[11px] text-stone-400">Includes all applicable GST taxes</p>
          </div>
          <span className="font-serif font-bold text-2xl text-[#420B16]">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Security note */}
      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-start gap-2 text-[11px] text-[#6C5020]">
        <ShieldCheck className="w-4 h-4 text-[#8E6B2C] shrink-0 mt-0.5" />
        <span>
          Prices & stock are locked during checkout. Orders are dispatched directly from our master looms in tamper-evident sealed packaging.
        </span>
      </div>
    </div>
  );
};
