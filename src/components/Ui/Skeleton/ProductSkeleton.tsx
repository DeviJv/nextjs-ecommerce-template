import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-1 overflow-hidden">
      <div className="relative aspect-[4/5] bg-gray-2"></div>
      
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 bg-gray-2 rounded-full"></div>
            ))}
          </div>
          <div className="w-8 h-3.5 bg-gray-2 rounded"></div>
        </div>

        <div className="w-3/4 h-5 bg-gray-2 rounded mb-1.5"></div>
        
        <div className="flex items-center gap-2">
          <div className="w-12 h-6 bg-gray-2 rounded"></div>
          <div className="w-12 h-6 bg-gray-2 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
