"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchModalContextType {
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchModalContext = createContext<SearchModalContextType | undefined>(undefined);

export const SearchModalProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  return (
    <SearchModalContext.Provider
      value={{
        isSearchModalOpen,
        openSearchModal,
        closeSearchModal,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </SearchModalContext.Provider>
  );
};

export const useSearchModal = () => {
  const context = useContext(SearchModalContext);
  if (context === undefined) {
    throw new Error("useSearchModal must be used within a SearchModalProvider");
  }
  return context;
};
