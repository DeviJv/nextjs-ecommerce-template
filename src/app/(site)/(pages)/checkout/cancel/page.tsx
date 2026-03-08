"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";

const CheckoutCancelPage = () => {
    const router = useRouter();

    return (
        <>
            <Breadcrumb title="Payment Cancelled" pages={["checkout", "cancel"]} />
            <section className="overflow-hidden py-20 bg-gray-2 h-full min-h-[50vh] flex items-center justify-center">
                <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0 text-center">
                    <div className="bg-white shadow-1 rounded-[10px] p-8 sm:p-12">
                        <div className="w-20 h-20 mx-auto bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-semibold mb-4 text-dark">Payment Cancelled</h2>
                        <p className="text-dark-4 mb-8">You have cancelled the PayPal payment. Your order has not been placed.</p>
                        <button
                            onClick={() => router.push("/checkout")}
                            className="inline-flex font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark"
                        >
                            Return to Checkout
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CheckoutCancelPage;
