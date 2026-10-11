import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { AddressForm } from '../components/checkout/AddressForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PhonePePaymentModal } from '../components/checkout/PhonePePaymentModal';
import { Address, Order } from '../types';
import { api } from '../services/api';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { cart, subtotal, deliveryCharge, discountAmount, totalAmount, clearCart } = useCart();

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [confirmedAddress, setConfirmedAddress] = useState<Address | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isPhonePeModalOpen, setIsPhonePeModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Load saved addresses for user
  useEffect(() => {
    if (user?.id) {
      api.getAddresses(user.id).then((list) => {
        setSavedAddresses(list);
        if (list.length > 0 && !confirmedAddress) {
          const defaultAddr = list.find((a) => a.is_default) || list[0];
          setConfirmedAddress(defaultAddr);
        }
      });
    }
  }, [user]);

  if (cart.length === 0 && !createdOrder) {
    return (
      <div className="min-h-[70vh] bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 text-center shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-2xl text-stone-900">
            No Sarees to Checkout
          </h2>
          <p className="text-xs text-stone-500">
            Please add your favorite handwoven sarees to the bag first.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full py-3 bg-[#58101E] text-white text-xs font-semibold rounded-xl"
          >
            Go to Catalogue
          </button>
        </div>
      </div>
    );
  }

  // Requirement: Checkout requires customer login
  if (!user) {
    return (
      <div className="min-h-[75vh] bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#8E6B2C] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-serif font-bold text-2xl text-stone-900">
              Customer Sign In Required
            </h2>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              To safeguard your order tracking, address book, and dispatch updates, please sign in or register your account before proceeding to secure payment.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onNavigate('account', { tab: 'login', returnTo: 'checkout' })}
              className="w-full py-3.5 bg-[#58101E] hover:bg-[#801A2D] text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md"
            >
              Sign In or Register Now
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="w-full py-2.5 text-xs text-stone-600 hover:text-stone-900"
            >
              ← Return to Shopping Bag
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle address confirmed -> create pending order -> launch payment modal
  const handleAddressSubmit = async (address: Address) => {
    setIsProcessing(true);
    setPaymentError('');

    try {
      // 1. Save or update address in user's address book
      const savedAddr = await api.saveAddress({ ...address, user_id: user.id });
      setConfirmedAddress(savedAddr);

      // 2. Server/backend creates pending order
      const order = await api.createOrder({
        userId: user.id,
        userEmail: user.email,
        userName: user.full_name,
        address: savedAddr,
        items: cart.map((item) => ({ product: item.product, quantity: item.quantity })),
        subtotal,
        deliveryCharge,
        discountAmount,
        totalAmount,
        paymentProvider: 'phonepe_upi' as any,
        paymentStatus: 'Pending',
        razorpayOrderId: 'phonepe_' + Math.random().toString(36).substring(2, 12),
      });

      setCreatedOrder(order);
      setIsProcessing(false);
      setIsPhonePeModalOpen(true);
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentError(err.message || 'Unable to prepare order. Please try again.');
    }
  };

  // Payment verified callback
  const handlePaymentSuccess = async (paymentId: string) => {
    if (!createdOrder) return;
    setIsProcessing(true);

    // Update order payment status to Paid
    const updated = await api.updatePaymentStatus(createdOrder.id, 'Paid', {
      razorpayPaymentId: paymentId,
    });

    clearCart();
    setIsPhonePeModalOpen(false);
    setIsProcessing(false);

    // Navigate to order confirmation
    onNavigate('payment-result', { orderId: updated?.id || createdOrder.id });
  };

  const handlePaymentFailure = (errorMsg: string) => {
    setPaymentError(errorMsg);
    setIsPhonePeModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#420B16]">
              Secure Checkout
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Signed in as <strong className="text-stone-800">{user.full_name}</strong> ({user.email})
            </p>
          </div>

          <button
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#58101E]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bag</span>
          </button>
        </div>

        {paymentError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{paymentError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Address Form */}
          <div className="lg:col-span-7">
            <AddressForm
              initialAddress={confirmedAddress}
              savedAddresses={savedAddresses}
              onSelectSaved={(addr) => setConfirmedAddress(addr)}
              onSubmit={handleAddressSubmit}
              isSubmitting={isProcessing}
            />
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 sticky top-24">
            <OrderSummary
              items={cart}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              discountAmount={discountAmount}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>

      {/* PhonePe QR Code Payment Modal */}
      {createdOrder && (
        <PhonePePaymentModal
          order={createdOrder}
          isOpen={isPhonePeModalOpen}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onClose={() => setIsPhonePeModalOpen(false)}
        />
      )}
    </div>
  );
};
