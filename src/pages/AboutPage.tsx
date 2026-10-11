import React from 'react';
import { Sparkles, Award, ShieldCheck, HeartHandshake, Scissors, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#8E6B2C]">
            Our Heritage & Artisans
          </span>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-[#420B16] leading-tight">
            Vasavi Gadwal Saree House
          </h1>
          <div className="w-20 h-0.5 bg-[#C5A059] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Guardians of the 400-year-old pit-loom handloom traditions of Jogulamba Gadwal, Telangana. Bringing regal temple weaves directly from master weaver looms to discerning wardrobes across India.
          </p>
        </div>

        {/* Narrative & Image Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-sm">
          <div className="space-y-6">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 leading-snug">
              The Legend of Gadwal Weaves
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Dating back to the reign of the Gadwal Samsthanam kings in the 17th century, the weavers of Gadwal were commissioned to create sarees that could be folded to fit inside a matchbox, yet drape with the grandeur of royal brocades.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              At <strong>Vasavi Gadwal Saree House</strong>, we partner directly with over 60 traditional artisan families. We eliminate middlemen, guaranteeing fair master-weaver wages while ensuring our patrons receive 100% genuine Mulberry silk and pure tested zari certified with the Geographical Indication (GI) heritage tag.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/60">
                <p className="font-serif font-bold text-2xl text-[#58101E]">60+</p>
                <p className="text-stone-600 mt-1">Artisan families supported directly on pit looms</p>
              </div>
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/60">
                <p className="font-serif font-bold text-2xl text-[#58101E]">100%</p>
                <p className="text-stone-600 mt-1">Silk Mark & Geographical Indication authenticity</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-xl aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85"
              alt="Traditional Gadwal pit loom weaving"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* The Kuttu Technique Explanation */}
        <div className="bg-[#58101E] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden space-y-6">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs uppercase tracking-widest text-amber-200 font-semibold">
              Signature Craftsmanship
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#F7F1DC]">
              The Secret of The Kuttu Interlock
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed font-light">
              Unlike ordinary printed or powerloom sarees, an authentic Gadwal saree is created with three distinct shuttles. The body—whether fine unweighted silk or cool 100s count combed cotton—is seamlessly interlocked with the heavy contrast zari borders and pallu.
            </p>
            <p className="text-xs sm:text-sm text-amber-100/70 leading-relaxed">
              This interlocking, known as <strong>Kuttu</strong> or <em>Kupadam</em>, gives Gadwal its celebrated lightweight grace while maintaining the unmatched splendor of pure zari temple kumbha spires.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4 relative z-10">
            <button
              onClick={() => onNavigate('shop')}
              className="px-6 py-3 bg-[#C5A059] hover:bg-[#D4AF37] text-[#241E1C] font-semibold text-xs tracking-wider uppercase rounded-xl transition-colors shadow-md"
            >
              Browse Handcrafted Sarees →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
