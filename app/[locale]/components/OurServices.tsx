"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  ArrowLeftRight,
  Gamepad2,
  Coins,
  Gift,
  Package,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useScopedI18n } from "@/locales/client";

const OurServices = () => {
  const tScope = useScopedI18n("ourservice");
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const categories = [
    {
      title: tScope("achatVenteKamasTitle"),
      description: tScope("achatVenteKamasDesc"),
      icon: CreditCard,
      color: "#363A3D",
      iconColor: "text-violet-600",
      buttonHref: "#home",
      gradientFrom: "from-violet-500",
      gradientTo: "to-purple-600",
    },
    {
      title: tScope("echangeKamasTitle"),
      description: tScope("echangeKamasDesc"),
      icon: ArrowLeftRight,
      color: "#363A3D",
      iconColor: "text-blue-600",
      buttonHref: "/echange-de-kamas",
      gradientFrom: "from-blue-500",
      gradientTo: "to-cyan-600",
    },
    {
      title: tScope("venteComptesTitle"),
      description: tScope("venteComptesDesc"),
      icon: Gamepad2,
      color: "#363A3D",
      iconColor: "text-emerald-600",
      buttonHref: "#home",
      gradientFrom: "from-emerald-500",
      gradientTo: "to-green-600",
    },
    {
      title: tScope("venteCoinsTitle"),
      description: tScope("venteCoinsDesc"),
      icon: Coins,
      color: "#363A3D",
      iconColor: "text-amber-600",
      buttonHref: "#home",
      gradientFrom: "from-amber-500",
      gradientTo: "to-yellow-600",
    },
    {
      title: tScope("giftCardsTitle"),
      description: tScope("giftCardsDesc"),
      icon: Gift,
      color: "#363A3D",
      iconColor: "text-pink-600",
      buttonHref: "#home",
      gradientFrom: "from-pink-500",
      gradientTo: "to-rose-600",
    },
    {
      title: tScope("itemsObjetsTitle"),
      description: tScope("itemsObjetsDesc"),
      icon: Package,
      color: "#363A3D",
      iconColor: "text-orange-600",
      buttonHref: "#home",
      gradientFrom: "from-orange-500",
      gradientTo: "to-red-600",
    },
  ];

  return (
    <div className="p-5 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {tScope("title")}
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto">
            {tScope("desc")}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl bg-[#363A3D] p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {/* Gradient background overlay */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo}`}
              ></div>

              <div className="relative">
                <div
                  className={`bg-[#1A1D21] p-4 rounded-full inline-flex mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className={`w-8 h-8 ${category.iconColor}`} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {category.title}
                </h3>

                <p className="text-white mb-8 min-h-[96px]">{category.description}</p>

                <Button
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors duration-300"
                  asChild
                  aria-label="Service link button"
                >
                  <Link href={category.buttonHref}>
                    {tScope("btn")}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default OurServices;
