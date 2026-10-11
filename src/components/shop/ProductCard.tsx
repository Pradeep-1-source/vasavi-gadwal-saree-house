import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Check, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, params?: any) => void;
  onQuickView?: (product: Product) => void;
  onDeleted?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  onQuickView,
  onDeleted,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAdmin } = useAuth();

  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const hasMultipleImages = product.images.length > 1;
  const primaryImage = product.images[0]?.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = hasMultipleImages ? product.images[1]?.image_url : primaryImage;

  // Discount %
  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock_quantity <= 0) return;
    setIsAdding(true);
    const res = addToCart(product, 1);
    if (res.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 1500);
    }
    setIsAdding(false);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleDeleteProduct = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete "${product.name}" (SKU: ${product.sku}) from the store catalogue?`)) {
      await api.deleteProduct(product.id);
      if (onDeleted) {
        onDeleted(product.id);
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <div
      onClick={() => onNavigate('product', { slug: product.slug })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-[#C5A059] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <img
          src={isHovered && hasMultipleImages ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_featured && (
            <span className="bg-[#58101E] text-amber-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
              Heritage Pick
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#C5A059] text-[#241E1C] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Top Right Actions: Wishlist and Admin Delete */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {isAdmin && (
            <button
              onClick={handleDeleteProduct}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:scale-105"
              title="Delete Saree (Admin)"
              aria-label="Delete Saree"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorited
                ? 'bg-red-50 text-red-600 shadow-md'
                : 'bg-white/80 text-stone-600 hover:text-red-600 hover:bg-white'
            }`}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-600' : ''}`} />
          </button>
        </div>

        {/* Quick View Floating Action (Desktop) */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="hidden md:flex absolute bottom-3 left-3 right-3 py-2 px-3 bg-white/90 backdrop-blur-md text-stone-800 rounded-xl text-xs font-semibold items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-white"
          >
            <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Color */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
            <span className="font-mono">{product.sku}</span>
            <span className="font-medium text-[#8E6B2C]">{product.colour}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#6B1425] line-clamp-1 transition-colors">
            {product.name}
          </h3>

          {/* Fabric Note */}
          <p className="text-xs text-stone-500 line-clamp-1 mt-1 font-sans">
            {product.fabric}
          </p>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-lg sm:text-xl text-[#420B16]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compare_at_price && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.compare_at_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {/* Stock indicator */}
            <p className="text-[10px] mt-0.5">
              {product.stock_quantity > 0 ? (
                product.stock_quantity <= 2 ? (
                  <span className="text-amber-700 font-semibold">Only {product.stock_quantity} left on loom</span>
                ) : (
                  <span className="text-emerald-700 font-medium">Ready to dispatch</span>
                )
              ) : (
                <span className="text-red-600 font-medium">Sold Out</span>
              )}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0 || isAdding}
            className={`p-2.5 sm:px-3 sm:py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : product.stock_quantity <= 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-[#58101E] hover:bg-[#801A2D] text-white shadow-xs hover:shadow-md'
            }`}
            title="Add saree to bag"
            aria-label="Add to cart"
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
