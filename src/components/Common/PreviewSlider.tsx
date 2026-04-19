"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useEffect } from "react";
import "swiper/css/navigation";
import "swiper/css";
import Image from "next/image";

import { usePreviewSlider } from "@/app/context/PreviewSliderContext";

const PreviewSliderModal = () => {
  const { closePreviewModal, isModalPreviewOpen, previewImages, activeIndex } = usePreviewSlider();
  const sliderRef = useRef<any>(null);

  // Update swiper position when activeIndex changes or modal opens
  useEffect(() => {
    if (isModalPreviewOpen && sliderRef.current && activeIndex !== undefined) {
      sliderRef.current.swiper.slideTo(activeIndex, 0);
    }
  }, [isModalPreviewOpen, activeIndex]);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  if (!isModalPreviewOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999999] flex flex-col justify-center items-center bg-[#000000F2] backdrop-blur-sm transition-all duration-300">
      {/* Header / Close button */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="text-white text-sm font-medium">
          {previewImages.length > 0 && `Previewing ${activeIndex + 1} of ${previewImages.length}`}
        </div>
        <button
          onClick={closePreviewModal}
          aria-label="Close modal"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:rotate-90 duration-300"
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="relative w-full max-w-5xl px-4 sm:px-10 h-[70vh] flex items-center justify-center">
        {/* Navigation Buttons */}
        {previewImages.length > 1 && (
          <>
            <button
              className="absolute left-4 sm:left-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full z-10 transition-all"
              onClick={handlePrev}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              className="absolute right-4 sm:right-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full z-10 transition-all"
              onClick={handleNext}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        <Swiper 
          ref={sliderRef} 
          slidesPerView={1} 
          spaceBetween={40}
          className="w-full h-full flex items-center"
        >
          {previewImages.map((img, idx) => (
            <SwiperSlide key={idx} className="flex justify-center items-center">
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={img}
                  alt={`Preview ${idx}`}
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Thumbnail Bar */}
      {previewImages.length > 1 && (
        <div className="absolute bottom-10 left-0 w-full flex justify-center gap-3 px-6 overflow-x-auto no-scrollbar">
          {previewImages.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => sliderRef.current?.swiper.slideTo(idx)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeIndex ? "border-blue scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"}`}
            >
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewSliderModal;
