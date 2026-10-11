import React from 'react';
import { MessageCircle, Phone, Video, HelpCircle, ArrowRight } from 'lucide-react';

export const WhatsAppSupportBanner: React.FC = () => {
  const phoneNumber = '917660833168';
  const displayPhone = '7660833168';

  return (
    <section className="py-16 bg-gradient-to-r from-[#420B16] to-[#58101E] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span>Direct Weaver Video & Order Concierge</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F1DC]">
              Need Help Choosing Your Saree? <br />
              <span className="text-gold-gradient">Connect with Us on WhatsApp</span>
            </h3>

            <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
              View live weaves via video call before making your purchase, request custom color inquiries, or check real-time order dispatch updates directly with our customer care desk at <strong className="text-white font-mono">+91 {displayPhone}</strong>.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-amber-200/90 pt-2">
              <span className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-[#D4AF37]" />
                Live Video Drape Preview
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                Call Helpline: {displayPhone}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
                Blouse Piece Guidance
              </span>
            </div>
          </div>

          {/* Right Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent('Namaste Vasavi Gadwal Saree House, I would like assistance with saree selection and live video call.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
              <span>Chat on WhatsApp (+91 {displayPhone})</span>
            </a>

            <a
              href={`tel:+91${displayPhone}`}
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs tracking-wider uppercase text-center border border-white/20 transition-all"
            >
              Direct Call (+91 {displayPhone})
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
