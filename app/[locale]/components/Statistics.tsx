"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Clock, Star, Shield } from "lucide-react";
import { useScopedI18n } from "@/locales/client";

const Statistics = () => {
  const tScope = useScopedI18n("statistic");
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: tScope("satisfied"),
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Clock,
      value: "5-15 min",
      label: tScope("timeDelivery"),
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: tScope("average"),
      color: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: Shield,
      value: "100%",
      label: tScope("transactions"),
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

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

  return (
    <div className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`${stat.color} p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-center">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Statistics;
