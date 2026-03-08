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

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Processing your payment...");

    useEffect(() => {
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

                    // Refresh user profile if logged in to sync updated customer data
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

                    // Clear the shopping cart
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
    }, [token, orderId, dispatch]);

    return (
        <>
            <Breadcrumb title="Order Status" pages={["checkout", "success"]} />
            <section className="overflow-hidden py-20 bg-gray-2 h-full min-h-[50vh] flex items-center justify-center">
                <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0 text-center">
                    <div className="bg-white shadow-1 rounded-[10px] p-8 sm:p-12">

                        {status === "loading" && (
                            <div className="animate-pulse">
                                <h2 className="text-2xl font-semibold mb-4 text-dark">Please wait...</h2>
                                <p className="text-dark-5">{message}</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div>
                                <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-semibold mb-4 text-dark">Order Confirmed!</h2>
                                <p className="text-dark-4 mb-8">{message}</p>
                                <button
                                    onClick={() => router.push("/")}
                                    className="inline-flex font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}

                        {status === "error" && (
                            <div>
                                <div className="w-20 h-20 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-semibold mb-4 text-dark">Payment Error</h2>
                                <p className="text-red mb-8">{message}</p>
                                <button
                                    onClick={() => router.push("/checkout")}
                                    className="inline-flex font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark"
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
