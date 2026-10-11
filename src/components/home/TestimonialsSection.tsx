import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { Review } from '../../types';
import { api } from '../../services/api';

export const TestimonialsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    api.getReviews().then((all) => setReviews(all.filter((r) => r.is_approved)));
  }, []);

  return (
    <section className="py-20 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[#8E6B2C] mb-2">
            Cherished Experiences
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#420B16]">
            Words From Our Patrons
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059] mx-auto my-4" />
          <p className="text-xs sm:text-sm text-stone-600">
            Real feedback from discerning saree collectors and brides celebrating with Vasavi Gadwal handlooms.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-[#C5A059] transition-all flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-[#C5A059]/20 absolute top-6 right-6" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
                  "{rev.review_text}"
                </p>
              </div>

              {/* Author & Verification */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#420B16]">
                    {rev.user_name}
                  </h4>
                  {rev.product_name && (
                    <p className="text-[11px] text-[#8E6B2C] truncate max-w-[200px] mt-0.5">
                      {rev.product_name}
                    </p>
                  )}
                </div>
                <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3 h-3" />
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
