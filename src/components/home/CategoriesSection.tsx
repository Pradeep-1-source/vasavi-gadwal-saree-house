import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';

interface CategoriesSectionProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  return (
    <section className="py-20 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[#8E6B2C] mb-2">
            Curated Collections
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#420B16]">
            Shop by Category
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059] mx-auto my-4" />
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            From majestic bridal Gadwal brocades to lightweight breathable cottons with pure silk borders, find your dream drape.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.slug })}
              className="group relative h-72 sm:h-84 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Background Image */}
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#28050C] via-[#420B16]/50 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#F7F1DC] group-hover:text-amber-200 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-[#C5A059] group-hover:text-[#241E1C] transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-amber-100/70 line-clamp-2 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
