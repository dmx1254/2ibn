"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Gamepad2 } from "lucide-react";
import { Card } from "../components/ui/card";
import axios from "axios";
import { useScopedI18n } from "@/locales/client";
import { useSearchParams } from "next/navigation";

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
  accounts: Account[];
}

const VideoGamePage = () => {
  const t = useScopedI18n("videoGamePage");
  const searchParams = useSearchParams();
  const [licenceGroups, setLicenceGroups] = useState<LicenceGroup[]>([]);
  const [filteredLicences, setFilteredLicences] = useState<LicenceGroup[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "recharger">("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialiser la recherche depuis l'URL au chargement
  useEffect(() => {
    const urlSearch = searchParams?.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/go/accounts");
        const data = response.data;

        // Regrouper par licence
        const grouped = data.reduce((acc: Record<string, Account[]>, account: Account) => {
          const licence = account.licence;
          if (!acc[licence]) {
            acc[licence] = [];
          }
          acc[licence].push(account);
          return acc;
        }, {});

        // Créer les groupes avec le nombre d'offres
        const groups: LicenceGroup[] = Object.entries(grouped).map(([licence, accounts]) => ({
          licence,
          count: (accounts as Account[]).length,
          accounts: accounts as Account[],
        }));

        // Trier par nombre d'offres (décroissant)
        groups.sort((a, b) => b.count - a.count);
        setLicenceGroups(groups);
        setFilteredLicences(groups);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    let filtered = [...licenceGroups];

    // Filtrer par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter((group) =>
        group.licence.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLicences(filtered);
  }, [searchQuery, licenceGroups]);

  // Top 5 pour les tendances
  const trendingLicences = filteredLicences.slice(0, 5);
  
  // Toutes les marques de jeux = tous les jeux disponibles
  const allLicences = filteredLicences;

  // Pour le filtre "Recharger", afficher toutes les licences sans séparation
  const displayLicences = activeFilter === "recharger" 
    ? filteredLicences 
    : [];

  const getSlugFromLicence = (licence: string): string => {
    return licence.toLowerCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1D21] text-white font-poppins">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Search and Filters Skeleton */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="h-12 w-full bg-gray-700 rounded-full animate-pulse" />
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-gray-700 rounded-full animate-pulse" />
              <div className="h-10 w-32 bg-gray-700 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-xl h-32 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1D21] text-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-yellow-600 transition-colors">
            {t("home")}
          </Link>
          <span>»</span>
          <span className="text-white">{t("games")}</span>
        </div>

        {/* Header avec titre et icône */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">{t("games")}</h1>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#2A2D30] border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-yellow-600 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeFilter === "all"
                  ? "bg-yellow-600 text-black font-semibold"
                  : "bg-[#2A2D30] text-white hover:bg-[#363A3D]"
              }`}
            >
              {t("all")}
            </button>
            <button
              onClick={() => setActiveFilter("recharger")}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeFilter === "recharger"
                  ? "bg-yellow-600 text-black font-semibold"
                  : "bg-[#2A2D30] text-white hover:bg-[#363A3D]"
              }`}
            >
              {t("recharger")}
            </button>
          </div>
        </div>

        {/* Section Tendances (seulement si filtre "Tous") */}
        {activeFilter === "all" && (
          <div className="mb-12 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">{t("trending")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
              {trendingLicences.map((group) => (
                <Link
                  key={group.licence}
                  href={`/video-game/${getSlugFromLicence(group.licence)}`}
                >
                  <Card className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-4 rounded-xl cursor-pointer hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 border-0 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-pink-600/90 to-orange-500/90 group-hover:from-purple-500/90 group-hover:via-pink-500/90 group-hover:to-orange-400/90 transition-all duration-300"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center text-center py-2">
                      <div className="mb-2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                        <Gamepad2 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1 line-clamp-2">
                        {group.licence.includes("-") ? group.licence.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : group.licence.charAt(0).toUpperCase() + group.licence.slice(1)}
                      </h3>
                      <p className="text-white/90 text-xs font-medium">
                        {group.count} {group.count === 1 ? t("offer") : t("offers")}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section Toutes les marques de jeux */}
        {activeFilter === "all" && (
          <div className="mb-12 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">{t("allBrands")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
              {allLicences.map((group) => (
                <Link
                  key={group.licence}
                  href={`/video-game/${getSlugFromLicence(group.licence)}`}
                >
                  <Card className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-xl cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 border-0 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90 group-hover:from-indigo-500/90 group-hover:via-purple-500/90 group-hover:to-pink-500/90 transition-all duration-300"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center text-center py-2">
                      <div className="mb-2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                        <Gamepad2 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1 line-clamp-2">
                        {group.licence.includes("-") ? group.licence.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : group.licence.charAt(0).toUpperCase() + group.licence.slice(1)}
                      </h3>
                      <p className="text-white/90 text-xs font-medium">
                        {group.count} {group.count === 1 ? t("offer") : t("offers")}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section Recharger - Liste complète sans séparation */}
        {activeFilter === "recharger" && (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
              {displayLicences.map((group) => (
                <Link
                  key={group.licence}
                  href={`/video-game/${getSlugFromLicence(group.licence)}`}
                >
                  <Card className="relative bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 p-4 rounded-xl cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 border-0 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/90 via-blue-600/90 to-indigo-600/90 group-hover:from-cyan-500/90 group-hover:via-blue-500/90 group-hover:to-indigo-500/90 transition-all duration-300"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center text-center py-2">
                      <div className="mb-2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                        <Gamepad2 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1 line-clamp-2">
                        {group.licence}
                      </h3>
                      <p className="text-white/90 text-xs font-medium">
                        {group.count} {group.count === 1 ? t("offer") : t("offers")}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Message si aucun résultat */}
        {((activeFilter === "all" && allLicences.length === 0) || 
          (activeFilter === "recharger" && displayLicences.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {t("noGameFound")} &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGamePage;
