"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import toast from "react-hot-toast";

const CheckoutSuccessPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const token = searchParams.get("token");
    const orderId = searchParams.get("order_id");
    const type = searchParams.get("type");
    const paymentNumber = searchParams.get("payment_number");
    const amountToPay = searchParams.get("amount");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Processing your payment...");
    const [bankSettings, setBankSettings] = useState<any>(null);

    const refreshUserData = async () => {
        const authToken = localStorage.getItem("auth_token");
        if (authToken) {
            try {
                const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        "Accept": "application/json",
                    },
                });
                if (meRes.ok) {
                    const meData = await meRes.json();
                    localStorage.setItem("user", JSON.stringify(meData));
                }
            } catch (profileErr) {
                console.error("Failed to refresh profile:", profileErr);
            }
        }
    };

    useEffect(() => {
        if (type === "wise") {
            setStatus("success");
            setMessage("Your order has been placed. Please complete your transfer to process the order.");
            dispatch(removeAllItemsFromCart());
            refreshUserData();

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/bank`)
                .then(res => res.json())
                .then(data => setBankSettings(data))
                .catch(err => console.error("Failed to fetch bank settings:", err));
            return;
        }

        if (type === "xendit") {
            setStatus("success");
            setMessage("Your order has been placed successfully! We are verifying your payment.");
            dispatch(removeAllItemsFromCart());
            refreshUserData();
            return;
        }

        if (!token || !orderId) {
            setStatus("error");
            setMessage("Invalid payment session or missing order details.");
            return;
        }

        const capturePayment = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/paypal/capture-order`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        orderID: token,
                        order_id: orderId,
                    }),
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    setStatus("success");
                    setMessage("Your payment was successful and your order has been placed!");
                    refreshUserData();
                    dispatch(removeAllItemsFromCart());
                    toast.success("Payment successful!");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Failed to capture payment. Please contact support.");
                    toast.error("Payment capture failed.");
                }
            } catch (err: any) {
                setStatus("error");
                setMessage("An error occurred while verifying the payment.");
                toast.error("Network or verification error.");
            }
        };

        capturePayment();
    }, [token, orderId, type, dispatch]);

    const copyToClipboard = (text: string, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    return (
        <>
            <Breadcrumb title="Order Status" pages={["checkout", "success"]} />
            <section className="overflow-hidden py-10 md:py-20 bg-gray-2 min-h-[50vh] flex items-center justify-center">
                <div className="max-w-[700px] w-full mx-auto px-4 sm:px-8 xl:px-0 text-center">
                    <div className="bg-white shadow-1 rounded-2xl p-6 sm:p-10 md:p-12">

                        {status === "loading" && (
                            <div className="animate-pulse py-10">
                                <h2 className="text-2xl font-semibold mb-4 text-dark">Please wait...</h2>
                                <p className="text-dark-5">{message}</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div>
                                <div className="w-20 h-20 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                                    <svg className="w-10 h-10 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-dark">Order Confirmed!</h2>
                                <p className="text-dark-4 mb-8 text-sm md:text-base leading-relaxed">{message}</p>

                                {type === "wise" && bankSettings && (
                                    <div className="text-left bg-gray-50/50 p-5 md:p-8 rounded-2xl border border-gray-200 mb-8 shadow-sm">
                                        <h3 className="font-semibold text-lg text-dark mb-5 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                            Transfer Instructions
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            {/* Amount */}
                                            {amountToPay && (
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                                                    <span className="text-dark-5 font-medium text-sm">Amount to Transfer</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl font-bold text-dark">${parseFloat(amountToPay).toFixed(2)}</span>
                                                        <button onClick={() => copyToClipboard(amountToPay, "Amount")} className="text-blue hover:text-blue-dark bg-blue/10 p-2 rounded-lg transition-colors" title="Copy Amount">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Reference */}
                                            {paymentNumber && (
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                                                    <span className="text-dark-5 font-medium text-sm">Reference Code <span className="text-red/80 ml-1 text-xs px-2 py-0.5 bg-red/10 rounded-full font-bold">REQUIRED</span></span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-base font-bold text-dark tracking-wide bg-white px-3 py-1 rounded-md border border-gray-200">{paymentNumber}</span>
                                                        <button onClick={() => copyToClipboard(paymentNumber, "Reference Code")} className="text-blue hover:text-blue-dark bg-blue/10 p-2 rounded-lg transition-colors" title="Copy Reference">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Account Number */}
                                            {bankSettings.account_number && (
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                                                    <span className="text-dark-5 font-medium text-sm">Account Number / IBAN</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-base font-semibold text-dark break-all">{bankSettings.account_number}</span>
                                                        <button onClick={() => copyToClipboard(bankSettings.account_number, "Account Number")} className="text-blue hover:text-blue-dark bg-blue/10 p-2 text-shrink-0 rounded-lg transition-colors" title="Copy Account Number">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bank Detail List */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                                {bankSettings.bank_name && (
                                                    <div>
                                                        <span className="block text-dark-5 text-xs uppercase tracking-wider font-semibold mb-1">Bank Name</span>
                                                        <span className="text-dark font-medium text-sm">{bankSettings.bank_name}</span>
                                                    </div>
                                                )}
                                                {bankSettings.account_name && (
                                                    <div>
                                                        <span className="block text-dark-5 text-xs uppercase tracking-wider font-semibold mb-1">Account Holder Name</span>
                                                        <span className="text-dark font-medium text-sm">{bankSettings.account_name}</span>
                                                    </div>
                                                )}
                                                {bankSettings.swift_code && (
                                                    <div>
                                                        <span className="block text-dark-5 text-xs uppercase tracking-wider font-semibold mb-1">SWIFT / BIC Code</span>
                                                        <span className="text-dark font-medium text-sm">{bankSettings.swift_code}</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Account Address Details */}
                                            {(bankSettings.bank_address || bankSettings.city || bankSettings.province) && (
                                                <div className="pt-4 mt-2 border-t border-gray-200">
                                                    <span className="block text-dark-5 text-xs uppercase tracking-wider font-semibold mb-2">Account Holder Address / Details</span>
                                                    <div className="text-sm text-dark font-medium leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                                                        {bankSettings.bank_address && <p>{bankSettings.bank_address}</p>}
                                                        {(bankSettings.ward || bankSettings.sub_district) && (
                                                            <p>
                                                                {bankSettings.ward}{bankSettings.ward && bankSettings.sub_district ? ', ' : ''}{bankSettings.sub_district}
                                                            </p>
                                                        )}
                                                        {(bankSettings.city || bankSettings.province || bankSettings.zip_code) && (
                                                            <p>
                                                                {bankSettings.city}{bankSettings.city && bankSettings.province ? ', ' : ''}{bankSettings.province} {bankSettings.zip_code}
                                                            </p>
                                                        )}
                                                        {bankSettings.country && <p>{bankSettings.country}</p>}
                                                        {bankSettings.phone_number && (
                                                            <p className="mt-2 pt-2 border-t border-dashed border-gray-200">
                                                                Phone: {bankSettings.phone_number}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Instructions */}
                                            {bankSettings.instructions && (
                                                <div className="pt-4 mt-2 border-t border-gray-200">
                                                    <span className="block text-dark-5 text-xs uppercase tracking-wider font-semibold mb-2">Instructions</span>
                                                    <p className="text-sm text-dark-4 italic leading-relaxed border-l-2 border-blue pl-4 py-1">{bankSettings.instructions}</p>
                                                </div>
                                            )}

                                            {/* Important Notice */}
                                            <div className="pt-2">
                                                <div className="bg-blue/10 border border-blue/20 p-4 rounded-xl flex items-start gap-3">
                                                    <svg className="w-6 h-6 text-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    <p className="text-sm text-blue-dark leading-relaxed">
                                                        Setelah Anda melakukan transfer, admin kami akan memverifikasi pembayaran Anda secara manual. <strong>Email konfirmasi dan bukti pesanan</strong> akan dikirimkan otomatis ke email Anda setelah pembayaran divalidasi.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => router.push("/shop-with-sidebar")}
                                    className="inline-flex font-semibold text-white bg-blue py-3.5 px-10 rounded-xl transition-all hover:bg-blue-dark hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto items-center justify-center"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="py-8">
                                <div className="w-20 h-20 mx-auto bg-red/10 text-red rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold mb-4 text-dark">Payment Error</h2>
                                <p className="text-red mb-8">{message}</p>
                                <button
                                    onClick={() => router.push("/checkout")}
                                    className="inline-flex font-medium text-white bg-blue py-3 px-8 rounded-xl transition-all hover:bg-blue-dark hover:shadow-lg"
                                >
                                    Return to Checkout
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </section>
        </>
    );
};

export default CheckoutSuccessPage;

