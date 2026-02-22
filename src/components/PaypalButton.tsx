"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PaypalButton({ total }: { total: number }) {
      return (
            <PayPalScriptProvider
                  options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                        currency: "USD",
                        intent: "capture",
                  }}
            >
                  <PayPalButtons
                        createOrder={async () => {
                              const res = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_URL}/api/paypal/create-order`,
                                    {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ amount: total }),
                                    }
                              );

                              const data = await res.json();
                              return data.id; // PayPal order id
                        }}
                        onApprove={async (data) => {
                              await fetch(
                                    `${process.env.NEXT_PUBLIC_API_URL}/api/paypal/capture-order`,
                                    {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ orderID: data.orderID }),
                                    }
                              );

                              alert("Payment success 🎉");
                        }}
                        onError={(err) => {
                              console.error("PayPal error", err);
                        }}
                  />
            </PayPalScriptProvider>
      );
}