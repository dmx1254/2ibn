"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useAnimationControls } from "framer-motion";
import axios from "axios";
import { UserCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { TestimonialsCardSkeleton } from "@/components/ui/skeletons/skeletons";
import { Card } from "./ui/card";
import Link from "next/link";
import { useScopedI18n } from "@/locales/client";

const TestimonialsCard = () => {
  const tScope = useScopedI18n("testimonials");
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
    <div className="max-lg:-mt-8 relative font-poppins">
      <Card className="absolute w-full z-20 bg-gray-50 shadow-none border-none p-4 flex items-center gap-2">
        <Image
          className="object-cover object-center"
          src="/trustpilot1start.svg"
          alt="Trustpilot ibendouma review"
          width={30}
          height={30}
        />
        <span className="font-semibold text-lg mt-1">Truspilot</span>
      </Card>
      <ScrollArea className="w-full z-10 h-[300px] lg:h-[600px] max-lg:max-w-[450px] lg:w-2/4 shadow-none bg-transparent border-none hide-scrollbar relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-20 before:bg-gradient-to-b before:from-background before:to-transparent before:z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-20 after:bg-gradient-to-t after:from-background after:to-transparent after:z-10">
        <div ref={scrollRef} className="overflow-hidden">
          <motion.div
            animate={controls}
            className="space-y-4 flex flex-col items-center lg:items-start"
          >
            {/* Original reviews */}
            {filteredReviews.map((review: any) => (
              <Link
                href="https://fr.trustpilot.com/review/ibendouma.com"
                target="_blank"
                key={review.id}
                className="w-full p-4 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                {/* Review content */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      imageUrl={review.consumer?.imageUrl}
                      name={review.consumer.displayName}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {review.consumer.displayName}
                      </span>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-500">
                          {formatDate(review.dates.publishedDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="font-medium">{review.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{review.text}</p>
                  </div>
                </div>
              </Link>
            ))}

            {/* Duplicate reviews */}
            {filteredReviews.map((review: any) => (
              <div
                key={`${review.id}-duplicate`}
                className="w-full p-4 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                {/* Same review content structure */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      imageUrl={review.consumer?.imageUrl}
                      name={review.consumer.displayName}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {review.consumer.displayName}
                      </span>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-500">
                          {formatDate(review.dates.publishedDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="font-medium">{review.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{review.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </ScrollArea>
      <Card className="absolute max-lg:hidden w-full z-20 bg-gray-50 bottom-[-6%] border-none p-4 flex items-center gap-2 shadow-none text-gray-600">
        <p className="w-full text-sm text-justify">{tScope("desc")}</p>
      </Card>
    </div>
  ) : null;
};

export default TestimonialsCard;
