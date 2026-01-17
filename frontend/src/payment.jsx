// PaymentSection.jsx
import { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from './api/client';  // ← your file path

export default function PaymentSection({
  amount = 150.0,
  municipality = 'Tunis',
  referenceId = 'TAX-2026-001',
  onSuccess = () => {},
}) {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardHolder: '',
    idCardNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ type: '', message: '' });

  const channels = [
    { id: 'BANK_CARD', name: 'Visa / Mastercard' },
    { id: 'Flouci',    name: 'Flouci' },
    { id: 'D17',       name: 'D17' },
    { id: 'EDINAR',    name: 'EDINAR' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!selectedChannel) {
      newErrors.channel = 'Please select a payment method';
    }

    if (!formData.idCardNumber.trim()) {
      newErrors.idCardNumber = 'ID card number is required';
    }

    if (selectedChannel?.id === 'BANK_CARD') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number required';
      if (!formData.expiry.trim()) newErrors.expiry = 'Expiry date required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV required';
      if (!formData.cardHolder.trim()) newErrors.cardHolder = 'Name on card required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmPayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setApiStatus({ type: '', message: '' });

    const payload = {
      amount,
      channel: selectedChannel.id,
      municipality,
      reference_id: referenceId,
    };

    try {
      const response = await apiFetch('/payment/simulate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Success!
      setApiStatus({
        type: 'success',
        message: response.message || 'Payment simulated successfully!',
      });

      onSuccess(response.payment);
    } catch (error) {
      setApiStatus({
        type: 'error',
        message: error.message || 'Payment initiation failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <h2 className="text-2xl font-bold">Payment</h2>
        <p className="mt-1 text-blue-100">Secure & Instant</p>
      </div>

      <div className="p-8">
        {/* Method selector */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            {channels.map(channel => (
              <button
                key={channel.id}
                type="button"
                onClick={() => setSelectedChannel(channel)}
                className={`p-5 rounded-xl border-2 text-center transition-all
                  ${selectedChannel?.id === channel.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'}`}
              >
                <CreditCard className="mx-auto mb-2 w-8 h-8 text-gray-700" />
                <div className="font-medium">{channel.name}</div>
              </button>
            ))}
          </div>
          {errors.channel && (
            <p className="mt-2 text-sm text-red-600">{errors.channel}</p>
          )}
        </div>

        {/* Form fields */}
        {selectedChannel && (
          <div className="space-y-5">
            {selectedChannel.id === 'BANK_CARD' && (
              <div className="space-y-4 p-5 bg-gray-50 rounded-xl border">
                <h4 className="font-medium text-gray-800">Card Details</h4>
                <input
                  type="text"
                  placeholder="Card number"
                  value={formData.cardNumber}
                  onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                  className={`w-full p-3 border rounded-lg ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="MM/YY" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} className={`p-3 border rounded-lg ${errors.expiry ? 'border-red-500' : ''}`} />
                  <input placeholder="CVV" maxLength={4} value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} className={`p-3 border rounded-lg ${errors.cvv ? 'border-red-500' : ''}`} />
                </div>
                <input placeholder="Name on card" value={formData.cardHolder} onChange={e => setFormData({...formData, cardHolder: e.target.value})} className={`w-full p-3 border rounded-lg ${errors.cardHolder ? 'border-red-500' : ''}`} />
              </div>
            )}

            {/* ID Card - always required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Card Number (CIN)
              </label>
              <input
                type="text"
                placeholder="12345678"
                value={formData.idCardNumber}
                onChange={e => setFormData({...formData, idCardNumber: e.target.value})}
                className={`w-full p-3 border rounded-lg ${errors.idCardNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.idCardNumber && <p className="mt-1 text-sm text-red-600">{errors.idCardNumber}</p>}
            </div>

            {/* API feedback */}
            {apiStatus.message && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                apiStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {apiStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span>{apiStatus.message}</span>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={loading || !selectedChannel}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3 ${
                loading || !selectedChannel
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={22} />
                  Processing...
                </>
              ) : (
                'Confirm Payment'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}