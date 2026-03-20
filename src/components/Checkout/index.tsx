"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { useSelector } from "react-redux";
import { selectCartItems, selectTotalPrice } from "@/redux/features/cart-slice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        return_url: `${window.location.origin}/checkout/success`,
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout/paypal`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong during checkout.");
      }

      if (data.redirect_url) {
        // Redirect user to PayPal
        window.location.href = data.redirect_url;
      } else {
        toast.error("Failed to generate payment link.");
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
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- login box --> */}
                <Login />

                {/* <!-- billing details --> */}
                <Billing />

                {/* <!-- address box two --> */}
                {/* <Shipping /> */}

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Notes about your order, e.g. speacial notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">{item.title} <span className="text-dark-5 text-sm xl:text-base">x {item.quantity}</span></p>
                        </div>
                        <div>
                          <p className="text-dark text-right">${(item.discountedPrice * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}

                    {/* <!-- shipping cost --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Shipping Cost</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">$250.00</p>
                      </div>
                    </div>

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          ${(totalPrice + 250).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- coupon box --> */}
                <Coupon />

                {/* <!-- shipping box --> */}
                {/* <ShippingMethod /> */}

                {/* <!-- payment box --> */}
                <PaymentMethod />

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Process to Checkout"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
