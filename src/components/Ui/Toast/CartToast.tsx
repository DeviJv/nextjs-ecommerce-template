"use client";

import React from "react";

type Props = {
  action: string;
  title: string;
  image: string;
  onViewCart?: () => void;
};

const CartToast = ({ action,title, image, onViewCart }: Props) => {
  return (
    <div className="bg-white shadow-xl rounded-xl p-4 flex items-center gap-4 border-b-gray-7 min-w-[320px]">
      {/* image */}
      <img
        src={image}
        alt={title}
        className="w-14 h-14 object-cover rounded-lg"
      />

      {/* text */}
      <div className="flex-1">
        <p className="font-semibold text-dark leading-tight">
          {title}
        </p>
        <p className="text-sm text-gray-500">
          Added to {action}
        </p>
      </div>

      {/* action */}
      <button
        onClick={onViewCart}
        className="text-sm font-medium text-blue hover:underline"
      >
        View
      </button>
    </div>
  );
};

export default CartToast;