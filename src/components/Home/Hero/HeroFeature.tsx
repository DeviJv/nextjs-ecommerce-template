import React from "react";
import Image from "next/image";
import { Feature } from "@/types/homepage";

const HeroFeature = ({ features }: { features: Feature[] }) => {
  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="flex flex-wrap items-center justify-between gap-7.5 xl:gap-12.5 mt-10">
        {features?.map((item, key) => (
          <div className="flex items-center gap-4" key={key}>
            <Image src={item.icon_url} alt={item.title} width={40} height={41} />

            <div>
              <h3 className="font-medium text-lg text-dark">{item.title}</h3>
              <p className="text-sm">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;

