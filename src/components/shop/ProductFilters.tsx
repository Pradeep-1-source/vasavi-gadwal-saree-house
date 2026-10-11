import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Category } from '../../types';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedFabric: string;
  onSelectFabric: (fabric: string) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  onResetFilters: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategorySlug,
  onSelectCategory,
  priceRange,
  onPriceRangeChange,
  selectedFabric,
  onSelectFabric,
  inStockOnly,
  onToggleInStock,
  onResetFilters,
  isOpenMobile,
  onCloseMobile,
}) => {
  const fabrics = [
    'All Fabrics',
    'Pure Mulberry Silk',
    'Pure Gadwal Silk',
    'Cotton',
    'Sico Silk'
  ];

  const content = (
    <div className="space-y-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-lg">
          <Filter className="w-4 h-4 text-[#8E6B2C]" />
          <span>Filter Sarees</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] text-[#8E6B2C] hover:text-[#58101E] flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#58101E] mb-3">
          Weave Category
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full text-left text-xs py-2 px-3 rounded-xl transition-colors ${
              !selectedCategorySlug
                ? 'bg-[#58101E] text-white font-semibold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            All Collections
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.slug)}
              className={`w-full text-left text-xs py-2 px-3 rounded-xl transition-colors ${
                selectedCategorySlug === c.slug
                  ? 'bg-[#58101E] text-white font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#58101E]">
            Price Range
          </h4>
          <span className="text-xs font-semibold text-[#8E6B2C]">
            Up to ₹{priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="5000"
          max="35000"
          step="1000"
          value={priceRange[1]}
          onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-[#58101E] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-stone-400 mt-1">
          <span>₹5,000</span>
          <span>₹35,000</span>
        </div>
      </div>

      {/* Fabric Filter */}
      <div>
        <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#58101E] mb-2.5">
          Fabric & Purity
        </h4>
        <div className="space-y-1">
          {fabrics.map((f, i) => {
            const isSelected = (f === 'All Fabrics' && !selectedFabric) || selectedFabric === f;
            return (
              <label
                key={i}
                className="flex items-center gap-2 text-xs text-stone-700 py-1.5 px-2 rounded-lg hover:bg-stone-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="fabricFilter"
                  checked={isSelected}
                  onChange={() => onSelectFabric(f === 'All Fabrics' ? '' : f)}
                  className="accent-[#58101E]"
                />
                <span>{f}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-2 border-t border-stone-200">
        <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="rounded text-[#58101E] focus:ring-[#C5A059] h-4 w-4 accent-[#58101E]"
          />
          <span className="font-medium">In Stock Only (Ready to Dispatch)</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs h-fit sticky top-28">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onCloseMobile}>
          <div
            className="w-4/5 max-w-sm h-full bg-white shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button onClick={onCloseMobile} className="p-1 rounded-full text-stone-500 hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
            <button
              onClick={onCloseMobile}
              className="mt-6 w-full py-3 bg-[#58101E] text-white text-xs font-semibold rounded-xl"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
};
