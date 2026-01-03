"use client";

import React, { useState, useEffect } from "react";
import {
  Diamond,
  Zap,
  Package,
  Share2,
  ChevronRight,
  ThumbsUp,
  Calendar,
  Award,
  User,
  MessageCircle,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { FaFacebookF, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Card } from "./ui/card";
import Link from "next/link";
import { convertTime, parsedDevise } from "@/lib/utils";
import useStore from "@/lib/store-manage";
import { GamePaymentDialog } from "./game-payment-dialog";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";

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

interface AccountDetailsProps {
  account: Account;
  gamename: string;
  relatedAccounts: Account[];
  hasMoreRelated: boolean;
}

// Données des achats récents (5 exemples)
const recentPurchases = [
  { name: "conrad", date: "27 décembre 2025" },
  { name: "Alexandre", date: "26 décembre 2025" },
  { name: "Ismail", date: "25 décembre 2025" },
  { name: "Nasser", date: "24 décembre 2025" },
  { name: "Ayoub", date: "23 décembre 2025" },
];

const AccountDetails = ({
  account,
  gamename,
  relatedAccounts,
  hasMoreRelated = false,
}: AccountDetailsProps) => {
  const t = useScopedI18n("accountDetails");
  const tScope2 = useScopedI18n("navbar");
  const { devise } = useStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(account.minQ || 1);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [currentPurchaseIndex, setCurrentPurchaseIndex] = useState(0);

  // Convertir le slug en nom de licence
  const licenceName = gamename
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Extraire le niveau de la description (ex: "lvl 200" ou "lvl200")
  const extractLevel = (description: string): string | null => {
    const match = description.match(/lvl\s*(\d+)/i);
    return match ? match[1] : null;
  };

  const level = extractLevel(account.description);

  // console.log(account);

  // Calcul du prix total (prix en dirham, convertir en devise actuelle)
  const totalPrice = account.price * quantity * (devise.curencyVal || 1);
  const isAvailable =
    account.stock > 0 && account.status !== "rupture de stock";

  // Fonction pour ouvrir Tawk chat
  const handleChatClick = () => {
    //@ts-expect-error - Tawk_API is not defined in the global scope
    void window?.Tawk_API?.toggle();
  };

  const handleBuyNow = () => {
    if (!session?.user?.id) {
      // Rediriger vers la page de connexion
      router.push("/signin");
      return;
    }
    if (isAvailable) {
      setIsPaymentDialogOpen(true);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(
      account.minQ || 1,
      Math.min(account.stock, quantity + delta)
    );
    setQuantity(newQuantity);
  };

  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/video-game/${gamename}/${account._id}`;
  const text = `Découvrez ce compte ${licenceName} disponible : ${account.description} (Niveau: ${level || "?"})`;

  const handleShareFacebook = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      "_blank",
      "width=600,height=600"
    );
    setIsShareMenuOpen(false);
  };

  const handleShareTwitter = () => {
    const shareText = encodeURIComponent(text);
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      "_blank",
      "width=600,height=600"
    );
    setIsShareMenuOpen(false);
  };

  const handleShareWhatsApp = () => {
    const shareText = encodeURIComponent(text);
    const shareUrl = encodeURIComponent(url);
    window.open(`https://wa.me/?text=${shareText}%20${shareUrl}`, "_blank");
    setIsShareMenuOpen(false);
  };

  const handleShareTelegram = () => {
    const shareText = encodeURIComponent(text);
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
      "_blank"
    );
    setIsShareMenuOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success(t("linkCopied"));
      } else {
        // Fallback pour les anciens navigateurs
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success(t("linkCopied"));
      }
      setIsShareMenuOpen(false);
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
      toast.error(t("copyError"));
    }
  };

  const handleShareClick = () => {
    // Désactiver temporairement le partage natif pour éviter les erreurs
    // Utiliser directement le menu déroulant qui est plus fiable
    setIsShareMenuOpen(true);

    // Code commenté pour référence future si besoin d'activer le partage natif
    // if (typeof window !== "undefined" && typeof navigator !== "undefined" && "share" in navigator) {
    //   const shareFn = (navigator as { share?: (data: ShareData) => Promise<void> }).share;
    //   if (shareFn && typeof shareFn === "function") {
    //     handleShareNative();
    //     return;
    //   }
    // }
  };

  // Carrousel automatique pour les achats récents
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPurchaseIndex((prevIndex) =>
        prevIndex === recentPurchases.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change toutes les 3 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1D21] text-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-yellow-600 transition-colors">
            {t("home")}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href="/marketplace"
            className="hover:text-yellow-600 transition-colors"
          >
            {tScope2("game")}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/marketplace/${gamename}`}
            className="hover:text-yellow-600 transition-colors"
          >
            {gamename.includes("-")
              ? gamename
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              : gamename.toUpperCase()}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{account.description}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Titre et bouton partager */}
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-white">
                {account.description}
              </h1>
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={handleShareClick}
                  className="flex items-center gap-2 bg-[#2A2D30] border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg px-4 py-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">{t("share")}</span>
                </Button>

                {/* Menu de partage */}
                {isShareMenuOpen && (
                  <>
                    {/* Overlay pour fermer le menu */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsShareMenuOpen(false)}
                    />
                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-[#2A2D30] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                      <div className="py-1">
                        <button
                          onClick={handleShareFacebook}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          <FaFacebookF className="w-5 h-5 text-blue-500" />
                          <span>{t("facebook")}</span>
                        </button>
                        <button
                          onClick={handleShareTwitter}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          <FaXTwitter className="w-5 h-5 text-gray-300" />
                          <span>{t("twitter")}</span>
                        </button>
                        <button
                          onClick={handleShareWhatsApp}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          <FaWhatsapp className="w-5 h-5 text-green-500" />
                          <span>{t("whatsapp")}</span>
                        </button>
                        <button
                          onClick={handleShareTelegram}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          <FaTelegramPlane className="w-5 h-5 text-blue-400" />
                          <span>{t("telegram")}</span>
                        </button>
                        <div className="border-t border-gray-700 my-1" />
                        <button
                          onClick={handleCopyLink}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          <Copy className="w-5 h-5" />
                          <span>{t("copyLink")}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Carte du produit */}
            <Card className="bg-[#2A2D30] border border-gray-700 rounded-lg p-8">
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="bg-black rounded-lg p-6 mb-4 w-full max-w-md">
                  <p className="text-white text-center text-lg mb-2">
                    {account.description}
                  </p>
                  <p className="text-white text-center text-2xl font-bold">
                    {licenceName.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <Diamond className="w-5 h-5" />
                  <span>{account.description}</span>
                </div>
              </div>
            </Card>

            {/* Informations sur le produit */}
            <Card className="bg-[#2A2D30] border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {t("productInfo")}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <div>
                    <span className="text-gray-400">{t("deliverySpeed")} </span>
                    <span className="text-white font-semibold">
                      {account.deliveryDelay === 0
                        ? t("instant")
                        : `${convertTime(Number(account.deliveryDelay))}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-yellow-600" />
                  <div>
                    <span className="text-gray-400">
                      {t("deliveryMethod")}{" "}
                    </span>
                    <span className="text-white font-semibold">
                      {t("directRecharge")}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">
                    {t("nominalComplement")}{" "}
                  </span>
                  <span className="text-white font-semibold">
                    {account.description}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    • {t("totalAmount")} {account.description}
                  </p>
                  <p>◆ {t("whyChooseUs")}</p>
                  <p>
                    ➤ Chez ibendouma, nous nous engageons à offrir un service de
                    qualité, sécurisé et rapide pour tous vos besoins en kamas,
                    comptes de jeux, objets, coins et cartes cadeaux. Voici
                    pourquoi vous devriez choisir notre plateforme : Service
                    client disponible 24/7, transactions sécurisées avec
                    protection avancée, livraison instantanée garantie, prix
                    compétitifs et satisfaction client assurée.
                  </p>
                </div>
                {account.moreDetails && (
                  <div className="pt-2">
                    <p className="text-gray-300 text-sm">
                      {account.moreDetails}
                    </p>
                  </div>
                )}
                <Link
                  href="#"
                  className="text-yellow-600 hover:underline text-sm"
                >
                  {t("seeMore")}
                </Link>
              </div>
            </Card>

            {/* Autres dénominations */}
            {relatedAccounts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t("otherDenominations")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedAccounts.map((relatedAccount) => {
                    const relatedPrice =
                      relatedAccount.price *
                      (relatedAccount.minQ || 1) *
                      (devise.curencyVal || 1);

                    return (
                      <Link
                        key={relatedAccount._id}
                        href={`/marketplace/${gamename}/${relatedAccount._id}`}
                      >
                        <Card className="bg-[#2A2D30] border border-gray-700 rounded-lg p-4 hover:border-yellow-600 transition-colors cursor-pointer">
                          <div className="bg-black rounded p-3 mb-3">
                            <p className="text-white text-sm text-center font-semibold">
                              {gamename.includes("-")
                                ? gamename
                                    .split("-")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")
                                : gamename.toUpperCase()}
                            </p>
                            <p className="text-white text-xs text-center mt-1">
                              {relatedAccount.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-green-400 text-xs">
                              <ThumbsUp className="w-4 h-4" />
                              <span>99,71%</span>
                            </div>
                            <p className="text-yellow-600 font-bold">
                              {t("startingFrom")} {relatedPrice.toFixed(2)}{" "}
                              {parsedDevise(devise.currencyName)}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
                {hasMoreRelated && (
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    {t("showMore")}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#2A2D30] border border-gray-700 rounded-lg p-6 sticky top-4">
              {/* Disponibilité */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">
                  {account.stock > 0 ? (
                    <span className="text-green-400 font-semibold">
                      {account.stock.toLocaleString()} {t("available")}
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold">
                      {t("outOfStock")}
                    </span>
                  )}
                </p>
              </div>

              {/* Sélecteur de quantité */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">
                  {t("quantity")}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= (account.minQ || 1)}
                    className="w-10 h-10 rounded-lg border border-gray-700 bg-[#1A1D21] text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = Math.max(
                        account.minQ || 1,
                        Math.min(
                          account.stock,
                          parseInt(e.target.value) || account.minQ || 1
                        )
                      );
                      setQuantity(val);
                    }}
                    min={account.minQ || 1}
                    max={account.stock}
                    className="w-20 h-10 rounded-lg border border-gray-700 bg-[#1A1D21] text-white text-center focus:outline-none focus:border-yellow-600"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= account.stock}
                    className="w-10 h-10 rounded-lg border border-gray-700 bg-[#1A1D21] text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Montant total */}
              <div className="mb-6 pb-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{t("totalAmountLabel")}</span>
                  <span className="text-2xl font-bold text-white">
                    {totalPrice.toFixed(2)} {parsedDevise(devise.currencyName)}
                  </span>
                </div>
              </div>

              {/* Bouton Acheter maintenant */}
              <Button
                onClick={handleBuyNow}
                disabled={!isAvailable}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {t("buyNow")}
              </Button>

              {/* Note du vendeur */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-700">
                <ThumbsUp className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">100,00%</span>
                <span className="text-gray-400">1440 {t("sold")}</span>
              </div>

              {/* Informations du vendeur */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                    I
                  </div>
                  <div>
                    <p className="text-white font-semibold">IBENDOUMA</p>
                    <p className="text-gray-400 text-sm">
                      {level ? `Niveau ${level}` : "Niveau 152"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    4,2k
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleChatClick}
                    className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t("chat")}
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>99,86% {t("successfulDeliveries")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{t("registeredOn")} 20 octobre 2017</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{t("overallRating")} 99,71 %</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Award className="w-4 h-4" />
                    <span>{t("legendarySeller")}</span>
                  </div>
                </div>
              </div>

              {/* Achats récents vérifiés */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">
                    {t("recentVerifiedPurchases")}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {recentPurchases[currentPurchaseIndex].name
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        {recentPurchases[currentPurchaseIndex].name}
                      </p>
                      <div className="flex items-center gap-2 text-green-400 text-xs">
                        <ThumbsUp className="w-3 h-3" />
                        <span>
                          {recentPurchases[currentPurchaseIndex].date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 justify-center mt-4">
                  {recentPurchases.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPurchaseIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentPurchaseIndex
                          ? "bg-red-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      aria-label={`Achat ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de paiement */}
      {isPaymentDialogOpen && (
        <GamePaymentDialog
          isOpen={isPaymentDialogOpen}
          onClose={() => setIsPaymentDialogOpen(false)}
          product={{
            id: parseInt(account._id.slice(-6), 16) || 1,
            amount: `${quantity} compte${quantity > 1 ? "s" : ""}`,
            bonus: undefined,
            price: account.price * quantity,
          }}
          gameTitle={account.description}
          account={account}
          quantity={quantity}
        />
      )}
    </div>
  );
};

export default AccountDetails;
