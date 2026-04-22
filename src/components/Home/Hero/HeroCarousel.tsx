"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import { HeroSlider } from "@/types/homepage";
import Link from "next/link";

const HeroCarousal = ({ sliders }: { sliders: HeroSlider[] }) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {sliders?.map((slider, index) => (
        <SwiperSlide key={index}>
          <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
            <div className="max-w-[450px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                  {slider.title.split(" ")[0]}
                </span>
                <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                  {slider.title.split(" ").slice(1).join(" ")}
                </span>
              </div>

              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                <Link href={slider.button_link}>{slider.subtitle}</Link>
              </h1>

              <p>{slider.description}</p>

              <Link
                href={slider.button_link}
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
              >
                {slider.button_text}
              </Link>
            </div>

            <div className="relative flex-1 w-full min-h-[250px] sm:min-h-[358px] rounded-xl overflow-hidden mr-0 sm:mr-10">
              <Image
                src={slider.image_url}
                alt={slider.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;

