import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '917660833168';
  const rawNumber = '7660833168';

  const defaultMessages = [
    'Namaste, I want to see real video of Gadwal Silk Sarees.',
    'I need help choosing a bridal saree for an upcoming wedding.',
    'Could you please update me on my order status?',
    'Is custom blouse stitching available with this saree?'
  ];

  const handleStartChat = (message: string) => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Quick Chat Popover */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#58101E] to-[#801A2D] p-4 text-white relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 right-3.5 text-amber-200/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] p-0.5 shadow-md">
                  <div className="w-full h-full rounded-full bg-[#420B16] flex items-center justify-center text-white font-cinzel font-bold text-lg">
                    VG
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#58101E] rounded-full"></span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#F7F1DC]">Vasavi Gadwal Support</h4>
                <p className="text-xs text-amber-200/90 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Weavers & Stylists Online
                </p>
                <p className="text-[11px] text-amber-100/70 font-mono mt-0.5">📞 +91 {rawNumber}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#FDFBF7]">
            <p className="text-xs text-stone-600 mb-3 leading-relaxed">
              Namaste! Welcome to <strong>Vasavi Gadwal Saree House</strong>. How may we assist your saree selection today?
            </p>

            <div className="space-y-2 mb-4">
              {defaultMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handleStartChat(msg)}
                  className="w-full text-left text-xs bg-white hover:bg-amber-50/70 text-stone-800 p-2.5 rounded-xl border border-stone-200 hover:border-[#D4AF37] transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{msg}</span>
                  <Send className="w-3.5 h-3.5 text-[#C5A059] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </button>
              ))}
            </div>

            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Open Direct WhatsApp (+91 {rawNumber})
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp with Vasavi Gadwal Saree House"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 border-2 border-white rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 border-2 border-white rounded-full"></span>
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="hidden sm:inline font-semibold text-xs tracking-wide">
          WhatsApp Us
        </span>
      </button>
    </div>
  );
};
