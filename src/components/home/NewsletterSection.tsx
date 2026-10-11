import React, { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!consent) {
      setError('Please consent to receiving saree updates and festival offers.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <section className="py-16 bg-[#F9F5EC] border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#8E6B2C] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Exclusive Weaver Circle</span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#420B16] mb-3">
          Be First to Receive New Loom Arrivals
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto mb-8 leading-relaxed">
          Subscribe for early access to limited bridal editions, seasonal handloom drops, and festive discounts. No spam, only handloom heritage.
        </p>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 max-w-md mx-auto flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-left">
              Thank you for subscribing! We look forward to sharing our latest Gadwal creations with you.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="bg-[#58101E] hover:bg-[#801A2D] text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-2 text-left pt-1">
              <input
                id="newsletter-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-[#58101E] focus:ring-[#C5A059] h-3.5 w-3.5"
              />
              <label htmlFor="newsletter-consent" className="text-[11px] text-stone-500 leading-tight">
                I agree to receive handcrafted saree newsletters and festival notifications from Vasavi Gadwal Saree House. You may unsubscribe at any time.
              </label>
            </div>

            {error && (
              <p className="text-xs text-red-600 text-left pt-1">{error}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};
