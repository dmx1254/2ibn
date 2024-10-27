"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

import { useScopedI18n } from "@/locales/client";
import Link from "next/link";

const InfoSection: React.FC = () => {
  const tScope = useScopedI18n("infosect");
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="rounded-[10px] py-16 px-2 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-8 text-yellow-800"
          {...fadeInUp}
        >
          {tScope("desctitle")}
        </motion.h2>

        <motion.p
          className="text-lg text-center mb-12 text-yellow-700"
          {...fadeInUp}
        >
          {tScope("descdesc")}
        </motion.p>

        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-yellow-800">
              {tScope("howbuytitle")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span>
                  <CheckCircle className="text-green-500 mr-2" size={22} />
                </span>{" "}
                {tScope("howbuy1")}
              </li>
              <li className="flex items-start">
                <span>
                  <CheckCircle className="text-green-500 mr-2" size={22} />
                </span>{" "}
                {tScope("howbuy2")}
              </li>
              <li className="flex items-start">
                <span>
                  <CheckCircle className="text-green-500 mr-2" size={22} />
                </span>{" "}
                {tScope("howbuy3")}
              </li>
              <li className="flex items-start">
                <span>
                  <CheckCircle className="text-green-500 mr-2" size={22} />
                </span>{" "}
                {tScope("howbuy4")}
              </li>
              <li className="flex items-start">
                <span>
                  <CheckCircle className="text-green-500 mr-2" size={22} />
                </span>{" "}
                {tScope("howbuy5")}
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6">
            <h3 className="text-2xl font-semibold mb-4 text-yellow-800">
              {tScope("howobtaintitle")}
            </h3>
            <ol className="space-y-4">
              {[
                tScope("howobtain1"),
                tScope("howobtain2"),
                tScope("howobtain3"),
                tScope("howobtain4"),
                tScope("howobtain5"),
              ].map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex items-center justify-center bg-yellow-500 text-white rounded-full w-6 h-6 mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-xl p-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-yellow-800">
            {tScope("howtoreciveyourkamastitle")}
          </h3>
          <p className="mb-4">{tScope("howtoreciveyourkamas1")}</p>
          <p className="mb-4">{tScope("howtoreciveyourkamas2")}</p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-6 text-yellow-800">
            {tScope("bottomtitle")}
          </h3>
          <Link
            href="/"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 transform hover:scale-105"
          >
            {tScope("btn")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default InfoSection;
