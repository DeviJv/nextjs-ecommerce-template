import React, { useState } from "react";
import Image from "next/image";

interface PaymentMethodProps {
  payment: string;
  setPayment: (method: string) => void;
}

const PaymentMethod = ({ payment, setPayment }: PaymentMethodProps) => {
  return (
    <div className="space-y-4">
      <label
        htmlFor="paypal"
        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
          payment === "paypal"
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-gray-3 bg-white-true hover:border-gray-4"
        }`}
        onClick={() => setPayment("paypal")}
      >
        <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-3 transition-colors">
          {payment === "paypal" && (
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-in zoom-in duration-300"></div>
          )}
          <input
            type="radio"
            name="payment"
            id="paypal"
            className="sr-only"
            checked={payment === "paypal"}
            readOnly
          />
        </div>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="h-8 w-20 relative transition-all duration-300 transform group-hover:scale-110">
            <Image 
              src="/images/checkout/paypal.svg" 
              alt="paypal" 
              fill 
              className="object-contain"
            />
          </div>
          <span className="font-medium text-dark">Paypal</span>
        </div>
      </label>

      <label
        htmlFor="wise"
        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
          payment === "wise"
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-gray-3 bg-white-true hover:border-gray-4"
        }`}
        onClick={() => setPayment("wise")}
      >
        <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-3 transition-colors">
          {payment === "wise" && (
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-in zoom-in duration-300"></div>
          )}
          <input
            type="radio"
            name="payment"
            id="wise"
            className="sr-only"
            checked={payment === "wise"}
            readOnly
          />
        </div>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-[#9FE870] font-black text-[#1A1A1C] text-[10px] uppercase px-2 py-1 rounded-sm tracking-widest leading-none italic shadow-sm">
            wise
          </div>
          <span className="font-medium text-dark">Wise Transfer</span>
        </div>
      </label>
    </div>
  );
};

export default PaymentMethod;
