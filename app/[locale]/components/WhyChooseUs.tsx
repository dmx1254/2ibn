"use client";

import React from "react";
import {
  MessageCircle,
  Shield,
  DollarSign,
  Zap,
  Package,
  Heart,
  Monitor,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { useScopedI18n } from "@/locales/client";

const WhyChooseUs = () => {
  const tScope = useScopedI18n("whychooseus");
  const features = [
    {
      icon: MessageCircle,
      title: tScope("serviceClient"),
      description: tScope("serviceClientDesc"),
      iconColor: "text-blue-500",
    },
    {
      icon: Shield,
      title: tScope("securityFiabilite"),
      description: tScope("securityFiabiliteDesc"),
      iconColor: "text-green-500",
    },
    {
      icon: DollarSign,
      title: tScope("prixCompetitifs"),
      description: tScope("prixCompetitifsDesc"),
      iconColor: "text-yellow-500",
    },
    {
      icon: Zap,
      title: tScope("transactionsRapides"),
      description: tScope("transactionsRapidesDesc"),
      iconColor: "text-orange-500",
    },
    {
      icon: Package,
      title: tScope("largeSelection"),
      description: tScope("largeSelectionDesc"),
      iconColor: "text-purple-500",
    },
    {
      icon: Heart,
      title: tScope("satisfactionGarantie"),
      description: tScope("satisfactionGarantieDesc"),
      iconColor: "text-pink-500",
    },
    {
      icon: Monitor,
      title: tScope("plateformeFiable"),
      description: tScope("plateformeFiableDesc"),
      iconColor: "text-cyan-500",
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
    <div className="p-5 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {tScope("title")}
          </h2>
          <p className="text-base text-justify text-white max-w-2xl mx-auto">
            {tScope("desc")}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#363A3D] transition-all duration-300 hover:shadow-lg"
            >
              <div className={`p-4 rounded-full mb-4 bg-[#1A1D21]`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center">
          <Button
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors duration-300"
            asChild
            aria-label="start now button"
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
