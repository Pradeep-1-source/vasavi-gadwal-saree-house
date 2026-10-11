import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Truck, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onNavigate,
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isFavorited = isInWishlist(product.id);

  const currentImage = product.images[selectedImageIndex]?.image_url || product.images[0]?.image_url;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    onNavigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div 
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#D4AF37]/30 my-8 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Product Images */}
            <div className="p-6 bg-stone-50 flex flex-col justify-between">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200 bg-white">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-[#58101E] ring-2 ring-[#C5A059]/40'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Actions */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-mono">SKU: {product.sku}</span>
                    <span className="text-[#8E6B2C] font-semibold">{product.category_name}</span>
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-stone-900 leading-snug">
                    {product.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="font-serif font-bold text-2xl text-[#420B16]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.compare_at_price && (
                    <span className="text-sm text-stone-400 line-through">
                      ₹{product.compare_at_price.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Includes GST
                  </span>
                </div>

                {/* Specifications snippet */}
                <div className="space-y-1.5 text-xs text-stone-600 bg-[#FDFBF7] p-3 rounded-xl border border-stone-200">
                  <p><strong>Fabric:</strong> {product.fabric}</p>
                  <p><strong>Color:</strong> {product.colour}</p>
                  <p><strong>Length:</strong> {product.saree_length}</p>
                  <p><strong>Blouse:</strong> {product.blouse_details}</p>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Stock info */}
                <div>
                  {product.stock_quantity > 0 ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      In Stock ({product.stock_quantity} available on loom)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-600">
                      Currently Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity <= 0}
                    className="py-3 px-4 bg-[#58101E] hover:bg-[#801A2D] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock_quantity <= 0}
                    className="py-3 px-4 bg-[#C5A059] hover:bg-[#D4AF37] text-[#241E1C] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-600 text-red-600' : ''}`} />
                    <span>{isFavorited ? 'In Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  <a
                    href={`https://wa.me/917660833168?text=${encodeURIComponent(`Hello, I want to enquire about ${product.name} (SKU: ${product.sku})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#25D366] font-semibold hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Ask on WhatsApp</span>
                  </a>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onNavigate('product', { slug: product.slug });
                  }}
                  className="w-full text-center text-xs text-[#58101E] font-semibold hover:underline pt-1"
                >
                  View Full Product Details & Saree Story →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
