"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wallet, CreditCard, ArrowLeftRight } from "lucide-react";
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
      title: tScope("achatKamasTitle"),
      description: tScope("achatKamasDesc"),
      icon: CreditCard,
      color: "bg-violet-100",
      iconColor: "text-violet-600",
      buttonHref: "#home",
      gradientFrom: "from-violet-500",
      gradientTo: "to-purple-600",
    },
    {
      title: tScope("vendKamasTitle"),
      description: tScope("vendKamasDesc"),
      icon: Wallet,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonHref: "/vendre-des-kamas",
      gradientFrom: "from-blue-500",
      gradientTo: "to-cyan-600",
    },
    {
      title: tScope("echangeKamasTitle"),
      description: tScope("echangeKamasDesc"),
      icon: ArrowLeftRight,
      color: "bg-amber-100",
      iconColor: "text-amber-600",
      buttonHref: "/echange-de-kamas",
      gradientFrom: "from-amber-500",
      gradientTo: "to-yellow-600",
    },
  ];

  return (
    <div className="py-16 px-4 md:px-6 lg:px-8 bg-white">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {/* Gradient background overlay */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo}`}
              ></div>

              <div className="relative">
                <div
                  className={`${category.color} p-4 rounded-full inline-flex mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className={`w-8 h-8 ${category.iconColor}`} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {category.title}
                </h3>

                <p className="text-gray-600 mb-8 h-24">
                  {category.description}
                </p>

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
