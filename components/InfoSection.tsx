"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

import Link from "next/link";

const InfoSection: React.FC = () => {
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
          Buy and sell Kamas Dofus
        </motion.h2>

        <motion.p
          className="text-lg text-center mb-12 text-yellow-700"
          {...fadeInUp}
        >
          Kamas help you to better enjoy the game, obtaining Kamas by buying
          them is the best way, with Kamas you can buy items such as resources
          or equipment, and travel through the world of twelve.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-yellow-800">
              Why buy Dofus Kamas from 2ibn?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span>
                  <CheckCircle className="text-green-500 mr-2" size={22} />
                </span>{" "}
                Best prices and large quantities in stock
              </li>
              <li className="flex items-start">
                <span>
                  <CheckCircle className="text-green-500 mr-2" size={22} />
                </span>{" "}
                Fast and secure services 24/7
              </li>
              <li className="flex items-start">
                <span>
                  <CheckCircle className="text-green-500 mr-2" size={22} />
                </span>{" "}
                Simple delivery process
              </li>
              <li className="flex items-start">
                <span>
                  <CheckCircle className="text-green-500 mr-2" size={22} />
                </span>{" "}
                95% of orders delivered within 10 minutes
              </li>
              <li className="flex items-start">
                <span>
                  <CheckCircle className="text-green-500 mr-2" size={22} />
                </span>{" "}
                Trusted by reliable payment partners and suppliers
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6">
            <h3 className="text-2xl font-semibold mb-4 text-yellow-800">
              How to obtain Dofus Kamas?
            </h3>
            <ol className="space-y-4">
              {[
                "Sign up or log in to your 2ibn account",
                "Choose the amount of Dofus Server and Kamas",
                "Click 'Add to cart' and go to cart page",
                "Log in to Dofus and wait for the seller",
                "Confirm delivery after receiving the kamas",
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
            How to receive your Dofus Kamas?
          </h3>
          <p className="mb-4">
            The "Face to Face" delivery method is used by 2ibn to deliver all
            orders Dofus (which means you must be connected at the same time as
            us to receive your Dofus Kamas).
          </p>
          <p className="mb-4">
            The process is simple: after placing your order, please contact us
            via our 24/7 live chat support. If you know our Dofus appointment
            point, you can go there and use the "I\'m online" function on
            iBendouma to let us know that you are expecting the exchange.
          </p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-6 text-yellow-800">
            Ready to rule the World of Twelve?
          </h3>
          <Link
            href="/"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 transform hover:scale-105"
          >
            Collect Your Kamas Now!
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default InfoSection;
