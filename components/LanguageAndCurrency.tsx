"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, Globe } from "lucide-react";
import { CurrencyItem, Language, cn, currencies, languages } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import useStore from "@/lib/store-manage";
import { CUR } from "@/lib/types/types";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { LocaleSelect } from "./LocaleSelect";

const LanguageAndCurrency = () => {
  const tScope = useScopedI18n("languageandcur");

  const { addNewDevise, devise } = useStore();
  const locale = useCurrentLocale();

  const [isActiveCurrency, setIsActiveCurrency] = useState<string>("euro");
  const [language, setLanguage] = useState(languages[0]);
  const [currency, setCurrency] = useState(currencies[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const handleCurrencyChange = (curr: CurrencyItem) => {
    setIsActiveCurrency(curr.slug);
    setCurrency(curr);
    setIsOpen(false);
  };

  const fetchCurrency = async (currency: string): Promise<CUR[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_IBENDOUMA_CLIENT_URL}/${currency}`
    );
    if (!response.ok) {
      throw new Error("Fetching currency failed: ");
    }

    return response.json();
  };

  const { isLoading, error, data } = useQuery<CUR[], Error>({
    queryKey: ["currency", isActiveCurrency],
    queryFn: () => fetchCurrency(isActiveCurrency),
    enabled: !!isActiveCurrency,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      let keys = Object.keys(data[0]);
      let values = Object.values(data[0]);
      let name = keys[1];
      let val = values[1];
      const dev = {
        currencyName: name,
        curencyVal: val,
      };
      addNewDevise(dev);
    }
  }, [data, addNewDevise]);

  const getLocaleLanguage = () => {
    const language = languages.find((l) => l.code === locale);
    return language;
  };
  const getActualCurrency = () => {
    const curr = currencies.find((c) => c.slug === devise.currencyName);
    return curr;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="outline-none inline-flex items-center gap-2 px-3 py-2 transition-all duration-200 cursor-pointer rounded-full hover:bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-yellow-500">
          <Globe size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {getLocaleLanguage()?.code.toUpperCase()} /{" "}
            {getActualCurrency()?.symbol}
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-0 bg-white rounded-xl shadow-xl border border-gray-200"
        align="end"
      >
        <div className="grid divide-y divide-gray-100">
          <div className="p-4 space-y-3">
            <h4 className="font-semibold text-lg text-gray-800">{tScope("language")}</h4>
            <LocaleSelect />
          </div>
          <div className="p-4 space-y-3">
            <h4 className="font-semibold text-lg text-gray-800">{tScope("currency")}</h4>
            <div className="space-y-1">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    devise.currencyName === curr.slug
                      ? "bg-yellow-50 text-yellow-700"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                  onClick={() => handleCurrencyChange(curr)}
                >
                  <span className="text-base font-semibold w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                    {curr.symbol}
                  </span>
                  <span className="flex-grow text-left text-sm font-medium">
                    {curr.name}
                  </span>
                  {devise.currencyName === curr.code && (
                    <Check size={18} className="text-yellow-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageAndCurrency;
