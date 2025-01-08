"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useScopedI18n } from "@/locales/client";

const HomeSlider = () => {
  const tsCope = useScopedI18n("homeslide");
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      let currentIndex =
        api.selectedScrollSnap() === sliderData.length - 1 ||
        api.selectedScrollSnap() === 0
          ? 1
          : api.selectedScrollSnap();
      setActiveIndex(currentIndex);
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const sliderData = [
    {
      image: "/slider3.jpg",
      title: tsCope("title1"),
      description: tsCope("desc1"),
    },
    {
      image: "/bg-dofus.png",
      title: tsCope("title2"),
      description: tsCope("desc2"),
    },
    // {
    //   image: "/slider6.jpg",
    //   title: "Support client premium",
    //   description: "Une équipe dédiée à votre satisfaction",
    // },
    // {
    //   image: "/fast.png",
    //   title: "Livraison ultra rapide",
    //   description: "Recevez vos Kamas en moins de 10 minutes",
    // },
  ];

  return (
    <div className="w-full flex items-center gap-4 h-[260px] sm:h-[500px] relative">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent className="w-full">
          {sliderData.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[260px] sm:h-[500px] bg-black">
                <Image
                  src={slide.image}
                  alt={`Slider-${index}`}
                  width={2000}
                  height={1000}
                  className="w-full object-cover h-[260px] object-center sm:h-[500px]"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col gap-2 items-center justify-center text-white p-4 text-center">
                  <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded">
                    {slide.description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default HomeSlider;
