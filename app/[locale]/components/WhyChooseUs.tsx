"use client";

import React from "react";
import { Clock, Lock, Star, MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { useScopedI18n } from "@/locales/client";

const WhyChooseUs = () => {
  const tScope = useScopedI18n("whychooseus");
  const features = [
    {
      icon: Clock,
      title: tScope("delivery"),
      color: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
    {
      icon: Lock,
      title: tScope("secure"),
      color: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
    {
      icon: Star,
      title: tScope("bestPrice"),
      color: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
    {
      icon: MessageCircle,
      title: tScope("onlineSupport"),
      color: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="py-16 px-4 md:px-6 lg:px-8 bg-white lg:my-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {tScope("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {tScope("desc")}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
            >
              <div className={`${feature.color} p-4 rounded-full mb-4`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center">
          <Button
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors duration-300"
            asChild
          >
            <Link href="/vendre-des-kamas">
              {tScope("startNow")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
