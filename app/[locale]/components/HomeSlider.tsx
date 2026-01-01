"use client";

import React, { useState, useEffect } from "react";

import { useScopedI18n } from "@/locales/client";
import Link from "next/link";
import { Gamepad2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card } from "./ui/card";
import axios from "axios";

interface Account {
  _id: string;
  category: string;
  licence: string;
  description: string;
  minQ: number;
  stock: number;
  deliveryDelay: number;
  price: number;
  status: string;
  moreDetails: string;
}

interface LicenceGroup {
  licence: string;
  count: number;
  category: string;
  status: string;
}

const HomeSlider = () => {
  const tScope2 = useScopedI18n("pageicon");
  const t = useScopedI18n("videoGamePage");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<LicenceGroup[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);

  // Charger tous les comptes une fois au montage
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/api/go/accounts");
        setAllAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, []);

  const getSlugFromLicence = (licence: string): string => {
    return licence.toLowerCase().replace(/\s+/g, "-");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Ouvrir le dialog pour toutes les recherches
    setIsSearchDialogOpen(true);
    setIsSearching(true);

    const serachResult = await fetch(`/api/go/accounts/search?search=${query}`);
    const data = await serachResult.json();
    setSearchResults(data);

    try {
      // Créer une regex insensible à la casse pour la recherche
    } catch (error) {
      console.error("Error searching accounts:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (licence: string) => {
    const slug = getSlugFromLicence(licence);
    setIsSearchDialogOpen(false);
    router.push(`/video-game/${slug}`);
  };

  // console.log(searchResults);

  return (
    <div className="w-full flex items-center justify-center pt-14 pb-0 md:pt-36 md:pb-216 h-full gap-4 relative">
      <div className="flex flex-col items-center justify-center w-full max-w-4xl text-center px-4 z-10">
        <form
          onSubmit={handleSearch}
          className="mb-12 relative flex items-center gap-3 w-full"
        >
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 py-3 max-md:text-sm md:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!searchQuery.trim()}
            className={`absolute right-2 max-md:text-sm top-1/2 transform -translate-y-1/2 text-white px-4 py-2 md:px-8 md:py-3 rounded-lg font-semibold transition-colors ${
              searchQuery.trim()
                ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {tScope2("search")}
          </button>
        </form>

        {/* Section 3: Icônes de catégories */}
        <div className="mb-12 flex items-start md:items-center flex-wrap md:justify-between gap-4 md:gap-3 w-full">
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

          {/* Video Game Accounts */}
          <Link
            href="/video-game/accounts"
            className="flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div className="max-sm:text-xs flex flex-col text-white font-bold items-center text-sm antialiased">
              <span>{tScope2("accounts1")}</span>
              <span className="max-sm:hidden">{tScope2("accounts2")}</span>
            </div>
          </Link>

          {/* Gift Cards */}
          <Link
            href="/video-game/gift-cards"
            className="flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
            </div>
            <div className="max-sm:text-xs flex flex-col text-white font-bold items-center text-sm antialiased">
              <span>{tScope2("giftCards1")}</span>
              <span className="max-sm:hidden">{tScope2("giftCards2")}</span>
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

      {/* Dialog de résultats de recherche */}
      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#1A1D21] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {t("searchResults")} &quot;{searchQuery}&quot;
            </DialogTitle>
          </DialogHeader>

          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {searchResults.map((group) => (
                <Card
                  key={group.licence}
                  onClick={() => handleResultClick(group.licence)}
                  className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-xl cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 border-0 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90 group-hover:from-indigo-500/90 group-hover:via-purple-500/90 group-hover:to-pink-500/90 transition-all duration-300"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center text-center py-2">
                    <div className="mb-2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1 line-clamp-2">
                      {group.licence.includes("-")
                        ? group.licence
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : group.licence.charAt(0).toUpperCase() +
                          group.licence.slice(1)}
                    </h3>
                    {/* <p className="text-white/90 text-xs font-medium">
                      {group.category ?? ""}
                    </p> */}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {t("noResultsFound")} &quot;{searchQuery}&quot;
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeSlider;
