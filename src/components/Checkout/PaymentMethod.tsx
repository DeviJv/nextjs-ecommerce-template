import React, { useState } from "react";
import Image from "next/image";

interface PaymentMethodProps {
  payment: string;
  setPayment: (method: string) => void;
}

const PaymentMethod = ({ payment, setPayment }: PaymentMethodProps) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          <label
            htmlFor="paypal"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="paypal"
                id="paypal"
                className="sr-only"
                checked={true}
                onChange={() => setPayment("paypal")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${payment === "paypal"
                  ? "border-4 border-blue"
                  : "border border-gray-4"
                  }`}
              ></div>
            </div>
            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${payment === "paypal"
                ? "border-transparent bg-gray-2"
                : " border-gray-4 shadow-1"
                }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/paypal.svg" alt="paypal" width={75} height={20} />
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Paypal</p>
                </div>
              </div>
            </div>
          </label>
          <label
            htmlFor="wise"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="wise"
                id="wise"
                className="sr-only"
                onChange={() => setPayment("wise")}
                checked={payment === "wise"}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${payment === "wise"
                  ? "border-4 border-blue"
                  : "border border-gray-4"
                  }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${payment === "wise"
                ? "border-transparent bg-gray-2"
                : " border-gray-4 shadow-1"
                }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <div className="bg-[#9FE870] font-black text-[#1A1A1C] text-[13px] px-2 py-0.5 rounded-sm tracking-tight leading-none italic">
                    wise
                  </div>
                </div>

                <div className="border-l border-gray-4 pl-2.5 whitespace-nowrap">
                  <p>Wise Transfer</p>
                </div>
              </div>
            </div>
          </label>




        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
