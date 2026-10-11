import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { ProductCard } from '../shop/ProductCard';

interface FeaturedCollectionProps {
  onNavigate: (page: string, params?: any) => void;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'new-arrivals'>('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProducts().then((all) => {
      if (activeTab === 'featured') {
        setProducts(all.filter((p) => p.is_featured));
      } else if (activeTab === 'bestsellers') {
        // High stock or featured
        setProducts(all.slice(0, 4));
      } else {
        // New arrivals
        setProducts([...all].reverse().slice(0, 4));
      }
      setLoading(false);
    });
  }, [activeTab]);

  return (
    <section className="py-20 bg-[#FFFDF9] border-t border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#8E6B2C] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Telangana Loom Highlights</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#420B16]">
              Masterpiece Gadwal Sarees
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mt-3" />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-[#F9F5EC] p-1.5 rounded-2xl border border-stone-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'featured'
                  ? 'bg-[#58101E] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Featured Picks
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'bestsellers'
                  ? 'bg-[#58101E] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Bestsellers
            </button>
            <button
              onClick={() => setActiveTab('new-arrivals')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'new-arrivals'
                  ? 'bg-[#58101E] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Fresh Off Loom
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-stone-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-[#58101E] text-[#58101E] hover:bg-[#58101E] hover:text-white font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-xs hover:shadow-md"
          >
            <span>View Full Gadwal Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
