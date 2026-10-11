import React from 'react';
import { ShieldAlert, RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react';

export const CancellationRefundPage: React.FC = () => {
  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8E6B2C]">
            Customer Safeguard & Terms
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#420B16] mt-1">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Policy Template for Vasavi Gadwal Saree House • Ready for Merchant Review
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6 text-xs text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              1. Order Cancellations
            </h2>
            <p>
              Customers may cancel an order before it has been handed over to the courier partner for dispatch (typically within 12 hours of placing the order). To request a cancellation, please message our support desk immediately at <strong>+91 7660833168</strong> or on WhatsApp with your Order ID. Once dispatched, an order cannot be cancelled in transit.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              2. Authentic Handloom Variations
            </h2>
            <p>
              Please note that our Gadwal sarees are handcrafted by master weavers on pit looms using traditional Kuttu interlocking. Minor irregularities in the weft, slight unevenness in zari buttis, or natural slub textures in handspun cotton and pure silk are hallmark characteristics of genuine handloom craftsmanship, not manufacturing flaws.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              3. Returns & Exchange Eligibility
            </h2>
            <p>
              We accept returns or exchanges strictly in the following cases:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Receipt of a defective or transit-damaged saree.</li>
              <li>Receipt of an incorrect saree design or color differing significantly from the ordered SKU.</li>
            </ul>
            <p className="pt-1">
              Any return claim must be notified to us within <strong>48 hours of delivery</strong> along with clear unboxing photographs or video sent to WhatsApp <strong>+91 7660833168</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              4. Return Conditions
            </h2>
            <p>
              Returned sarees must be in their original, unwashed, unworn condition with all product tags, folded creases, and blouse pieces intact, in the original packaging. Once blouse pieces are cut or stitched, sarees are non-returnable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              5. Refund Processing
            </h2>
            <p>
              Approved refunds are credited back to the original payment source (Razorpay UPI, Debit/Credit Card, or Netbanking) within <strong>5 to 7 working days</strong> following receipt and physical inspection of the saree at our Gadwal facility.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
