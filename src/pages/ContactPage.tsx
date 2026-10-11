import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, Check, ChevronDown, HelpCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const phoneNumber = '7660833168';
  const whatsappUrl = 'https://wa.me/917660833168';

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formOrderNo, setFormOrderNo] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I schedule a live video call to see sarees before ordering?',
      a: 'Simply message our customer care team on WhatsApp at +91 7660833168. Our weavers will showcase the exact saree, pleat drape, border luster, and pallu under natural daylight via WhatsApp Video Call.',
    },
    {
      q: 'What is the delivery charge and timeline across India?',
      a: 'We offer a transparent flat delivery charge of ₹100 across all serviceable PIN codes in India. Orders are dispatched from Gadwal within 24–48 hours via insured express couriers and typically arrive in 3–5 business days.',
    },
    {
      q: 'Are Vasavi Gadwal sarees certified pure silk?',
      a: 'Yes, absolutely. Every pure silk saree comes with authentic Silk Mark verification and is handwoven with genuine tested zari on traditional pit looms.',
    },
    {
      q: 'Is custom blouse stitching available?',
      a: 'All our sarees include an attached unstitched matching/contrast blouse piece (approx. 80 cm). For custom designer blouse stitching assistance, you can coordinate with our styling team on WhatsApp after placing your order.',
    },
    {
      q: 'How can I track my saree shipment?',
      a: 'Once your order is dispatched, you will receive an SMS and email notification with your tracking number. You can also track your status directly using our Track Order tool or by sending your Order ID to our WhatsApp helpline (+91 7660833168).',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8E6B2C]">
            We Are Here To Assist
          </span>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-[#420B16]">
            Customer Care & Loom Concierge
          </h1>
          <div className="w-16 h-0.5 bg-[#C5A059] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Have questions regarding pure Gadwal weaves, bridal customizations, or live video drape previews? Connect with our master weavers directly.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Phone */}
          <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-sm text-center space-y-3 hover:border-[#C5A059] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#8E6B2C] flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Direct Helpline</h3>
            <p className="text-xs text-stone-500">Call our desk for phone consultations</p>
            <a
              href={`tel:+91${phoneNumber}`}
              className="inline-block font-mono font-bold text-lg text-[#58101E] hover:underline pt-1"
            >
              +91 {phoneNumber}
            </a>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-sm text-center space-y-3 hover:border-[#25D366] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#25D366] flex items-center justify-center mx-auto">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">WhatsApp Support</h3>
            <p className="text-xs text-stone-500">Live video draping & order updates</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-2.5 px-5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Chat on WhatsApp (+91 {phoneNumber})
            </a>
          </div>

          {/* Card 3: Address & Hours */}
          <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-sm text-center space-y-3 hover:border-[#C5A059] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Handloom House</h3>
            <p className="text-xs text-stone-600">
              Vasavi Gadwal Saree House, Main Market Weavers Colony, Jogulamba Gadwal, Telangana 509125
            </p>
            <p className="text-[11px] text-stone-400 font-medium">Mon - Sat: 9:30 AM - 8:30 PM IST</p>
          </div>
        </div>

        {/* Message Form & Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif font-bold text-2xl text-stone-900">
                Send an Inquiry Message
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Fill out the details below and our concierge team will respond within 2-4 working hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-2 text-center">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-base">Inquiry Dispatched!</h4>
                <p>
                  Thank you, your message has been shared with our team. You can also connect instantly on WhatsApp at +91 {phoneNumber}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Radhika"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Phone Number (10 digits) *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Order Number (If applicable)</label>
                    <input
                      type="text"
                      value={formOrderNo}
                      onChange={(e) => setFormOrderNo(e.target.value)}
                      placeholder="e.g. VGSH-2025-..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Message / Saree Inquiry *</label>
                  <textarea
                    rows={4}
                    required
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Tell us what you are looking for (wedding dates, specific color combination, or order inquiry)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#58101E] hover:bg-[#801A2D] text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Support</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Order Support Instructions */}
          <div className="lg:col-span-5 bg-[#F9F5EC] p-8 rounded-3xl border border-stone-200 space-y-6 text-xs text-stone-700">
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Order Support Guidelines
            </h3>

            <div className="space-y-4 leading-relaxed">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#58101E] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Order Updates & Dispatch</h4>
                  <p className="text-stone-600 mt-0.5">
                    For active shipments, mention your <strong>Order ID</strong> in WhatsApp chats for instant courier tracking links.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#58101E] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Damage & Inspection Assurance</h4>
                  <p className="text-stone-600 mt-0.5">
                    We request recording an unboxing video upon receiving the package to ensure prompt resolution in the unlikely event of transit damage.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#58101E] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Bridal & Bulk Orders</h4>
                  <p className="text-stone-600 mt-0.5">
                    For bridal trousseau or multi-saree family orders, we offer personalized video consultation appointments.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200/80">
              <p className="text-[11px] text-stone-500">
                Online payments are strictly handled via secured Razorpay integration during checkout.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <HelpCircle className="w-8 h-8 text-[#8E6B2C] mx-auto" />
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-stone-500">
              Clear answers regarding our weaves, shipping, and authentic handlooms.
            </p>
          </div>

          <div className="divide-y divide-stone-200 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="py-4">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-stone-900 hover:text-[#58101E]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      openFaqIndex === i ? 'rotate-180 text-[#58101E]' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === i && (
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed font-light">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
