"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Billing from "./Billing";
import OrderList from "./OrderList";
import { useSelector } from "react-redux";
import { selectCartItems, selectTotalPrice } from "@/redux/features/cart-slice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [shippingCost, setShippingCost] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/homepage`);
        const result = await response.json();
        if (result.success && result.data.shipping_cost !== undefined) {
          setShippingCost(Number(result.data.shipping_cost));
        }
      } catch (error) {
        console.error("Failed to fetch shipping cost:", error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Keranjang Anda kosong. Silakan belanja terlebih dahulu.");
      router.push("/");
    }
  }, [cartItems, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";
    const name = `${firstName} ${lastName}`.trim();
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";

    // New address fields
    const country = formData.get("customer_country")?.toString() || "";
    const address = formData.get("customer_address")?.toString() || "";
    const house_number = formData.get("customer_house_number")?.toString() || "";
    const ward = formData.get("customer_ward")?.toString() || "";
    const district = formData.get("customer_district")?.toString() || "";
    const city = formData.get("customer_city")?.toString() || "";
    const state = formData.get("customer_state")?.toString() || "";
    const post_code = formData.get("customer_post_code")?.toString() || "";

    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !post_code) {
      toast.error("Please fill in all required billing fields");
      return;
    }

    setLoading(true);
    try {
      // Map Redux items to API payload structure
      const itemsPayload = cartItems.map((item) => ({
        product_id: item.id,
        qty: item.quantity,
      }));

      // Check for logged-in user
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const authToken = localStorage.getItem("auth_token");

      const payload: any = {
        items: itemsPayload,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        customer_country: country,
        customer_address: address,
        customer_house_number: house_number,
        customer_ward: ward,
        customer_district: district,
        customer_city: city,
        customer_state: state,
        customer_post_code: post_code,
        // Explicitly pass return_url to Next.js frontend route
        return_url: `${window.location.origin}/checkout/success${paymentMethod === 'xendit' ? '?type=xendit' : ''}`,
        cancel_url: `${window.location.origin}/checkout/cancel`,
      };

      if (user && user.customer && user.customer.id) {
        payload.customer_id = user.customer.id;
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json"
      };

      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const endpoint = paymentMethod === "wise" ? "wise" : (paymentMethod === "xendit" ? "xendit" : "paypal");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout/${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong during checkout.");
      }

      if (paymentMethod === "wise") {
        // Redirect to success page manually with payment_number and exact amount
        router.push(`/checkout/success?type=wise&order_id=${data.order_id}&payment_number=${data.payment_number}&amount=${data.amount_to_pay}`);
      } else {
        if (data.redirect_url) {
          // Redirect user to PayPal
          window.location.href = data.redirect_url;
        } else {
          toast.error("Failed to generate payment link.");
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-16 bg-gray-2 min-h-screen">
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
              {/* <!-- checkout left: Billing and Notes --> */}
              <div className="lg:col-span-7 space-y-8">
                {/* <!-- login box --> */}
                <Login />

                {/* <!-- billing details --> */}
                <Billing />

                {/* <!-- notes box --> */}
                <div className="bg-white-true shadow-1 rounded-lg p-6 sm:p-8 border border-gray-3">
                  <h3 className="font-medium text-lg text-dark mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-dark-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    Additional Information
                  </h3>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-dark-4 mb-2">
                      Order Notes (optional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={4}
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-4 outline-none duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none transition-all"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* <!-- checkout right: Order Summary and Payment --> */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8">
                {/* <!-- order summary component --> */}
                <OrderList 
                  cartItems={cartItems} 
                  totalPrice={totalPrice} 
                  shippingCost={shippingCost} 
                />

                {/* <!-- payment box --> */}
                <div className="bg-white-true shadow-3 rounded-lg border border-gray-3 overflow-hidden">
                  <div className="border-b border-gray-3 py-5 px-6 sm:px-8">
                    <h3 className="font-semibold text-xl text-dark">
                      Payment Method
                    </h3>
                  </div>
                  <div className="p-6 sm:p-8">
                    <PaymentMethod payment={paymentMethod} setPayment={setPaymentMethod} />
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center gap-2 font-bold text-white bg-primary py-4 px-6 rounded-md hover:bg-primary-container transition-all duration-300 mt-8 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Complete Purchase"
                      )}
                    </button>
                    
                    <p className="mt-4 text-center text-xs text-dark-5">
                      By clicking the button, you agree to our Terms and Conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
