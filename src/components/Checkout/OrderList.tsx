"use client";
import React from "react";
import Image from "next/image";

interface OrderListProps {
  cartItems: any[];
  totalPrice: number;
  shippingCost: number;
}

const OrderList: React.FC<OrderListProps> = ({ cartItems, totalPrice, shippingCost }) => {
  return (
    <div className="bg-white-true shadow-3 rounded-lg overflow-hidden border border-gray-3">
      <div className="border-b border-gray-3 py-6 px-6 sm:px-8">
        <h3 className="font-semibold text-xl text-dark">
          Order Summary
        </h3>
      </div>

      <div className="px-6 sm:px-8 py-2">
        <div className="divide-y divide-gray-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-5">
              <div className="relative h-20 w-20 flex-shrink-0">
                <div className="h-full w-full overflow-hidden rounded-md border border-gray-3 bg-gray-2 relative">
                  {item.imgs?.thumbnails?.[0] ? (
                    <Image
                      src={item.imgs.thumbnails[0]}
                      alt={item.title}
                      fill
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-2 text-dark-5">
                      No img
                    </div>
                  )}
                </div>
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-md z-1">
                  {item.quantity}
                </span>
              </div>
              
              <div className="flex flex-1 flex-col justify-center">
                <h4 className="font-medium text-dark line-clamp-1">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-dark-5">
                  Unit Price: ${(item.discountedPrice).toFixed(2)}
                </p>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-dark">
                  ${(item.discountedPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-3 pt-6 pb-8 space-y-4">
          <div className="flex items-center justify-between text-base">
            <p className="text-dark-4">Subtotal</p>
            <p className="font-medium text-dark">${totalPrice.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center justify-between text-base">
            <p className="text-dark-4">Shipping</p>
            <p className="font-medium text-dark">${shippingCost.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-3">
            <p className="text-lg font-bold text-dark">Total</p>
            <p className="text-2xl font-bold text-primary">
              ${(totalPrice + shippingCost).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
