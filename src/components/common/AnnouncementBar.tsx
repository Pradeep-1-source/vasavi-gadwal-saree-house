import React from 'react';
import { Phone, Sparkles, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useCart();

  if (!settings.is_announcement_enabled) return null;

  return (
    <div className="bg-[#420B16] text-[#F7F1DC] border-b border-[#8E6B2C]/40 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left: Express delivery highlight */}
        <div className="flex items-center gap-2 text-amber-200/90 font-medium">
          <Truck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span>
            Flat <strong className="text-white font-semibold">₹100 Express Delivery</strong> across India • Insured Packaging
          </span>
        </div>

        {/* Center: Brand headline message */}
        <div className="hidden lg:flex items-center gap-1.5 text-cream-100 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{settings.announcement_bar}</span>
        </div>

        {/* Right: Direct Weaver Helpline & WhatsApp */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+917660833168"
            className="flex items-center gap-1 text-[#F7F1DC] hover:text-[#D4AF37] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#D4AF37]" />
            <span>Support: +91 7660833168</span>
          </a>
          <span className="text-amber-400/40 hidden sm:inline">|</span>
          <a
            href="https://wa.me/917660833168"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex text-[#D4AF37] hover:underline font-medium text-[11px]"
          >
            Direct WhatsApp Chat ↗
          </a>
        </div>
      </div>
    </div>
  );
};
