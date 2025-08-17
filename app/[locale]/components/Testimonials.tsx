"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "./ui/card";
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
  const tScopeFooter = useScopedI18n("footer");
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
    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-lg">
      <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
            <span className="text-2xl font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
        <Quote className="w-3 h-3 text-white" />
      </div>
    </div>
  );

  const displayedReviews = reviews.slice(
    currentGroupIndex * 4,
    currentGroupIndex * 4 + 4
  );

  const HeaderSection = () => (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-t-3xl border-b border-slate-700/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-full blur-2xl" />
      
      <div className="relative z-10 flex justify-between gap-6 items-center">
        <div className="flex max-md:flex-col max-md:items-start items-center gap-6">
          <div className="relative">
            <Image
              src="/reviewT.png"
              alt="Trustpilot ibendouma reviews"
              width={180}
              height={180}
              className="object-contain drop-shadow-lg"
            />
            {/* <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Star className="w-4 h-4 text-white fill-current" />
            </div> */}
          </div>
          <div className="max-md:hidden h-12 w-[2px] bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
          <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <Image
                src="/secure.png"
                alt="secure"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span className="text-white text-sm font-semibold">
              {tScope("guarantee")}
            </span>
          </div>
        </div>
        <div className="flex max-md:flex-col max-md:items-start items-center gap-6">
          <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
              <Image
                src="/delivery.png"
                alt="delivery"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span className="text-white text-sm font-semibold">
              {tScope("delivery")}
            </span>
          </div>
          <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
              <Image
                src="/refund.png"
                alt="refund"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span className="text-white text-sm font-semibold">
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
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 overflow-hidden shadow-2xl rounded-3xl">
          <HeaderSection />

          <div className="relative">
            <ScrollArea className="w-full h-[600px] px-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentGroupIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8"
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
                        className="bg-gradient-to-br from-slate-800/80 via-slate-700/80 to-slate-800/80 p-6 rounded-2xl border border-slate-600/30 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 backdrop-blur-sm group-hover:scale-[1.02] group-hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-5">
                          <UserAvatar
                            imageUrl={review.image}
                            name={review.name}
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-2">
                              {maskDisplayName(review.name)}
                            </h3>
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                              </div>
                              <span className="text-sm text-slate-400 font-medium bg-slate-800/50 px-3 py-1 rounded-full">
                                {formatDate(review.date)}
                              </span>
                            </div>
                            <div className="space-y-3">
                              <p className="text-white font-semibold text-base leading-tight">
                                {tScope2Reviews(`title-${review.id}` as any)}
                              </p>
                              <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                                {tScope2Reviews(`message-${review.id}` as any)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>
            </ScrollArea>

            <div className="absolute bottom-6 right-6 flex items-center gap-4">
              <button
                onClick={() => navigateGroup("prev")}
                className="p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-110 border border-slate-600/50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-700/50">
                <span className="text-white text-sm font-semibold">
                  {currentGroupIndex + 1} / {totalGroups}
                </span>
              </div>
              <button
                onClick={() => navigateGroup("next")}
                className="p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-110 border border-slate-600/50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="border-t border-slate-700/50">
            <Alert
              variant="destructive"
              className="border-none rounded-none bg-gradient-to-r from-red-900/50 via-red-800/50 to-red-900/50 backdrop-blur-sm"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <AlertTitle className="font-bold text-red-300 text-lg">
                {tScope2("title")}
              </AlertTitle>
              <AlertDescription className="text-red-200 text-base">
                {tScope2("notice")}
              </AlertDescription>
            </Alert>
          </div>
        </Card>
        
        <Link
          href="https://fr.trustpilot.com/evaluate/ibendouma.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex p-6 rounded-3xl items-center justify-center gap-4 mt-12 mb-4 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 hover:from-blue-900 hover:via-purple-900 hover:to-slate-800 transition-all duration-500 border border-slate-600/50 hover:border-blue-400/50 shadow-xl hover:shadow-blue-500/20 group"
        >
          <span className="text-base text-slate-300 font-medium group-hover:text-white transition-colors duration-300">
            {tScopeFooter("giveReviews")}
          </span>
          <div className="relative">
            <Image
              src="/reviewT.png"
              alt="Trustpilot ibendouma reviews"
              width={120}
              height={120}
              className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-white fill-current" />
            </div>
          </div>
        </Link>
      </div>
    </>
  ) : null;
};

export default Testimonials;
