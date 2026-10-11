import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Star, 
  MessageCircle, 
  Share2, 
  Check, 
  Minus, 
  Plus, 
  Eye, 
  ZoomIn,
  RefreshCw,
  Award,
  Trash2,
  Settings
} from 'lucide-react';
import { Product, Review } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/shop/ProductCard';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Purchase state
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Review Form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const loadProductData = async () => {
      setLoading(true);
      const prod = await api.getProductBySlug(slug);
      if (prod) {
        setProduct(prod);
        const [allReviews, allProds] = await Promise.all([
          api.getReviews(prod.id),
          api.getProducts({ categorySlug: prod.category_id }),
        ]);
        setReviews(allReviews);
        setRelatedProducts(allProds.filter((p) => p.id !== prod.id).slice(0, 4));
      }
      setLoading(false);
    };
    loadProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-[#58101E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif font-bold text-2xl text-stone-900 mb-2">
          Saree Not Found
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          The requested saree weave might have been archived or retired from the active loom.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 rounded-xl bg-[#58101E] text-white text-xs font-semibold"
        >
          Explore All Gadwal Sarees
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const currentImage = product.images[selectedImageIndex]?.image_url || product.images[0]?.image_url;

  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  // Zoom mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    const res = addToCart(product, quantity);
    if (res.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onNavigate('checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);

    const newRev = await api.submitReview({
      user_id: user?.id || 'usr-guest-' + Date.now(),
      user_name: reviewName.trim() || user?.full_name || 'Verified Buyer',
      product_id: product.id,
      product_name: product.name,
      rating: reviewRating,
      review_text: reviewComment.trim(),
    });

    setReviews([newRev, ...reviews]);
    setReviewComment('');
    setSubmittingReview(false);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  const whatsappInquiryUrl = `https://wa.me/917660833168?text=${encodeURIComponent(
    `Namaste Vasavi Gadwal Saree House, I would like to inquire about this saree:\n\n*${product.name}*\nSKU: ${product.sku}\nPrice: ₹${product.price}\n\nCould you please share drape photos or schedule a live video call?`
  )}`;

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-[#58101E]">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <button onClick={() => onNavigate('shop')} className="hover:text-[#58101E]">
            Shop
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-stone-800 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Admin Quick Action Controls */}
        {user?.role === 'admin' && (
          <div className="mb-6 p-4 bg-amber-50/90 border border-amber-300 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Store Admin Mode ({user.email})
                </p>
                <p className="text-[11px] text-amber-800">
                  Managing SKU: <span className="font-mono font-bold">{product.sku}</span> • Stock: {product.stock_quantity} units
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('admin')}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Settings className="w-3.5 h-3.5 text-stone-600" />
                <span>Open Admin Dashboard</span>
              </button>
              <button
                onClick={async () => {
                  if (window.confirm(`Are you sure you want to permanently delete "${product.name}" (SKU: ${product.sku}) from the store catalogue?`)) {
                    await api.deleteProduct(product.id);
                    alert(`"${product.name}" has been deleted successfully.`);
                    onNavigate('shop');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                title="Delete this saree from catalogue"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Saree</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
          {/* LEFT: Image Gallery with Interactive Zoom */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 cursor-crosshair group select-none"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={currentImage}
                alt={product.name}
                className={`w-full h-full object-cover object-top transition-transform duration-200 ${
                  isZoomed ? 'scale-150 origin-center' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : undefined
                }
              />

              {/* Zoom hint badge */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none opacity-80 group-hover:opacity-100">
                <ZoomIn className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Hover over image to zoom weave</span>
              </div>

              {/* Featured Badge */}
              {product.is_featured && (
                <div className="absolute top-4 left-4 bg-[#58101E] text-amber-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Heritage Masterpiece
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#58101E] ring-2 ring-[#C5A059]/50 shadow-md'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details & Purchase Form */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, SKU, and Wishlist Header */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#8E6B2C]">
                  {product.category_name || 'Gadwal Silk'}
                </span>
                <span className="font-mono text-stone-500">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Price & Taxes */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-serif font-bold text-3xl text-[#420B16]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.compare_at_price && (
                  <span className="text-base text-stone-400 line-through">
                    ₹{product.compare_at_price.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold bg-[#C5A059]/20 text-[#6C5020] px-2.5 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                Inclusive of all taxes. Flat <strong>₹100 Express Delivery</strong> across India.
              </p>

              {/* Stock Status */}
              <div className="pt-2">
                {product.stock_quantity > 0 ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>
                      In Stock on Loom ({product.stock_quantity} available)
                    </span>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 w-fit">
                    Currently Sold Out (Loom weaving in progress)
                  </div>
                )}
              </div>

              {/* Saree Specification Details Table */}
              <div className="bg-[#FDFBF7] rounded-2xl p-4 border border-stone-200 space-y-2 text-xs text-stone-700 mt-4">
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Fabric & Purity:</span>
                  <span className="font-semibold text-stone-900">{product.fabric}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Colour Palette:</span>
                  <span className="font-semibold text-stone-900">{product.colour}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Saree Length:</span>
                  <span className="font-semibold text-stone-900">{product.saree_length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Blouse Piece:</span>
                  <span className="font-semibold text-stone-900">{product.blouse_details}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Weave Heritage:</span>
                  <span className="font-semibold text-[#8E6B2C]">Traditional Kuttu Interlocked Zari</span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h4 className="font-serif font-bold text-sm text-stone-900 mb-1.5">
                  About this Weave
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              {product.stock_quantity > 0 && (
                <div className="pt-3 flex items-center gap-4">
                  <span className="text-xs font-semibold text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-stone-200 transition-colors text-stone-700"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="p-2 hover:bg-stone-200 transition-colors text-stone-700"
                      disabled={quantity >= product.stock_quantity}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity <= 0}
                  className={`py-3.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#58101E] hover:bg-[#801A2D] text-white hover:shadow-lg'
                  }`}
                >
                  {addedSuccess ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{addedSuccess ? 'Added to Bag' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity <= 0}
                  className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#E5C378] text-[#241E1C] font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg"
                >
                  Buy Now
                </button>
              </div>

              {/* Wishlist & WhatsApp Enquiry */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                    isFavorited
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-stone-300 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-600' : ''}`} />
                  <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>

              {/* Trust Callouts */}
              <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#8E6B2C]" />
                  <span>Flat ₹100 Express Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8E6B2C]" />
                  <span>100% Pure Tested Silk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#8E6B2C]" />
                  <span>GI Protected Gadwal Weave</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8E6B2C]" />
                  <span>Direct From Telengana Looms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <div className="mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
            <div>
              <h3 className="font-serif font-bold text-2xl text-[#420B16]">
                Customer Reviews & Testimonials
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Verified feedback from patrons who draped this saree.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-[#FDFBF7] border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        ))}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed italic">
                      "{rev.review_text}"
                    </p>
                    <div className="pt-1 flex items-center justify-between text-xs text-stone-900 font-semibold">
                      <span>{rev.user_name}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified Drape
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                  Be the first to share your experience with this Gadwal masterpiece!
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div className="lg:col-span-5 bg-[#F9F5EC] p-6 rounded-2xl border border-stone-200 space-y-4">
              <h4 className="font-serif font-bold text-lg text-stone-900">
                Write a Saree Review
              </h4>

              {reviewSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
                  Thank you for your review! Your feedback preserves our weaver traditions.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Priyamvada"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewRating(num)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              num <= reviewRating
                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Review Comments *</label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts on the drape, zari sheen, Kuttu border, and packaging..."
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 bg-[#58101E] hover:bg-[#801A2D] text-white font-semibold rounded-xl transition-colors shadow-xs"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* RELATED SAREES */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest font-semibold text-[#8E6B2C] mb-1">
                You May Also Admire
              </p>
              <h3 className="font-serif font-bold text-3xl text-[#420B16]">
                Complementary Handlooms
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
