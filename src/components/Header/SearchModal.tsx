"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchModal } from "@/app/context/SearchModalContext";

const SearchModal = () => {
  const { isSearchModalOpen, closeSearchModal, searchQuery, setSearchQuery } = useSearchModal();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  // Fetch categories for the filter tabs
  useEffect(() => {
    if (isSearchModalOpen) {
      fetch(`${apiUrl}/api/categories`)
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error("Error fetching categories:", err));
    }
  }, [isSearchModalOpen, apiUrl]);

  // Fetch products based on search query and selected category
  useEffect(() => {
    if (isSearchModalOpen && (searchQuery.length > 0)) {
      setIsLoading(true);
      let url = `${apiUrl}/api/products?q=${searchQuery}`;
      if (selectedCategory !== "all") {
        url += `&category=${selectedCategory}`;
      }

      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          setProducts(json.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching search results:", err);
          setIsLoading(false);
        });
    } else {
      setProducts([]);
    }
  }, [searchQuery, selectedCategory, isSearchModalOpen, apiUrl]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeSearchModal();
      }
    };

    if (isSearchModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchModalOpen, closeSearchModal]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-20 bg-dark/50 backdrop-blur-sm px-4 sm:px-0">
      <div 
        ref={modalRef}
        className="w-full max-w-[800px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down"
      >
        {/* Search Header */}
        <div className="p-6 border-b border-gray-2 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              autoFocus
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-xl outline-none text-dark lg:text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={closeSearchModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh]">
          {/* Category Tabs */}
          <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-gray-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === "all" 
                ? "bg-blue text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                  selectedCategory === cat.slug 
                  ? "bg-blue text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-10 h-10 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">Searching for products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Products</h3>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop-details/${product.slug}`}
                        onClick={closeSearchModal}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                      >
                        <div className="w-16 h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={`${storageUrl}/${product.primary_image}`}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark group-hover:text-blue transition-colors leading-tight mb-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-blue">${product.price}</span>
                            <span className="text-gray-400">|</span>
                            <div className="flex items-center gap-1">
                              <svg className="fill-orange-400" width="14" height="14" viewBox="0 0 18 18">
                                <path d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z" />
                              </svg>
                              <span className="text-gray-500">{product.average_rating} ({product.reviews_count})</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-gray-1 group-hover:bg-blue group-hover:text-white transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : searchQuery.length > 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-dark mb-1">No products found</h4>
                <p className="text-gray-500">We couldn&apos;t find anything matching &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-400 italic lg:text-lg">Start typing to search for amazing plants...</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-1 flex items-center justify-center text-xs text-gray-400 uppercase tracking-widest">
          Press ESC to close
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
