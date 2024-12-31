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

const HomeSlider = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  //   console.log(api);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      let currentIndex: number =
        api.selectedScrollSnap() === images.length - 1 ||
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

  const images = [
    "/slider2.jpg",
    "/slider5.jpg",
    "/slider6.jpg",
    "/slider3.jpg",
    "/slider4.jpg",
  ];

  return (
    <div className="w-full flex items-center gap-4 h-[260px] sm:h-[420px]">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent className="w-full">
          {images.map((im, index) => (
            <CarouselItem key={index}>
              <div className="w-full flex items-center gap-4 h-[260px] sm:h-[420px]">
                {/* <div className="max-sm:hidden">
                  <Image
                    src={images[activeIndex - 1]}
                    alt={`Slider-${activeIndex - 1}`}
                    width={200}
                    height={200}
                    className="w-full max-w-36 object-cover h-[260px] sm:h-[420px] blur-[2px]"
                  />
                </div> */}
                <Image
                  src={im}
                  alt={`Slider-${index}`}
                  width={2000}
                  height={1000}
                  className="w-full object-cover h-[260px] sm:h-[450px]"
                />
                {/* <div className="max-sm:hidden">
                  <Image
                    src={images[activeIndex + 1]}
                    alt={`Slider-${activeIndex + 1}`}
                    width={200}
                    height={200}
                    className="w-full max-w-36 object-cover h-[260px] sm:h-[420px] blur-[2px]"
                  />
                </div> */}
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
