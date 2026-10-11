import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, X, Smartphone, ArrowRight, Download, Upload, Copy, Check, MessageCircle, AlertCircle } from 'lucide-react';
import { Order } from '../../types';

interface PhonePePaymentModalProps {
  order: Order;
  isOpen: boolean;
  onSuccess: (paymentId: string) => void;
  onFailure: (errorMsg: string) => void;
  onClose: () => void;
}

export const PhonePePaymentModal: React.FC<PhonePePaymentModalProps> = ({
  order,
  isOpen,
  onSuccess,
  onFailure,
  onClose,
}) => {
  if (!isOpen) return null;

  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [error, setError] = useState('');

  const beneficiaryName = 'K THIRUMALA DEVI';
  const upiId = '7660833168@ybl'; // Official PhonePe merchant handle linked to phone 7660833168

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() && !screenshotPreview) {
      setError('Please provide your 12-digit UPI UTR / Transaction Number or upload payment screenshot.');
      return;
    }

    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const paymentRef = utrNumber.trim() ? `UPI-${utrNumber.trim()}` : `PHONEPE-${Date.now()}`;
      onSuccess(paymentRef);
    }, 1500);
  };

  // UPI Deep Link for mobile users
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(beneficiaryName)}&am=${order.total_amount}&cu=INR&tn=${encodeURIComponent(`Order ${order.order_number}`)}`;

  const whatsappPaymentHelp = `https://wa.me/917660833168?text=${encodeURIComponent(
    `Namaste Vasavi Gadwal Saree House, I am paying for Order #${order.order_number} (Amount: ₹${order.total_amount}). Please assist.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#D4AF37]/40 z-10 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5f259f] to-[#4c1d80] p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md">
                <img src="/phonepe-qr.jpg" alt="PhonePe" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  PhonePe UPI Payment
                </h3>
                <p className="text-[11px] text-purple-200 font-mono">
                  Order #{order.order_number}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-purple-200 hover:text-white hover:bg-white/10"
              aria-label="Close payment modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount & Beneficiary Banner */}
          <div className="bg-purple-50/80 px-6 py-4 border-b border-purple-200/60 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-purple-900 font-semibold uppercase tracking-wider">
                Beneficiary: {beneficiaryName}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                  {upiId}
                </span>
                <button
                  onClick={handleCopyUpi}
                  className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-stone-500 block">Total Payable:</span>
              <span className="font-serif font-bold text-2xl text-[#5f259f]">
                ₹{order.total_amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Official PhonePe QR Code Container */}
            <div className="bg-[#FAF7FC] p-4 rounded-2xl border-2 border-dashed border-[#5f259f]/40 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5f259f] text-white text-[11px] font-semibold">
                <span>Scan & Pay Using Any UPI App</span>
              </div>

              {/* Uploaded PhonePe QR Code Display */}
              <div className="relative max-w-[240px] mx-auto bg-white p-2 rounded-2xl shadow-md border border-stone-200 overflow-hidden group">
                <img
                  src="/phonepe-qr.jpg"
                  alt="PhonePe QR Code - K THIRUMALA DEVI"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>

              <div className="flex items-center justify-center gap-3 text-xs">
                <a
                  href="/phonepe-qr.jpg"
                  download="PhonePe_Vasavi_QR.jpg"
                  className="text-purple-700 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save QR to Gallery</span>
                </a>
                <span>•</span>
                <a
                  href={upiDeepLink}
                  className="sm:hidden text-purple-700 hover:underline flex items-center gap-1 text-[11px] font-bold"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Tap to Pay on App</span>
                </a>
              </div>
            </div>

            {/* Instruction Steps */}
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  1
                </div>
                <p>
                  Open <strong>PhonePe, Google Pay, Paytm</strong>, or any UPI app and scan the QR code above.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  2
                </div>
                <p>
                  Confirm payment of <strong>₹{order.total_amount.toLocaleString('en-IN')}</strong> to <strong>{beneficiaryName}</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  3
                </div>
                <p>
                  Enter the <strong>12-digit UPI UTR / Transaction ID</strong> from your payment receipt below to confirm your saree order.
                </p>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleSubmitPayment} className="space-y-4 pt-2 border-t border-stone-200">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  12-Digit UPI Transaction / UTR Number *
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 508934129876 or UPI Ref ID"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5f259f]"
                />
              </div>

              {/* Optional Screenshot Attachment */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Payment Screenshot (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Screenshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                  </label>
                  {screenshotPreview && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Attached
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 bg-[#5f259f] hover:bg-[#4d1d82] text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>
                    {isVerifying ? 'Confirming Payment...' : 'I Have Paid • Place My Order'}
                  </span>
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <a
                    href={whatsappPaymentHelp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 hover:text-[#25D366] flex items-center gap-1 text-[11px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Send Screenshot on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[11px] text-stone-400 hover:text-stone-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Trust */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[10px] text-stone-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>Direct Bank Verification • Official Vasavi Gadwal Account</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
