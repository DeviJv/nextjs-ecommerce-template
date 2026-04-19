import React from "react";
import { Review } from "@/types/review";
import Link from "next/link";
import Image from "next/image";

const SingleItem = ({ review }: { review: Review }) => {
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const getColor = (name: string) => {
    const colors = [
      "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const bgColor = getColor(review.user.name);
  const initials = getInitials(review.user.name);

  return (
    <div className="shadow-testimonial bg-white rounded-[10px] py-7.5 px-4 sm:px-8.5 m-1 h-full flex flex-col">
      <div className="flex items-center gap-1 mb-5">
        {[...Array(5)].map((_, index) => (
          <Image
            key={index}
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={15}
            height={15}
            className={index < review.rating ? "" : "opacity-20 grayscale"}
          />
        ))}
      </div>

      <p className="text-dark mb-6 flex-grow">{review.comment}</p>

      <div className="flex items-center gap-4 mt-auto">
        <div 
          className="w-12.5 h-12.5 rounded-full flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </div>

        <div>
          <h3 className="font-medium text-dark">{review.user.name}</h3>
          <Link 
            href={`/shop-details/${review.product.slug}`}
            className="text-custom-sm hover:text-primary transition-colors duration-200"
          >
            {review.product.name}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
