import React from 'react';
import { Sparkles, Award, Shield, Scissors } from 'lucide-react';

interface CraftStorySectionProps {
  onNavigate: (page: string) => void;
}

export const CraftStorySection: React.FC<CraftStorySectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 bg-[#58101E] text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Imagery Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl h-60 sm:h-72">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                  alt="Zari weaving on pit loom"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 rounded-2xl bg-[#420B16] border border-[#8E6B2C]/50 space-y-2">
                <Award className="w-6 h-6 text-[#D4AF37]" />
                <h4 className="font-serif font-bold text-base text-[#F7F1DC]">
                  Geographical Indication (GI)
                </h4>
                <p className="text-xs text-amber-100/70 leading-relaxed">
                  Gadwal Sarees hold authentic GI protection, certifying their origin and singular pit-loom heritage.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-5 rounded-2xl bg-[#420B16] border border-[#8E6B2C]/50 space-y-2">
                <Scissors className="w-6 h-6 text-[#D4AF37]" />
                <h4 className="font-serif font-bold text-base text-[#F7F1DC]">
                  The Kuttu Interlocking
                </h4>
                <p className="text-xs text-amber-100/70 leading-relaxed">
                  The body and contrast silk borders are joined together seamlessly with 3 distinct shuttles.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl h-60 sm:h-72">
                <img
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                  alt="Traditional Saree Drape and Zari Pallu"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Right: Narrative Story */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-[#D4AF37]/40 text-amber-200 text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Telangana Handloom Legacy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F7F1DC] leading-tight">
              The Sacred Symphony of{' '}
              <span className="text-gold-gradient block italic">Pure Silk & Zari</span>
            </h2>

            <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed font-light">
              Nestled between the Krishna and Tungabhadra rivers, the historic town of Gadwal has nurtured one of India’s most revered weaving traditions for over four centuries.
            </p>

            <p className="text-xs sm:text-sm text-amber-100/70 leading-relaxed">
              What sets a genuine Gadwal saree apart is the master technique known as <strong>Kuttu</strong>. While the body is woven from fine unweighted Mulberry silk or featherlight combed cotton, the rich temple borders and heavy zari pallu are independently woven and meticulously interlocked by hand. This allows the drape to remain surprisingly lightweight while boasting royal temple borders fit for queens and brides.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-serif font-bold text-2xl text-[#D4AF37]">30-45</p>
                <p className="text-amber-100/70 mt-1">Days to weave a single bridal masterpiece</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-serif font-bold text-2xl text-[#D4AF37]">100%</p>
                <p className="text-amber-100/70 mt-1">Pure Silk Mark & Handloom authenticity</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#241E1C] font-semibold text-xs tracking-wider uppercase transition-colors shadow-md"
              >
                Read Full Vasavi Heritage Story →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
