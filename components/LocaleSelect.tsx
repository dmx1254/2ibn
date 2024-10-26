"use client";

import { cn, languages } from "@/lib/utils";

import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const LocaleSelect = () => {
  const [activeCode, setActiveCode] = useState<"en" | "fr" | "es">("en");

  return (
    <div className="space-y-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            activeCode === lang.code
              ? "bg-yellow-50 text-yellow-700"
              : "hover:bg-gray-50 text-gray-700"
          )}
          onClick={() => setActiveCode(lang.code as "en" | "fr" | "es")}
        >
          <Image
            src={lang.flag}
            alt={lang.name}
            width={20}
            height={20}
            className="rounded-sm"
          />
          <span className="flex-grow text-left text-sm font-medium">
            {lang.name}
          </span>
          {activeCode === lang.code && (
            <Check size={18} className="text-yellow-600" />
          )}
        </button>
      ))}
    </div>
  );
};
