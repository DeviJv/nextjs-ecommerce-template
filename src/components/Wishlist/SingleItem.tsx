import React from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

import { removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { addItemToCart } from "@/redux/features/cart-slice";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import CartToast from "../Ui/Toast/CartToast";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

const SingleItem = ({ item }: { item: any }) => {
  const { openCartModal } = useCartModalContext();
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromWishlist = () => {
    dispatch(removeItemFromWishlist(item.id));
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
    toast.custom((t) => (
        <CartToast
          action="cart"
          title={item.title}
          image={item.imgs?.previews?.[0] || item.imgs?.thumbnails?.[0] || ""}
          onViewCart={() => {
            toast.dismiss(t.id);
            openCartModal();
          }}
        />
    ));
  };

  return (
    <div className="group bg-white rounded-lg shadow-1 overflow-hidden flex flex-col h-full relative border border-transparent hover:border-gray-3 transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-1">
        <Link href={`/shop-details/${item.slug}`} className="block w-full h-full relative">
          <Image 
            src={item.imgs?.previews?.[0] || item.imgs?.thumbnails?.[0] || ""} 
            alt={item.title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        </Link>

        {/* Remove Button Overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleRemoveFromWishlist();
          }}
          aria-label="button for remove product from wishlist"
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white text-dark shadow-1 ease-out duration-200 hover:bg-red hover:text-white"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5 line-clamp-2">
          <Link href={`/shop-details/${item.slug}`}> {item.title} </Link>
        </h3>

        <div className="mt-auto pt-2">
          <span className="flex items-center gap-2 font-medium text-lg mb-4">
            <span className="text-dark">${item.price}</span>
          </span>

          <button
            onClick={() => handleAddToCart()}
            className="flex items-center justify-center w-full gap-2 font-medium text-sm text-white bg-blue py-2 px-3 rounded-lg ease-out duration-200 hover:bg-blue-dark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
