import React, { useState, useEffect } from 'react';
import { Address } from '../../types';
import { Check, MapPin, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react';

interface AddressFormProps {
  initialAddress?: Address | null;
  savedAddresses?: Address[];
  onSelectSaved?: (address: Address) => void;
  onSubmit: (address: Address) => void;
  isSubmitting?: boolean;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'Karnataka',
  'Maharashtra',
  'Kerala',
  'Gujarat',
  'Delhi',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Madhya Pradesh',
  'Bihar',
  'Punjab',
  'Haryana',
  'Odisha',
  'Assam',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
  'Himachal Pradesh',
  'Goa',
  'Jammu & Kashmir',
  'Puducherry',
  'Chandigarh',
];

export const AddressForm: React.FC<AddressFormProps> = ({
  initialAddress,
  savedAddresses = [],
  onSelectSaved,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<Address>({
    id: initialAddress?.id || '',
    full_name: initialAddress?.full_name || '',
    phone: initialAddress?.phone || '',
    email: initialAddress?.email || '',
    house_number: initialAddress?.house_number || '',
    building_name: initialAddress?.building_name || '',
    street: initialAddress?.street || '',
    locality: initialAddress?.locality || '',
    landmark: initialAddress?.landmark || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || 'Telangana',
    pincode: initialAddress?.pincode || '',
    country: initialAddress?.country || 'India',
    is_default: initialAddress?.is_default || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [useExisting, setUseExisting] = useState(savedAddresses.length > 0);

  useEffect(() => {
    if (initialAddress) {
      setFormData(initialAddress);
    }
  }, [initialAddress]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.full_name.trim()) errs.full_name = 'Full name is required';
    
    // Indian Phone: 10 digits
    const phoneClean = formData.phone.replace(/\D/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      errs.phone = 'Valid 10-digit Indian phone number is required';
    }

    if (!formData.email || !formData.email.includes('@')) {
      errs.email = 'Valid email is required for dispatch notifications';
    }

    if (!formData.house_number.trim()) errs.house_number = 'House / Flat number is required';
    if (!formData.street.trim()) errs.street = 'Street name is required';
    if (!formData.locality.trim()) errs.locality = 'Area / Locality is required';
    if (!formData.city.trim()) errs.city = 'City / Town is required';
    if (!formData.state) errs.state = 'State selection is required';

    // Indian PIN code: 6 digits
    const pinClean = formData.pincode.replace(/\D/g, '');
    if (!pinClean || pinClean.length !== 6) {
      errs.pincode = 'Valid 6-digit Indian PIN code is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2.5">
          <MapPin className="w-5 h-5 text-[#8E6B2C]" />
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Delivery Address
          </h3>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5" />
          Direct WhatsApp Order
        </span>
      </div>

      {/* Select from existing addresses if available */}
      {savedAddresses.length > 0 && (
        <div className="space-y-3 pb-4 border-b border-stone-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Choose a Saved Delivery Address
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => {
                  setFormData(addr);
                  if (onSelectSaved) onSelectSaved(addr);
                }}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  formData.id === addr.id
                    ? 'border-[#58101E] bg-amber-50/60 ring-1 ring-[#58101E]'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                }`}
              >
                <div className="flex justify-between items-start font-semibold text-stone-900 mb-1">
                  <span>{addr.full_name}</span>
                  {addr.is_default && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-stone-600 line-clamp-2">
                  {addr.house_number}, {addr.street}, {addr.locality}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-stone-500 font-mono mt-1">📞 {addr.phone}</p>
              </div>
            ))}
          </div>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  id: '',
                  full_name: '',
                  phone: '',
                  email: '',
                  house_number: '',
                  building_name: '',
                  street: '',
                  locality: '',
                  landmark: '',
                  city: '',
                  state: 'Telangana',
                  pincode: '',
                  country: 'India',
                  is_default: false,
                });
              }}
              className="text-xs text-[#58101E] font-semibold hover:underline"
            >
              + Add a new address
            </button>
          </div>
        </div>
      )}

      {/* Address Form Inputs */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact info row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Smt. Radhika Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
            {errors.full_name && <p className="text-[11px] text-red-600 mt-1">{errors.full_name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Mobile Number (10 digits) *
            </label>
            <input
              type="tel"
              name="phone"
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
            {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="for order tracking"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
            {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Address Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              House / Flat / Plot No. *
            </label>
            <input
              type="text"
              name="house_number"
              value={formData.house_number}
              onChange={handleChange}
              placeholder="e.g. Flat 402, Block B"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
            {errors.house_number && <p className="text-[11px] text-red-600 mt-1">{errors.house_number}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Building / Apartment Name (Optional)
            </label>
            <input
              type="text"
              name="building_name"
              value={formData.building_name || ''}
              onChange={handleChange}
              placeholder="e.g. Sri Balaji Enclave"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>
        </div>

        {/* Address Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Street / Road Name *
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="e.g. Temple Road"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
            {errors.street && <p className="text-[11px] text-red-600 mt-1">{errors.street}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Area / Locality *
            </label>
            <input
              type="text"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              placeholder="e.g. Banjara Hills"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
            {errors.locality && <p className="text-[11px] text-red-600 mt-1">{errors.locality}</p>}
          </div>
        </div>

        {/* Address Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Landmark (Optional)
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark || ''}
              onChange={handleChange}
              placeholder="e.g. Near Shiva Temple"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              City / Town *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Hyderabad"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
            {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              State *
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            {errors.state && <p className="text-[11px] text-red-600 mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              PIN Code (6 digits) *
            </label>
            <input
              type="text"
              name="pincode"
              maxLength={6}
              value={formData.pincode}
              onChange={handleChange}
              placeholder="e.g. 500034"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
            {errors.pincode && <p className="text-[11px] text-red-600 mt-1">{errors.pincode}</p>}
          </div>
        </div>

        {/* Save Address Checkbox */}
        <div className="pt-2 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default || false}
              onChange={handleChange}
              className="rounded text-[#58101E] focus:ring-[#C5A059] h-4 w-4"
            />
            <span>Save this as my default delivery address</span>
          </label>

          <span className="text-[11px] text-stone-400">
            Country: India (Standard Domestic Delivery)
          </span>
        </div>

        {/* Submit to WhatsApp */}
        <div className="pt-4 space-y-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>{isSubmitting ? 'Placing Order & Preparing WhatsApp...' : 'Confirm Address & Place Order via WhatsApp'}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
          <p className="text-[11px] text-center text-stone-500">
            ✨ No online payment gateway needed. Submitting this form creates your order and redirects directly to WhatsApp to confirm details.
          </p>
        </div>
      </form>
    </div>
  );
};
