import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';

interface HeroBannerProps {
  onNavigate: (page: string, params?: any) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center bg-[#420B16] overflow-hidden">
      {/* Background Silk Image with Luxury Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85"
          alt="Regal Gadwal Silk Saree Weaving"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-transform duration-10000"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#28050C] via-[#420B16]/90 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl space-y-6">
          {/* Subtle Heritage Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#58101E]/90 border border-[#C5A059]/40 text-amber-200 text-xs tracking-wider uppercase backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Master Handlooms of Jogulamba Gadwal</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]">
            Timeless Elegance.{' '}
            <span className="block text-gold-gradient font-light italic mt-1">
              Traditional Gadwal Weaves.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-light max-w-xl">
            Immerse yourself in authentic Indian ethnic grandeur. Woven with pure mulberry silk, featherlight combed cotton bodies, and the legendary interlocking <strong className="text-white font-semibold">Kuttu zari borders</strong>, handcrafted by multi-generational pit-loom artisans.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => onNavigate('shop', { category: 'gadwal-silk-sarees' })}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E5C378] text-[#241E1C] font-semibold text-sm tracking-wide shadow-gold-md hover:shadow-gold-lg transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-[#C5A059]/50 font-medium text-sm tracking-wide backdrop-blur-md transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              Explore All Sarees
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-amber-200/90">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Pure Zari & Tested Silk</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Flat ₹100 All-India Delivery</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Direct Artisan Loom Pricing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gold Border Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#58101E] via-[#D4AF37] to-[#58101E]" />
    </section>
  );
};
