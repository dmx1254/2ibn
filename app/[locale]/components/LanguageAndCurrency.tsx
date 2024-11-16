"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Check, ChevronDown, Globe } from "lucide-react";
import { CurrencyItem, Language, cn, currencies, languages } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import useStore from "@/lib/store-manage";
import { CUR } from "@/lib/types/types";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { LocaleSelect } from "./LocaleSelect";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { usePathname } from "next/navigation";

const LanguageAndCurrency = () => {
  const pathname = usePathname();
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

  const handleCurrencyChange = (valCur: string) => {
    const currencySelected = currencies.find((c) => c.slug === valCur);

    if (currencySelected) {
      setIsActiveCurrency(currencySelected.slug);
      setCurrency(currencySelected);
      setIsOpen(false);
    }
  };

  const fetchCurrency = async (currency: string): Promise<CUR[]> => {
    const response = await fetch(`/api/iben/currency/${currency}`);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Language and currency"
          className="outline-none inline-flex items-center gap-2 px-3 py-2 transition-all duration-200 cursor-pointer rounded-full hover:opacity-90 border border-[#76828D] focus:ring-0 bg-[#363A3D]"
        >
          <Globe size={18} className="text-white" />
          <span className="text-sm font-medium text-white">
            {getLocaleLanguage()?.code.toUpperCase()}
            {!pathname.includes("vendre-des-kamas") &&
              ` / ${getActualCurrency()?.symbol}`}
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "text-white transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </DialogTrigger>
      <DialogContent
        showIcon={false}
        className="font-poppins w-full max-w-[450px] rounded-[20px] p-0 bg-white shadow-xl border border-gray-200"
      >
        <div className="w-full grid divide-gray-100">
          <h2 className="px-4 pt-4 text-lg text-gray-800 font-semibold">
            {tScope("title")}
          </h2>
          <div className="p-4 space-y-3">
            <h4 className="font-semibold text-lg text-gray-800">
              {tScope("language")}
            </h4>
            <LocaleSelect />
          </div>
          {!pathname.includes("vendre-des-kamas") && (
            <div className="p-4 space-y-2">
              <h4 className="font-semibold text-lg text-gray-800">
                {tScope("currency")}
              </h4>
              <div className="space-y-1">
                <Select onValueChange={(value) => handleCurrencyChange(value)}>
                  <SelectTrigger className="w-full outline-none focus:outline-none focus:ring-0 focus:ring-offset-0">
                    <SelectValue
                      placeholder={
                        <div className="flex items-center gap-2">
                          <span className="flex-grow text-left text-sm font-medium -mt-0.5">
                            {getActualCurrency()?.symbol}
                          </span>
                          <span className="flex-grow text-left text-sm font-medium -mt-0.5">
                            {getActualCurrency()?.name}
                          </span>
                        </div>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectGroup className="w-full">
                      {currencies.map((curr) => (
                        <SelectItem key={curr.code} value={curr.slug}>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                              {curr.symbol}
                            </span>
                            <span className="flex-grow text-left text-sm font-medium">
                              {curr.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <p className="w-full text-sm px-4 pb-4 pt-1 text-gray-800">{tScope("desc")}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageAndCurrency;
