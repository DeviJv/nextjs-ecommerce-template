import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import { HomepageData } from "@/types/homepage";
import Link from "next/link";

const Hero = ({ data }: { data: HomepageData }) => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-gray">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white-true overflow-hidden shadow-ambient">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel sliders={data?.hero_sliders} />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              <div className="w-full relative rounded-[10px] bg-white-true p-4 sm:p-7.5 shadow-ambient">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-serif font-semibold text-dark text-xl mb-20 line-clamp-2">
                      <Link href={data?.hero_top_right_link || "#"}>
                        {data?.hero_top_right_title}
                      </Link>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5 capitalize">
                        {data?.hero_top_right_subtitle}
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-red">
                          ${data?.hero_top_right_price}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-end">
                    <Image
                      src={data?.hero_top_right_image_url}
                      alt={data?.hero_top_right_title}
                      width={123}
                      height={161}
                      className="object-contain max-h-[161px]"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full relative rounded-[10px] bg-white-true p-4 sm:p-7.5 shadow-ambient">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-serif font-semibold text-dark text-xl mb-20 line-clamp-2">
                      <Link href={data?.hero_bottom_right_link || "#"}>
                        {data?.hero_bottom_right_title}
                      </Link>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5 capitalize">
                        {data?.hero_bottom_right_subtitle}
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-red">
                          ${data?.hero_bottom_right_price}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex justify-end">
                    <Image
                      src={data?.hero_bottom_right_image_url}
                      alt={data?.hero_bottom_right_title}
                      width={123}
                      height={161}
                      className="object-contain max-h-[161px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature features={data?.features} />
    </section>
  );
};

export default Hero;

