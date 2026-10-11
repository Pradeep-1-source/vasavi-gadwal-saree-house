import React from 'react';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8E6B2C]">
            Delivery & Transit Guidelines
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#420B16] mt-1">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-stone-500 mt-1">Last Updated: January 2025</p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6 text-xs text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              1. Flat ₹100 Express Delivery Across India
            </h2>
            <p>
              Vasavi Gadwal Saree House is committed to clear, transparent pricing. We levy a <strong>flat delivery charge of ₹100 per order</strong> across all serviceable PIN codes throughout India, irrespective of destination state or shipment volume. Orders reaching the designated promotional threshold (e.g. ₹15,000) qualify for complimentary free express delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              2. Order Dispatch Timeframes
            </h2>
            <p>
              Since our sarees are genuine handloom creations stored in moisture-controlled conditions in Gadwal, Telangana, each piece undergoes a rigorous quality check before dispatch. In-stock sarees are dispatched within <strong>24 to 48 business hours</strong> of verified online payment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              3. Estimated Transit Time
            </h2>
            <p>
              Deliveries are handled by premium express logistics partners (Blue Dart, DTDC, Delhivery, Speed Post).
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Telangana & Andhra Pradesh: 2 to 3 business days.</li>
              <li>Metro Cities (Bengaluru, Chennai, Mumbai, Delhi, Kolkata): 3 to 4 business days.</li>
              <li>Rest of India: 4 to 6 business days.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              4. Tamper-Evident Luxury Packaging
            </h2>
            <p>
              Every Gadwal saree is placed inside a protective moisture-barrier sleeve, wrapped in traditional butter paper, and encased in tamper-proof reinforced outer boxes to guarantee that your precious silk and zari reach you in pristine condition.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              5. Delivery Tracking & Helpline
            </h2>
            <p>
              Tracking details are shared via email and SMS upon shipment generation. For any courier queries, contact our desk at <strong>+91 7660833168</strong> or chat on WhatsApp at <strong>https://wa.me/917660833168</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
