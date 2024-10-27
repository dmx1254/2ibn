"use client";

import { cn, languages } from "@/lib/utils";
import {
  useChangeLocale,
  useCurrentLocale,
  useI18n,
  useScopedI18n,
} from "@/locales/client";
import { Check } from "lucide-react";
import Image from "next/image";

export const LocaleSelect = () => {
  const t = useI18n();
  const tScope = useScopedI18n("languageandcur");
  const locale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  return (
    <div className="space-y-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            locale === lang.code
              ? "bg-yellow-50 text-yellow-700"
              : "hover:bg-gray-50 text-gray-700"
          )}
          onClick={() => changeLocale(lang.code as "en" | "fr" | "es")}
        >
          <Image
            src={lang.flag}
            alt={lang.name}
            width={20}
            height={20}
            className="rounded-sm"
          />
          <span className="flex-grow text-left text-sm font-medium">
            {tScope(lang.code as "fr" | "en" | "es")}
          </span>
          {locale === lang.code && (
            <Check size={18} className="text-yellow-600" />
          )}
        </button>
      ))}
    </div>
  );
};
