"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useAnimationControls } from "framer-motion";
import axios from "axios";
import { AlertTriangle, Coins, ShieldCheck, UserCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { TestimonialsCardSkeleton } from "@/components/ui/skeletons/skeletons";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { useScopedI18n } from "@/locales/client";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const TestimonialsCard = () => {
  const tScope = useScopedI18n("testimonials");
  const tScope2 = useScopedI18n("exchange");
  const [reviews, setReviews] = useState<any>();
  const [containerHeight, setContainerHeight] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  const options = {
    method: "GET",
    url: "https://trustpilot4.p.rapidapi.com/",
    params: {
      domain: "ibendouma.com",
      page: "1",
    },
    headers: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_XRapidAPIKEY,
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_XRapidAPIHOST,
    },
  };

  const fetchTruspilotReviews = async () => {
    const response = await axios.request(options);
    return response;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["trustpilot-reviews"],
    queryFn: () => fetchTruspilotReviews(),
  });

  useMemo(() => {
    if (data) {
      setReviews(data);
    }
  }, [data]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredReviews = reviews?.data?.reviews?.filter(
    (review: any) => review.rating > 3
  );

  // Update container height after reviews are loaded
  useEffect(() => {
    if (scrollRef.current && filteredReviews?.length) {
      const height = scrollRef.current.scrollHeight / 2; // Divide by 2 because we duplicate the reviews
      setContainerHeight(height);
    }
  }, [filteredReviews]);

  // Start animation after container height is calculated
  useEffect(() => {
    if (containerHeight > 0) {
      const startAnimation = async () => {
        await controls.start({
          y: -containerHeight,
          transition: {
            duration: 100, // Fixed duration for smoother animation
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          },
        });
      };

      startAnimation();
    }
  }, [containerHeight, controls]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        <Image
          src="/stars-5-down.svg"
          alt="trustpilot stars"
          width={80}
          height={20}
        />
      </div>
    );
  };

  const UserAvatar = ({
    imageUrl,
    name,
  }: {
    imageUrl?: string;
    name: string;
  }) => {
    if (imageUrl) {
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={imageUrl ? imageUrl : "/user.png"}
            alt={`${name}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
        {name ? (
          <span className="text-lg font-semibold text-gray-600">
            {name.charAt(0).toUpperCase()}
          </span>
        ) : (
          <UserCircle2 className="w-6 h-6 text-gray-400" />
        )}
      </div>
    );
  };

  if (isLoading) return <TestimonialsCardSkeleton />;
  //   if (error)
  //     return <div className="text-sm text-red-500">Error loading reviews</div>;

  return filteredReviews?.length ? (
    <div className="mt-0 lg:-mt-8 relative font-poppins w-full">
      <Card className="max-lg:hidden absolute w-full z-20 bg-[#363A3D] shadow-none p-4 flex items-center justify-between gap-2 border border-[#45494e]">
        <div className="flex flex-col items-start gap-3">
          <Image
            className="object-cover object-center"
            src="/reviewT.png"
            alt="Trustpilot ibendouma reviews"
            width={200}
            height={200}
          />

          <div className="flex items-center gap-2">
            <Image
              className="object-contain object-center"
              src="/secure.png"
              alt="2ibn secure"
              width={20}
              height={20}
            />
            <span className="uppercase text-white text-sm">
              {tScope("guarantee")}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-2">
            <Image
              className="object-contain object-center"
              src="/delivery.png"
              alt="2ibn delivery"
              width={20}
              height={20}
            />
            <span className="uppercase text-white text-sm">
              {tScope("delivery")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              className="object-contain object-center"
              src="/refund.png"
              alt="2ibn refund"
              width={20}
              height={20}
            />
            <span className="uppercase text-white text-sm">
              {tScope("refund")}
            </span>
          </div>
        </div>
      </Card>
      <ScrollArea className="w-full z-10 h-[300px] lg:h-[600px] max-lg:max-w-[450px] lg:w-full shadow-none bg-transparent border-none hide-scrollbar relative overflow-hidden">
        <div className="w-full flex items-center justify-between gap-4">
          <div ref={scrollRef} className="w-full overflow-hidden">
            <motion.div
              animate={controls}
              className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {/* Original reviews */}
              {filteredReviews?.map((review: any) => (
                <Link
                  href="https://fr.trustpilot.com/review/ibendouma.com"
                  target="_blank"
                  key={review.id}
                  className="w-full h-full p-3 bg-[#363A3D] rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-start gap-3">
                      <UserAvatar
                        imageUrl={review.consumer?.imageUrl}
                        name={review.consumer.displayName}
                      />
                      <div className="flex flex-col flex-grow">
                        <span className="font-medium text-white/90 text-sm">
                          {review.consumer.displayName}
                        </span>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-xs text-white">
                            {formatDate(review.dates.publishedDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex-grow">
                      <p className="font-medium text-white text-sm">
                        {review.title}
                      </p>
                      <p className="text-sm text-white mt-1">{review.text}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
            {/* Duplicate reviews with same styling */}
            <motion.div
              animate={controls}
              className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4"
            >
              {filteredReviews?.map((review: any) => (
                <Link
                  href="https://fr.trustpilot.com/review/ibendouma.com"
                  target="_blank"
                  key={review.id}
                  className="w-full h-full p-3 bg-[#363A3D] rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-start gap-3">
                      <UserAvatar
                        imageUrl={review.consumer?.imageUrl}
                        name={review.consumer.displayName}
                      />
                      <div className="flex flex-col flex-grow">
                        <span className="font-medium  text-white/90 text-sm">
                          {review.consumer.displayName}
                        </span>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-xs text-white">
                            {formatDate(review.dates.publishedDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex-grow">
                      <p className="font-medium text-white text-sm">
                        {review.title}
                      </p>
                      <p className="text-sm text-white mt-1">{review.text}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </ScrollArea>
      <Card className="absolute max-lg:hidden w-full z-20 bg-[#363A3D] bottom-[-6%] border-[#45494e] p-0 flex items-center gap-2 shadow-none text-gray-600">
        <CardContent className="p-0">
          <Alert variant="destructive" className="border-none">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-semibold text-red-500">
              {tScope2("title")}
            </AlertTitle>
            <AlertDescription className="text-red-500">
              {tScope2("notice")}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  ) : null;
};

export default TestimonialsCard;
