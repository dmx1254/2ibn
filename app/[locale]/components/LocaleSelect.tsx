"use client";

import { Language, cn, languages } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  useChangeLocale,
  useCurrentLocale,
  useI18n,
  useScopedI18n,
} from "@/locales/client";
import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export const LocaleSelect = () => {
  const [langSelected, setLangSelected] = useState<Language | null>(null);
  const t = useI18n();
  const tScope = useScopedI18n("languageandcur");
  const locale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  useEffect(() => {
    const findLanguage = languages.find((l) => l.code === locale);
    if (findLanguage) {
      setLangSelected(findLanguage);
    }
  }, [locale]);

  return (
    <div className="space-y-1 w-full">
      <Select
        onValueChange={(value) => changeLocale(value as "en" | "fr" | "es")}
      >
        <SelectTrigger className="w-full outline-none focus:outline-none focus:ring-0 focus:ring-offset-0">
          <SelectValue
            placeholder={
              <div className="flex items-center gap-2">
                <Image
                  src={langSelected?.flag || languages[0].flag}
                  alt={langSelected?.name || "language"}
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
                <span className="flex-grow text-left text-sm font-medium -mt-0.5">
                  {tScope(langSelected?.code as "fr" | "en" | "es")}
                </span>
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup className="w-full">
            {languages.map((lang) => (
              <SelectItem
                value={lang.code}
                key={lang.code}
                // className={cn(
                //   "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                //   locale === lang.code
                //     ? "bg-yellow-50 text-yellow-700"
                //     : "hover:bg-gray-50 text-gray-700"
                // )}
                className="w-full flex items-center gap-3 p-4"
              >
                <div className="w-full flex items-center gap-2">
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
                  {/* {locale === lang.code && (
                  <Check size={18} className="text-yellow-600" />
                )} */}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
