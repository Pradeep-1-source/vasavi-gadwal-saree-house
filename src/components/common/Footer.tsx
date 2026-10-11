import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  HeartHandshake, 
  MessageCircle 
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#420B16] text-[#F7F1DC] border-t-4 border-[#C5A059] pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#801A2D]/70">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="lg" />
            <p className="text-xs text-amber-100/80 leading-relaxed max-w-sm mt-3">
              Vasavi Gadwal Saree House is dedicated to preserving the regal handloom legacy of Jogulamba Gadwal. Each saree is painstakingly woven by multi-generational master weavers featuring pure mulberry silk, fine count cotton, and authentic interlocking Kuttu zari borders.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-amber-200">
              <span className="flex items-center gap-1.5 bg-[#58101E] px-3 py-1.5 rounded-full border border-[#8E6B2C]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                100% Pure Silk & Handloom
              </span>
              <span className="flex items-center gap-1.5 bg-[#58101E] px-3 py-1.5 rounded-full border border-[#8E6B2C]/40">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                Flat ₹100 Express Delivery
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-sm tracking-widest text-[#D4AF37] uppercase">
              Heirloom Weaves
            </h4>
            <ul className="space-y-2 text-xs text-amber-100/70">
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'gadwal-silk-sarees' })}
                  className="hover:text-white transition-colors"
                >
                  Gadwal Silk Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'traditional-silk-sarees' })}
                  className="hover:text-white transition-colors"
                >
                  Traditional Silk Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'wedding-sarees' })}
                  className="hover:text-white transition-colors"
                >
                  Wedding & Bridal Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'festive-sarees' })}
                  className="hover:text-white transition-colors"
                >
                  Festive Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'cotton-sarees' })}
                  className="hover:text-white transition-colors"
                >
                  Cotton & Sico Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'new-arrivals' })}
                  className="hover:text-white transition-colors text-amber-300"
                >
                  New Loom Arrivals ✨
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-sm tracking-widest text-[#D4AF37] uppercase">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-amber-100/70">
              <li>
                <button
                  onClick={() => onNavigate('track-order')}
                  className="hover:text-white transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shipping-policy')}
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('refund-policy')}
                  className="hover:text-white transition-colors"
                >
                  Cancellation & Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Customer FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & WhatsApp Direct */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-sm tracking-widest text-[#D4AF37] uppercase">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-amber-100/80">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Direct Helpline</p>
                  <a href="tel:+917660833168" className="text-amber-200 hover:underline">
                    +91 7660833168
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">WhatsApp Support</p>
                  <a
                    href="https://wa.me/917660833168"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-200 hover:text-white underline"
                  >
                    Chat on WhatsApp (7660833168)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Loom Concierge Hours</p>
                  <p className="text-amber-100/70">Mon - Sat: 9:30 AM - 8:30 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Handloom House</p>
                  <p className="text-amber-100/70">Gadwal, Telangana 509125, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Security */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-amber-200/60">
          <p>© {new Date().getFullYear()} Vasavi Gadwal Saree House. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-xs text-amber-100/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              PhonePe Accepted (Scan & Pay with Any UPI App)
            </span>
            <span>•</span>
            <span>Insured All-India Transit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
