"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const PaymentModal = ({ isOpen, onClose, order }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "wise" | "xendit">("paypal");
  const [loading, setLoading] = useState(false);
  const [wiseDetails, setWiseDetails] = useState<any>(null);

  // Pre-select the last payment method used for this order, if any
  useEffect(() => {
    if (order?.payments?.length > 0) {
      const lastMethod = order.payments[order.payments.length - 1]?.method;
      if (lastMethod && ["paypal", "wise", "xendit"].includes(lastMethod)) {
        setPaymentMethod(lastMethod);
      }
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const safeParse = (val: any) => {
    const num = parseFloat(val?.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? 0 : num;
  };
  const grandTotal = (safeParse(order.subtotal) + 250).toFixed(2);
  const currency = order.currency || "USD";

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const handleProceed = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Please log in to continue.");
      return;
    }

    setLoading(true);
    setWiseDetails(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}/regenerate-payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            payment_method: paymentMethod,
            return_url: `${window.location.origin}/checkout/success${paymentMethod === "xendit" ? "?type=xendit" : ""}`,
            cancel_url: `${window.location.origin}/my-account`,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to regenerate payment.");
      }

      if (data.method === "wise") {
        // Show bank transfer details inline
        setWiseDetails(data);
      } else if (data.redirect_url) {
        // Redirect to PayPal or Xendit
        window.location.href = data.redirect_url;
      } else {
        toast.error("No payment link generated.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-dark/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue to-blue-dark px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-xl">Complete Payment</h3>
            <p className="text-white/70 text-sm mt-0.5">Order #{order.order_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="rounded-xl border border-gray-3 bg-gray-1 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-dark-5 mb-1">Total to Pay</p>
              <p className="text-2xl font-black text-dark">{currency} {grandTotal}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10 text-orange">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
          </div>

          {/* Payment Method Selector */}
          {!wiseDetails && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-dark-4 uppercase tracking-wider">
                {order.payments?.length > 0 ? "Change or Keep Payment Method" : "Select Payment Method"}
              </p>

              {/* PayPal */}
              <label
                className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  paymentMethod === "paypal"
                    ? "border-blue bg-blue/5"
                    : "border-gray-3 hover:border-gray-4 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="pay_method"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="accent-blue"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003087]/10">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="#003087">
                      <path d="M7.144 19.532l1.049-5.751c.11-.606.691-1.042 1.327-1.042h5.255c2.531 0 4.505-2.08 4.715-4.591.158-1.913-.759-3.558-2.285-4.482C16.627 2.979 15.604 2.75 14.5 2.75H7c-.728 0-1.356.51-1.48 1.226l-2.5 14.77c-.066.39.232.756.636.756h3.07l-.582-0.97z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">PayPal / Credit Card</p>
                    <p className="text-xs text-dark-5">Pay securely via PayPal</p>
                  </div>
                </div>
              </label>

              {/* Wise */}
              <label
                className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  paymentMethod === "wise"
                    ? "border-blue bg-blue/5"
                    : "border-gray-3 hover:border-gray-4 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="pay_method"
                  value="wise"
                  checked={paymentMethod === "wise"}
                  onChange={() => setPaymentMethod("wise")}
                  className="accent-blue"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10 text-green">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">Bank Transfer (Wise)</p>
                    <p className="text-xs text-dark-5">Manual transfer — verified by admin</p>
                  </div>
                </div>
              </label>

              {/* Xendit */}
              <label
                className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  paymentMethod === "xendit"
                    ? "border-blue bg-blue/5"
                    : "border-gray-3 hover:border-gray-4 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="pay_method"
                  value="xendit"
                  checked={paymentMethod === "xendit"}
                  onChange={() => setPaymentMethod("xendit")}
                  className="accent-blue"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/10 text-purple-600">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">Xendit (QRIS / VA / E-Wallet)</p>
                    <p className="text-xs text-dark-5">Local Indonesian payment methods</p>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Wise Transfer Details (shown after Wise is confirmed) */}
          {wiseDetails && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green font-bold">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Transfer Details Ready
              </div>

              <div className="rounded-xl border border-gray-3 bg-gray-1 p-5 space-y-3">
                {/* Amount */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-3">
                  <span className="text-dark-5 text-sm font-medium">Amount</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-dark">
                      ${parseFloat(wiseDetails.amount_to_pay).toFixed(2)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(wiseDetails.amount_to_pay, "Amount")}
                      className="text-blue bg-blue/10 p-1.5 rounded-lg hover:bg-blue/20 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Reference */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-3">
                  <span className="text-dark-5 text-sm font-medium">
                    Reference Code
                    <span className="ml-2 text-[10px] font-bold text-red bg-red/10 px-2 py-0.5 rounded-full">REQUIRED</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-dark text-sm bg-white px-2 py-1 rounded border border-gray-3">
                      {wiseDetails.payment_number}
                    </span>
                    <button
                      onClick={() => copyToClipboard(wiseDetails.payment_number, "Reference Code")}
                      className="text-blue bg-blue/10 p-1.5 rounded-lg hover:bg-blue/20 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Bank Info */}
                {wiseDetails.bank_settings && (
                  <div className="space-y-2 text-sm">
                    {wiseDetails.bank_settings.account_number && (
                      <div className="flex items-center justify-between">
                        <span className="text-dark-5 font-medium">Account / IBAN</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-dark">{wiseDetails.bank_settings.account_number}</span>
                          <button
                            onClick={() => copyToClipboard(wiseDetails.bank_settings.account_number, "Account Number")}
                            className="text-blue bg-blue/10 p-1.5 rounded-lg hover:bg-blue/20 transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    {wiseDetails.bank_settings.bank_name && (
                      <div className="flex items-center justify-between">
                        <span className="text-dark-5 font-medium">Bank Name</span>
                        <span className="font-bold text-dark">{wiseDetails.bank_settings.bank_name}</span>
                      </div>
                    )}
                    {wiseDetails.bank_settings.account_name && (
                      <div className="flex items-center justify-between">
                        <span className="text-dark-5 font-medium">Account Holder</span>
                        <span className="font-bold text-dark">{wiseDetails.bank_settings.account_name}</span>
                      </div>
                    )}
                    {wiseDetails.bank_settings.swift_code && (
                      <div className="flex items-center justify-between">
                        <span className="text-dark-5 font-medium">SWIFT / BIC</span>
                        <span className="font-bold text-dark">{wiseDetails.bank_settings.swift_code}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-blue/5 border border-blue/20 rounded-xl p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-dark leading-relaxed">
                  Include the <strong>Reference Code</strong> in your transfer description. Admin will verify and activate your order after payment is confirmed.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-xl border border-gray-3 text-dark font-semibold hover:bg-gray-1 transition-colors text-sm"
              >
                Done — I&apos;ve Noted the Details
              </button>
            </div>
          )}

          {/* Proceed Button (only when not showing wise details) */}
          {!wiseDetails && (
            <button
              onClick={handleProceed}
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-blue text-white font-bold hover:bg-blue-dark transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Proceed to Payment
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
