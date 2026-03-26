import React from "react";

const ProductListSkeleton = () => {
  return (
    <div className="animate-pulse group rounded-lg bg-white shadow-1 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative max-w-[270px] w-full min-h-[200px] sm:min-h-[350px] bg-gray-2"></div>

        <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-center justify-center sm:justify-between py-5 px-4 sm:px-7.5 lg:pl-11 lg:pr-12">
          <div>
            <div className="w-48 h-6 bg-gray-2 rounded mb-1.5"></div>
            <div className="flex items-center gap-2 font-medium text-lg">
              <div className="w-12 h-6 bg-gray-2 rounded"></div>
              <div className="w-12 h-6 bg-gray-2 rounded"></div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3.5 h-3.5 bg-gray-2 rounded-full"></div>
              ))}
            </div>
            <div className="w-8 h-3.5 bg-gray-2 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListSkeleton;
