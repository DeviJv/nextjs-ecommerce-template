"use client";
import React, { createContext, useContext, useState } from "react";

interface PreviewSliderType {
  isModalPreviewOpen: boolean;
  previewImages: string[];
  activeIndex: number;
  openPreviewModal: (images?: string[], index?: number) => void;
  closePreviewModal: () => void;
}

const PreviewSlider = createContext<PreviewSliderType | undefined>(undefined);

export const usePreviewSlider = () => {
  const context = useContext(PreviewSlider);
  if (!context) {
    throw new Error("usePreviewSlider must be used within a ModalProvider");
  }
  return context;
};

export const PreviewSliderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalPreviewOpen, setIsModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const openPreviewModal = (images: string[] = [], index: number = 0) => {
    setPreviewImages(images);
    setActiveIndex(index);
    setIsModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PreviewSlider.Provider
      value={{ 
        isModalPreviewOpen, 
        previewImages, 
        activeIndex, 
        openPreviewModal, 
        closePreviewModal 
      }}
    >
      {children}
    </PreviewSlider.Provider>
  );
};
