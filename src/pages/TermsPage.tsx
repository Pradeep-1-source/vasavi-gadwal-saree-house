import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8E6B2C]">
            Legal Information
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#420B16] mt-1">
            Terms and Conditions
          </h1>
          <p className="text-xs text-stone-500 mt-1">Vasavi Gadwal Saree House • Official Terms</p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6 text-xs text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and purchasing from the Vasavi Gadwal Saree House website, you agree to comply with and be bound by these terms, our Shipping Policy, and our Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              2. Product Descriptions & Photography Accuracy
            </h2>
            <p>
              We photograph all sarees under balanced natural illumination to present authentic colors and zari tones. However, due to variations in individual monitor calibrations, smartphone screens, and lighting environments, slight perceptual variances in fabric hue may exist.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              3. Pricing and Payments
            </h2>
            <p>
              All prices are displayed in Indian Rupees (INR) and are inclusive of GST. Online payments are secured and verified via authorized payment gateway infrastructure (Razorpay). Orders are accepted subject to stock verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              4. Intellectual Property
            </h2>
            <p>
              All brand emblems, photography, descriptions, weave narratives, and layout graphics are proprietary intellectual assets of Vasavi Gadwal Saree House and may not be reproduced without written authorization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base text-stone-900">
              5. Governing Law & Jurisdiction
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts of Telangana, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
