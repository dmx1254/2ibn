"use client";

import React from "react";

import { useScopedI18n } from "@/locales/client";
import Link from "next/link";

const HomeSlider = () => {
  const tScope2 = useScopedI18n("pageicon");
 
  return (
    <div className="w-full flex items-center justify-center pt-20 pb-2 md:pt-64 md:pb-40 h-full gap-4 relative">

      <div className="flex flex-col items-center justify-center w-full max-w-4xl text-center px-4 z-10">
        <div className="mb-12 relative flex items-center gap-3 w-full">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 max-md:w-4 max-md:h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder={tScope2("searchDesc")}
              className="w-full pl-10 md:pl-12 pr-4 py-3 max-md:text-sm md:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <button
            disabled
            className="absolute right-2 max-md:text-sm top-1/2 transform -translate-y-1/2 bg-yellow-500 text-white px-4 py-2 md:px-8 md:py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            {tScope2("search")}
          </button>
        </div>

        {/* Section 3: Icônes de catégories */}
        <div className="mb-12 flex items-center justify-between gap-3 w-full">
          {/* Buy Kamas */}
          <Link
            href="/acheter-des-kamas"
            className="flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="max-sm:text-xs text-white font-bold flex flex-col items-center text-sm antialiased">
              <span>{tScope2("buy1")}</span>
              <span className="max-sm:hidden">{tScope2("buy2")}</span>
            </div>
          </Link>

          {/* Sell Kamas */}
          <Link
            href="/vendre-des-kamas"
            className="flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
              </svg>
            </div>
            <div className="max-sm:text-xs flex text-white font-bold flex-col items-center text-sm antialiased">
              <span>{tScope2("sell1")}</span>
              <span className="max-sm:hidden">{tScope2("sell2")}</span>
            </div>
          </Link>

          {/* Become a Member */}
          <Link href="/signup" className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="max-sm:text-xs flex text-white font-bold flex-col items-center text-sm antialiased">
              <span className="max-sm:hidden">{tScope2("memb1")}</span>
              <span>{tScope2("memb2")}</span>
            </div>
          </Link>

          {/* Exchange Kamas */}
          <Link
            href="/echange-de-kamas"
            className="flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
              </svg>
            </div>
            <div className="max-sm:text-xs flex flex-col text-white font-bold items-center text-sm antialiased">
              <span>{tScope2("exchange1")}</span>
              <span className="max-sm:hidden">{tScope2("exchange2")}</span>
            </div>
          </Link>

          {/* Rate Us - Trustpilot */}
          <Link
            href="https://fr.trustpilot.com/evaluate/ibendouma.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            <div className="max-sm:text-xs flex flex-col text-white font-bold items-center text-sm antialiased">
              <span>{tScope2("rate")}</span>
              <span className="max-sm:hidden">{tScope2("rateDesc")}</span>
            </div>
          </Link>
        </div>
      </div>
      {/* <Image
        src="/whitefiltre.jpeg"
        alt="image background"
        width={1000}
        height={1000}
        className="w-full h-full object-cover"
      /> */}
    </div>
  );
};

export default HomeSlider;
