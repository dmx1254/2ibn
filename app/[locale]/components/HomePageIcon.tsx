"use client";

import Link from "next/link";
import React from "react";
import SocialMediaDropdown from "./SocialMediaDropdown ";
import { useScopedI18n } from "@/locales/client";

const HomePageIcon = () => {
  const tScope = useScopedI18n("pageicon");
  return (
    <div className="w-full flex items-center justify-between mt- sm:mt-16 px-4">
      <Link
        href="/acheter-des-kamas"
        className="flex flex-col items-center gap-2"
      >
        <img
          className="w-10 h-10 sm:w-12 sm:h-12 object-cover object-center rounded-full"
          src="/objets_jeu.png"
          alt="Acheter des kamas"
        />
        <div className="max-sm:text-xs flex flex-col items-center text-sm antialiased">
          <span>{tScope("buy1")}</span>
          <span className="max-sm:hidden">{tScope("buy2")}</span>
        </div>
      </Link>
      <Link
        href="/vendre-des-kamas"
        className="flex flex-col items-center gap-2"
      >
        <img
          className="w-10 h-10 sm:w-12 sm:h-12 object-cover object-center rounded-full"
          src="/coins.png"
          alt="Vendre des kamas"
        />
        <div className="max-sm:text-xs flex flex-col items-center text-sm antialiased">
          <span>{tScope("sell1")}</span>
          <span className="max-sm:hidden">{tScope("sell2")}</span>
        </div>
      </Link>
      <Link href="/signup" className="flex flex-col items-center gap-2">
        <img
          className="w-10 h-10 sm:w-12 sm:h-12 object-cover object-center rounded-full"
          src="/comptes.png"
          alt="Devenir membre"
        />
        <div className="max-sm:text-xs flex flex-col items-center text-sm antialiased">
          <span className="max-sm:hidden">{tScope("memb1")}</span>
          <span>{tScope("memb2")}</span>
        </div>
      </Link>

      <Link
        href="/echange-de-kamas"
        className="flex flex-col items-center gap-2"
      >
        <img
          className="w-10 h-10 sm:w-12 sm:h-12 object-cover object-center rounded-full"
          src="/boost.png"
          alt="Echange de kamas"
        />
        <div className="max-sm:text-xs flex flex-col items-center text-sm antialiased">
          <span>{tScope("exchange1")}</span>
          <span className="max-sm:hidden">{tScope("exchange2")}</span>
        </div>
      </Link>
      <SocialMediaDropdown isSource={true} />
    </div>
  );
};

export default HomePageIcon;
