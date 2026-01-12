"use client";

import React, { useEffect, useState } from "react";
import { Search, Diamond, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parsedDevise } from "@/lib/utils";
import useStore from "@/lib/store-manage";
import { GamePaymentDialog } from "./game-payment-dialog";
import { useScopedI18n } from "@/locales/client";
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

interface CategoryGameProps {
  categoryname: string;
  accounts: Account[];
}

interface Licence {
  licence: string;
  count: number;
}

const CategoryGame = ({
  categoryname,
  accounts: initialAccounts,
}: CategoryGameProps) => {
  const t = useScopedI18n("virtualGame");
  const tScope2 = useScopedI18n("navbar");
  const { devise } = useStore();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recommended" | "lowest">("recommended");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [licences, setLicences] = useState<Licence[]>([]);
  const [selectedLicence, setSelectedLicence] = useState<string | null>(null);
  const [loadingLicences, setLoadingLicences] = useState(true);

  // Récupérer les licences distinctes pour cette catégorie
  useEffect(() => {
    const fetchLicences = async () => {
      try {
        setLoadingLicences(true);
        const response = await fetch(
          `/api/go/accounts/category-licences?category=${categoryname}`
        );
        const data = await response.json();
        console.log(data);
        setLicences(data);
      } catch (error) {
        console.error("Error fetching licences:", error);
      } finally {
        setLoadingLicences(false);
      }
    };

    fetchLicences();
  }, [categoryname]);

  useEffect(() => {
    let filtered = [...initialAccounts];

    // Filtrer par licence (normaliser pour éviter les problèmes de casse/espaces)
    if (selectedLicence) {
      const normalizedSelectedLicence = selectedLicence.toLowerCase().trim();
      filtered = filtered.filter(
        (account) =>
          (account.licence || "").toLowerCase().trim() ===
          normalizedSelectedLicence
      );
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (account) =>
          account.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          account.licence.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Trier
    if (sortBy === "lowest") {
      // Tri du prix le plus bas au plus haut
      filtered.sort((a, b) => a.price - b.price);
    } else {
      // Recommandé : par stock disponible d'abord, puis par prix
      filtered.sort((a, b) => {
        if (a.stock > 0 && b.stock === 0) return -1;
        if (a.stock === 0 && b.stock > 0) return 1;
        return a.price - b.price;
      });
    }

    setAccounts(filtered);
    setCurrentPage(1); // Réinitialiser à la page 1 quand la recherche ou le tri change
  }, [searchQuery, sortBy, initialAccounts, selectedLicence]);

  const handleAccountClick = (account: Account) => {
    if (account.stock > 0 && account.status !== "rupture de stock") {
      // Rediriger vers la page de détails
      router.push(`/marketplace/${account.licence}/${account._id}`);
    }
  };

  // Grouper les comptes par description pour compter les offres
  const groupedAccounts = accounts.reduce(
    (acc, account) => {
      const key = account.description;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(account);
      return acc;
    },
    {} as Record<string, Account[]>
  );

  const accountGroups = Object.entries(groupedAccounts).map(
    ([description, accounts]) => ({
      description,
      accounts,
      count: accounts.length,
      minPrice: Math.min(...accounts.map((a) => a.price)),
    })
  );

  // Calcul de la pagination
  const totalPages = Math.ceil(accountGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = accountGroups.slice(startIndex, endIndex);

  // Fonctions de navigation
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Format du nom de catégorie
  const formatCategoryName = (name: string) => {
    if (name.includes("-")) {
      return name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Format du nom de licence
  const formatLicenceName = (name: string) => {
    if (name.includes("-")) {
      return name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const categoryDisplayName = formatCategoryName(categoryname);

  return (
    <div className="min-h-screen bg-[#1A1D21] text-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-yellow-600 transition-colors">
            {t("home")}
          </Link>
          <span>»</span>
          <Link
            href="/marketplace"
            className="hover:text-yellow-600 transition-colors"
          >
            {tScope2("game")}
          </Link>
          <span>»</span>
          <span className="text-white">{categoryDisplayName}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {categoryDisplayName.toUpperCase()}
          </h1>
          <p className="text-gray-400">
            {accounts.length}{" "}
            {accounts.length === 1
              ? t("accountAvailable")
              : t("accountsAvailable")}
          </p>
        </div>

        {/* Section Licences */}
        {!loadingLicences && licences.length > 0 && (
          <div className="w-full mb-8 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-3 w-full max-w-6xl">
              <button
                onClick={() => setSelectedLicence(null)}
                className={`px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedLicence === null
                    ? "bg-yellow-600 text-black border border-yellow-600"
                    : "bg-[#2A2D30] border border-gray-700 hover:bg-[#363A3D] hover:border-gray-600 text-white"
                }`}
              >
                <span className="text-sm font-medium">Tous</span>
              </button>
              {licences.map((lic) => {
                return (
                  <button
                    key={lic.licence}
                    onClick={() => setSelectedLicence(lic.licence)}
                    className={`px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                      selectedLicence === lic.licence
                        ? "bg-yellow-600 text-black border border-yellow-600"
                        : "bg-[#2A2D30] border border-gray-700 hover:bg-[#363A3D] hover:border-gray-600"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        selectedLicence === lic.licence
                          ? "text-black"
                          : "text-white group-hover:text-yellow-600"
                      }`}
                    >
                      {formatLicenceName(lic.licence)}
                    </span>
                    <span
                      className={`ml-2 text-xs ${
                        selectedLicence === lic.licence
                          ? "text-black/70"
                          : "text-gray-400"
                      }`}
                    >
                      ({lic.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading skeleton pour les licences */}
        {loadingLicences && (
          <div className="w-full mb-8 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-3 w-full max-w-6xl">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-32 bg-[#2A2D30] rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#2A2D30] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-600 transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{t("sortBy")}</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value="recommended"
                  checked={sortBy === "recommended"}
                  onChange={() => setSortBy("recommended")}
                  className="w-4 h-4 text-yellow-600"
                />
                <span className="text-white">{t("recommended")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value="lowest"
                  checked={sortBy === "lowest"}
                  onChange={() => setSortBy("lowest")}
                  className="w-4 h-4 text-yellow-600"
                />
                <span className="text-white">{t("lowestPrice")}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-4">
          <p className="text-gray-400">
            {t("about")} {accountGroups.length}{" "}
            {accountGroups.length === 1 ? t("result") : t("results")}
          </p>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedGroups.map((group, index) => {
            const availableAccounts = group.accounts.filter(
              (a) => a.stock > 0 && a.status !== "rupture de stock"
            );
            const isAvailable = availableAccounts.length > 0;
            const displayAccount = availableAccounts[0] || group.accounts[0];

            return (
              <Card
                key={index}
                onClick={() =>
                  isAvailable && handleAccountClick(displayAccount)
                }
                className={`relative bg-[#2A2D30] border border-gray-700 rounded-lg p-5 cursor-pointer hover:border-yellow-600 hover:shadow-xl hover:shadow-yellow-600/20 hover:scale-[1.02] transition-all duration-300 overflow-hidden group ${
                  !isAvailable ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/0 to-yellow-600/0 group-hover:from-yellow-600/5 group-hover:to-transparent transition-all duration-300 pointer-events-none"></div>

                <div className="relative z-10">
                  {/* Titre du produit en haut */}
                  <h3 className="text-sm font-semibold text-white/90 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {group.description}
                  </h3>

                  {/* Nom de la licence */}
                  <p className="text-xs font-bold text-white/70 mb-3 tracking-wider">
                    {formatLicenceName(displayAccount.licence).toUpperCase()}
                  </p>

                  {/* Catégorie */}
                  <p className="text-xs font-bold text-white/70 mb-3 tracking-wider">
                    {tScope2(
                      displayAccount.category.trim().toLowerCase() === "game"
                        ? "game-name"
                        : (displayAccount.category.trim().toLowerCase() as
                            | "accounts"
                            | "gift-cards"
                            | "game-coins"
                            | "item"
                            | "software-and-app"
                            | "carte-prepayees")
                    )}
                  </p>

                  {/* Description avec icône diamant */}
                  <div className="flex items-center gap-2 text-cyan-400 mb-4">
                    <Diamond className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">
                      {group.description}
                    </span>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="flex items-center gap-3 mb-3 justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{t("minQty")}</span>
                      <span className="text-white">
                        {displayAccount.minQ || 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{t("stock")}</span>
                      <span
                        className={`font-semibold ${
                          displayAccount.stock > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {displayAccount.stock || 0}
                      </span>
                    </div>
                  </div>

                  {/* Prix et offres en bas */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700">
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">
                        {group.count}{" "}
                        {group.count === 1 ? t("offer") : t("offers")}
                      </p>
                      <p className="text-base font-bold text-yellow-600">
                        {t("startingFrom")}{" "}
                        {(
                          group.minPrice *
                          (devise.curencyVal || 1) *
                          (displayAccount.minQ || 1)
                        ).toFixed(2)}{" "}
                        {parsedDevise(devise.currencyName)}
                      </p>
                    </div>
                    {!isAvailable && (
                      <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded ml-2">
                        {displayAccount.status || t("unavailable")}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-[#2A2D30] text-gray-600 cursor-not-allowed"
                    : "bg-[#2A2D30] text-white hover:bg-[#363A3D]"
                } transition-colors`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-yellow-600 text-black font-semibold"
                        : "bg-[#2A2D30] text-white hover:bg-[#363A3D]"
                    } transition-colors`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-[#2A2D30] text-gray-600 cursor-not-allowed"
                    : "bg-[#2A2D30] text-white hover:bg-[#363A3D]"
                } transition-colors`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Informations de pagination */}
            <p className="text-sm text-gray-400">
              {t("page")} {currentPage} {t("of")} {totalPages} (
              {accountGroups.length}{" "}
              {accountGroups.length === 1 ? t("result") : t("results")})
            </p>
          </div>
        )}

        {/* Dialog de paiement */}
        {selectedAccount && (
          <GamePaymentDialog
            isOpen={isPaymentDialogOpen}
            onClose={() => {
              setIsPaymentDialogOpen(false);
              setSelectedAccount(null);
            }}
            product={{
              id: parseInt(selectedAccount._id.slice(-6), 16) || 1,
              amount: `${selectedAccount.minQ} compte${selectedAccount.minQ > 1 ? "s" : ""}`,
              bonus: selectedAccount.moreDetails ? undefined : undefined,
              price: selectedAccount.price * (selectedAccount.minQ || 1),
            }}
            gameTitle={selectedAccount.description}
            account={selectedAccount}
            quantity={selectedAccount.minQ || 1}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryGame;
