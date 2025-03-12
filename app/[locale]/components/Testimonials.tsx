"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  UserCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Image from "next/image";
import Link from "next/link";
import { Review, maskDisplayName } from "@/lib/utils";
import { trustpilotReviews } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";

const Testimonials = () => {
  const tScope = useScopedI18n("testimonials");
  const tScope2 = useScopedI18n("exchange");
  const tScope2Reviews = useScopedI18n("reviews");
  const [reviews, setReviews] = useState<Review[]>(trustpilotReviews);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const totalGroups = Math.ceil(reviews.length / 4);

  useEffect(() => {
    if (!reviews.length || !isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentGroupIndex((prev) => (prev + 1) % totalGroups);
    }, 10000);

    return () => clearInterval(interval);
  }, [reviews, isAutoPlay, totalGroups]);

  const navigateGroup = (direction: "prev" | "next") => {
    setIsAutoPlay(false);
    setCurrentGroupIndex((prev) => {
      if (direction === "prev") {
        return prev === 0 ? totalGroups - 1 : prev - 1;
      }
      return (prev + 1) % totalGroups;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const UserAvatar = ({
    imageUrl,
    name,
  }: {
    imageUrl?: string;
    name: string;
  }) => (
    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-orange-500  to-[#2a2d30] p-0.5">
      <div className="w-full h-full rounded-full overflow-hidden bg-[#363A3D]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-lg font-semibold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const displayedReviews = reviews.slice(
    currentGroupIndex * 4,
    currentGroupIndex * 4 + 4
  );

  const HeaderSection = () => (
    <div className="bg-gradient-to-r from-[#2a2d30] to-[#363A3D] p-4 rounded-t-lg border-b border-[#45494e]">
      <div className="flex justify-between gap-4 items-center">
        <div className="flex max-md:flex-col max-md:items-start items-center gap-4">
          <Image
            src="/reviewT.png"
            alt="Trustpilot ibendouma reviews"
            width={150}
            height={150}
            className="object-contain"
          />
          <div className=" max-md:hidden h-8 w-[1px] bg-[#45494e]" />
          <div className="flex items-center gap-3">
            <Image
              src="/secure.png"
              alt="secure"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="text-white text-xs sm:text-sm font-medium">
              {tScope("guarantee")}
            </span>
          </div>
        </div>
        <div className="flex max-md:flex-col max-md:items-start items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/delivery.png"
              alt="delivery"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="text-white text-xs sm:text-sm font-medium">
              {tScope("delivery")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/refund.png"
              alt="refund"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="text-white text-xs sm:text-sm font-medium">
              {tScope("refund")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return reviews.length > 0 ? (
    <>
      <div className="relative font-poppins w-full max-w-7xl mx-auto">
        <Card className="bg-[#363A3D] border-[#45494e] overflow-hidden">
          <HeaderSection />

          <div className="relative">
            <ScrollArea className="w-full h-[500px] px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentGroupIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6"
                >
                  {displayedReviews.map((review: Review, index: number) => (
                    <Link
                      href="https://fr.trustpilot.com/review/ibendouma.com"
                      target="_blank"
                      key={`${review.id}-${index}`}
                      className="group"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gradient-to-br from-[#2a2d30] to-[#363A3D] p-4 rounded-lg border border-[#45494e] hover:border-blue-500/50 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <UserAvatar
                            imageUrl={review.image}
                            name={review.name}
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-medium">
                              {maskDisplayName(review.name)}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <Image
                                src="/stars-5-down.svg"
                                alt="rating"
                                width={80}
                                height={20}
                                className="object-contain"
                              />
                              <span className="text-sm text-gray-400">
                                {formatDate(review.date)}
                              </span>
                            </div>
                            <div className="mt-4">
                              <p className="text-white font-medium mb-2">
                                {tScope2Reviews(`title-${review.id}` as any)}
                              </p>
                              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                                {tScope2Reviews(`message-${review.id}` as any)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>
            </ScrollArea>

            <div className="absolute bottom-5 right-4 flex items-center gap-2">
              <button
                onClick={() => navigateGroup("prev")}
                className="p-2 rounded-full bg-[#2a2d30] text-white hover:bg-blue-500/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-white text-sm">
                {currentGroupIndex + 1} / {totalGroups}
              </div>
              <button
                onClick={() => navigateGroup("next")}
                className="p-2 rounded-full bg-[#2a2d30] text-white hover:bg-blue-500/20 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="border-t border-[#45494e]">
            <Alert
              variant="destructive"
              className="border-none rounded-none bg-[#2a2d30]"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold text-red-500">
                {tScope2("title")}
              </AlertTitle>
              <AlertDescription className="text-red-400">
                {tScope2("notice")}
              </AlertDescription>
            </Alert>
          </div>
        </Card>
      </div>
    </>
  ) : null;
};

export default Testimonials;
