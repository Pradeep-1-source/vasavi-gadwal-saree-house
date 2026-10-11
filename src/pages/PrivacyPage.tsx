import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8E6B2C]">
            Customer Data Protection
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#420B16] mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-stone-500 mt-1">Vasavi Gadwal Saree House • Customer Privacy Safeguards</p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6 text-xs text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              1. Information We Collect
            </h2>
            <p>
              When you register or place an order on our store, we collect details necessary to process your delivery: customer name, mobile phone number, email address, and physical shipping address.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              2. How Your Information is Used
            </h2>
            <p>
              Your contact details are used exclusively for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Processing, billing, and fulfilling your saree order.</li>
              <li>Providing shipment tracking SMS and WhatsApp dispatch notifications.</li>
              <li>Customer service responses from our helpline (+91 7660833168).</li>
              <li>Occasional seasonal weaver updates, with your express consent.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              3. Payment Security & Zero Card Storage
            </h2>
            <p>
              We do not store your credit card, debit card, or UPI credentials. All transactions are securely processed directly by RBI-licensed payment gateway partners (Razorpay) adhering to the highest PCI-DSS Level 1 security standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              4. Data Sharing
            </h2>
            <p>
              We do not sell, rent, or trade customer contact details with third-party advertisers. Information is disclosed solely to trusted logistics providers (courier partners) for package delivery.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
