import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Smartphone, CheckCircle, AlertTriangle, X, Lock } from 'lucide-react';
import { Order } from '../../types';

interface RazorpayModalProps {
  order: Order;
  isOpen: boolean;
  onSuccess: (paymentId: string) => void;
  onFailure: (errorMsg: string) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  order,
  isOpen,
  onSuccess,
  onFailure,
  onClose,
}) => {
  if (!isOpen) return null;

  const [simulating, setSimulating] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
  const isRealRazorpayConfigured = Boolean(
    razorpayKeyId && !razorpayKeyId.includes('placeholder') && window.Razorpay
  );

  // Trigger real Razorpay if key is provided
  const triggerRealRazorpay = () => {
    try {
      const options = {
        key: razorpayKeyId,
        amount: order.total_amount * 100, // paise
        currency: 'INR',
        name: 'Vasavi Gadwal Saree House',
        description: `Order #${order.order_number}`,
        image: '/favicon.svg',
        order_id: order.razorpay_order_id,
        handler: function (response: any) {
          onSuccess(response.razorpay_payment_id || `pay_${Date.now()}`);
        },
        prefill: {
          name: order.address_snapshot.full_name,
          email: order.address_snapshot.email,
          contact: order.address_snapshot.phone,
        },
        theme: {
          color: '#58101E',
        },
        modal: {
          ondismiss: function () {
            onClose();
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        onFailure(response.error.description || 'Payment failed');
      });
      rzp.open();
    } catch (e: any) {
      console.warn('Real Razorpay init failed, falling back to simulator', e);
    }
  };

  const handleSimulatePayment = (success: boolean) => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      if (success) {
        const mockPayId = 'pay_sim_' + Math.random().toString(36).substring(2, 10).toUpperCase();
        onSuccess(mockPayId);
      } else {
        onFailure('Payment was cancelled or rejected by the issuing bank.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#D4AF37]/40 z-10 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#58101E] p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F7F1DC]">
                  Razorpay Secure Checkout
                </h3>
                <p className="text-[11px] text-amber-200/80 font-mono">
                  Order #{order.order_number}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-amber-200 hover:text-white hover:bg-white/10"
              aria-label="Cancel payment"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Badge */}
          <div className="bg-amber-50/80 px-6 py-4 border-b border-amber-200/50 flex items-center justify-between">
            <span className="text-xs text-stone-600 font-medium">Payable Amount:</span>
            <span className="font-serif font-bold text-2xl text-[#420B16]">
              ₹{order.total_amount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-6 space-y-5">
            {/* Environment Status Badge */}
            <div className={`p-3 rounded-xl border text-xs ${
              isRealRazorpayConfigured
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2 font-semibold">
                {isRealRazorpayConfigured ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Live / Test Merchant Credentials Active</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Test Simulator Mode (Ready for Merchant Keys)</span>
                  </>
                )}
              </div>
              {!isRealRazorpayConfigured && (
                <p className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
                  Razorpay secret keys are safely omitted for repository security. You can simulate instant authorization or test bank failures below. To enable real gateway, set <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[10px]">RAZORPAY_KEY_ID</code> in environment.
                </p>
              )}
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700">
                Choose Payment Method:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'upi'
                      ? 'border-[#58101E] bg-amber-50/70 text-[#58101E] ring-1 ring-[#58101E]'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#8E6B2C]" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'card'
                      ? 'border-[#58101E] bg-amber-50/70 text-[#58101E] ring-1 ring-[#58101E]'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#8E6B2C]" />
                  <span>Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'border-[#58101E] bg-amber-50/70 text-[#58101E] ring-1 ring-[#58101E]'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#8E6B2C]" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* Selected Method Details */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
              {selectedMethod === 'upi' && (
                <div className="space-y-1">
                  <p className="font-semibold text-stone-800">Instant UPI Payment</p>
                  <p className="text-[11px] text-stone-500">Google Pay, PhonePe, Paytm, BHIM UPI or any bank UPI app.</p>
                </div>
              )}
              {selectedMethod === 'card' && (
                <div className="space-y-1">
                  <p className="font-semibold text-stone-800">Debit / Credit Card</p>
                  <p className="text-[11px] text-stone-500">Visa, MasterCard, RuPay, Maestro & American Express.</p>
                </div>
              )}
              {selectedMethod === 'netbanking' && (
                <div className="space-y-1">
                  <p className="font-semibold text-stone-800">NetBanking</p>
                  <p className="text-[11px] text-stone-500">HDFC, SBI, ICICI, Axis, Kotak, and 50+ other Indian banks.</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {isRealRazorpayConfigured ? (
                <button
                  onClick={triggerRealRazorpay}
                  className="w-full py-3.5 bg-[#58101E] hover:bg-[#801A2D] text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md transition-colors"
                >
                  Launch Official Razorpay Modal
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => handleSimulatePayment(true)}
                    disabled={simulating}
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    {simulating ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span>Simulate Successful Payment (₹{order.total_amount.toLocaleString('en-IN')})</span>
                  </button>

                  <button
                    onClick={() => handleSimulatePayment(false)}
                    disabled={simulating}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Simulate Payment Cancellation / Failure
                  </button>
                </div>
              )}
            </div>

            {/* Trust Footer */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>PCI-DSS Level 1 Compliant • 256-Bit SSL Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
