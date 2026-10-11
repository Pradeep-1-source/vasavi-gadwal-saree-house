import React from 'react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 text-center shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-[#8E6B2C] flex items-center justify-center mx-auto text-2xl font-cinzel font-bold">
          404
        </div>
        <h1 className="font-serif font-bold text-2xl text-stone-900">
          Page Not Found
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
          The handloom page or saree weave you were searching for could not be located.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-3 bg-[#58101E] hover:bg-[#801A2D] text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};
