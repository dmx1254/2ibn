"use client";

import Link from "next/link";
import React from "react";
import SocialMediaDropdown from "./SocialMediaDropdown ";
import { useScopedI18n } from "@/locales/client";
import { homegames } from "@/lib/utils";
import Image from "next/image";

const HomePageGame = () => {
  const tScope = useScopedI18n("pageicon");
  const tScope2 = useScopedI18n("virtualgame");

  return (
    <div className="w-full flex items-start justify-between mt-4 sm:mt-16 max-md:px-4">
      {homegames.map((h) => (
        <Link
          href={`/jeux/${h.slug}`}
          className="flex flex-col items-center gap-2"
          key={h.id}
        >
          <Image
            src={`/jeux/${h.slug}.webp`}
            alt={h.slug}
            width={80}
            height={80}
            className="sm:w-16 sm:h-16 w-12 h-12 object-cover opacity-100 rounded-[6px]"
            priority
          />
          <p className="hidden sm:flex text-sm max-w-28 text-center antialiased">
            {tScope2(
              `${
                h.slug as
                  | "pubg-mobile"
                  | "free-fire"
                  | "fortnite"
                  | "mobile-legends"
                  | "pasha-fencer-diamonds"
              }.title`
            )}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default HomePageGame;
