"use client";
import React, { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  name: string;
  required?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  name,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && (
        <label htmlFor={name} className="block mb-2.5">
          {label} {required && <span className="text-red">*</span>}
        </label>
      )}
      
      <div 
        className={`w-full bg-white-true rounded-md border border-gray-3 text-dark-4 py-3 px-5 duration-200 cursor-pointer flex justify-between items-center ${
          isOpen ? "border-primary ring-4 ring-primary/5" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-dark" : "text-dark-5"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`fill-current transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.41469 5.03569L7.76749 10.2635L8.0015 10.492L8.23442 10.2623L13.5844 4.98735"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <input type="hidden" name={name} value={value} />

      {isOpen && (
        <div className="absolute z-[9999] top-full left-0 w-full mt-2 bg-white-true border border-gray-3 rounded-md shadow-2 max-h-[300px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-gray-3 bg-gray-2Sticky top-0">
            <input
              type="text"
              autoFocus
              placeholder="Search..."
              className="w-full bg-white px-3 py-2 rounded border border-gray-3 outline-none focus:border-primary text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-5 py-3 cursor-pointer hover:bg-gray-1 transition-colors text-sm ${
                    value === option.value ? "bg-primary text-white hover:bg-primary-container" : "text-dark"
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-dark-5 text-sm">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
