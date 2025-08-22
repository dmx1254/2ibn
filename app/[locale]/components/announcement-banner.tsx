"use client";

import { useEffect, useState } from "react";
import { useCurrentLocale } from "@/locales/client";
import { usePathname } from "next/navigation";

export const AnnouncementBanner = () => {
  const pathname = usePathname();
  const locale = useCurrentLocale();
  const [data, setData] = useState<{
    mainting: { mainting: boolean; message: string };
    promotion: { promotion: boolean; message: string };
    update: { update: boolean; message: string };
  } | null>(null);

  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/iben/mainting");
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  // Vérifier si une bannière doit être affichée
  const shouldShowBanner =
    data?.mainting?.mainting ||
    data?.promotion?.promotion ||
    data?.update?.update;

  // Obtenir le message à afficher
  const getMessage = () => {
    if (data?.mainting?.mainting) return data.mainting.message;
    if (data?.promotion?.promotion) return data.promotion.message;
    if (data?.update?.update) return data.update.message;
    return "";
  };

  // Ne pas afficher la bannière si on est sur les pages d'auth ou si aucun booléen n'est true
  if (
    pathname === `/${locale}/profile` ||
    pathname === `/${locale}/signup` ||
    pathname === `/${locale}/signin` ||
    pathname === `/${locale}/resetpassword` ||
    pathname === `/${locale}/reset-password` ||
    !shouldShowBanner
  ) {
    return null;
  }

  return (
    <div className="z-[100] top-0 left-0 right-0 bg-yellow-500 text-black overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        <span className="mx-4 py-2 inline-block text-base text-black/90">{getMessage()}</span>
      </div>
    </div>
  );
};
