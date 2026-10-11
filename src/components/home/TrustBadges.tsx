import React from 'react';
import { Award, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Award,
      title: 'Authentic Gadwal Weaves',
      desc: 'Handcrafted on traditional pit looms using time-tested Kuttu techniques.',
    },
    {
      icon: ShieldCheck,
      title: 'Pure Silk & Zari Assured',
      desc: 'Highest grade Mulberry silk tested for purity and opulent zari luster.',
    },
    {
      icon: Truck,
      title: 'Flat ₹100 Express Delivery',
      desc: 'Transparent, flat delivery across all PIN codes in India. Tamper-evident packing.',
    },
    {
      icon: HeartHandshake,
      title: 'Direct Weaver Support',
      desc: 'Personal video consultations & order help on WhatsApp (+91 7660833168).',
    },
  ];

  return (
    <section className="bg-[#FFFDF9] py-10 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-[#C5A059] transition-all group"
              >
                <div className="p-3 rounded-xl bg-amber-50 text-[#8E6B2C] group-hover:bg-[#58101E] group-hover:text-[#D4AF37] transition-colors shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 mb-1">
                    {b.title}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
