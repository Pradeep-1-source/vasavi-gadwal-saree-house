import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductFilters } from '../components/shop/ProductFilters';
import { QuickViewModal } from '../components/shop/QuickViewModal';

interface ShopPageProps {
  initialCategory?: string;
  initialSearch?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = '',
  initialSearch = '',
  onNavigate,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 35000]);
  const [selectedFabric, setSelectedFabric] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  
  // UI state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  const fetchProducts = async () => {
    setLoading(true);
    let items = await api.getProducts({
      categorySlug: selectedCategory || undefined,
      search: searchQuery || undefined,
      maxPrice: priceRange[1],
      sortBy: sortBy,
    });

    if (selectedFabric) {
      items = items.filter((p) => p.fabric.toLowerCase().includes(selectedFabric.toLowerCase()));
    }

    if (inStockOnly) {
      items = items.filter((p) => p.stock_quantity > 0);
    }

    setProducts(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, priceRange, selectedFabric, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange([0, 35000]);
    setSelectedFabric('');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-[#58101E]">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <button onClick={handleResetFilters} className="hover:text-[#58101E]">
            All Sarees
          </button>
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-[#58101E]">{activeCategoryObj.name}</span>
            </>
          )}
        </div>

        {/* Category Header */}
        <div className="mb-8 pb-6 border-b border-stone-200">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#420B16]">
            {activeCategoryObj ? activeCategoryObj.name : 'Authentic Handcrafted Gadwal Sarees'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-3xl leading-relaxed">
            {activeCategoryObj
              ? activeCategoryObj.description
              : 'Explore our complete heritage collection of pure mulberry silk and fine cotton Gadwal sarees featuring hand-interlocked Kuttu zari borders, temple spires, and rich brocade pallus.'}
          </p>
        </div>

        {/* Toolbar: Mobile filter trigger & Sort dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 shadow-xs"
            >
              <Filter className="w-4 h-4 text-[#8E6B2C]" />
              <span>Filters</span>
            </button>
            <span className="text-xs text-stone-500 font-medium">
              Showing <strong className="text-stone-900 font-semibold">{products.length}</strong> master weaves
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 bg-white border border-stone-200 rounded-xl font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C5A059] shadow-xs cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex gap-8 items-start">
          {/* Sidebar Filters */}
          <ProductFilters
            categories={categories}
            selectedCategorySlug={selectedCategory}
            onSelectCategory={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedFabric={selectedFabric}
            onSelectFabric={setSelectedFabric}
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            onResetFilters={handleResetFilters}
            isOpenMobile={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="aspect-[3/4] bg-stone-200 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={onNavigate}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-800 mb-1">
                  No sarees match your selected criteria
                </h3>
                <p className="text-xs text-stone-500 mb-6 max-w-sm mx-auto">
                  Try broadening your price filters or selecting a different category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#58101E] text-white text-xs font-semibold hover:bg-[#801A2D]"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
