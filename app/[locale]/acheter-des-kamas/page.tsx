import { SearchParamProps } from "@/lib/types/types";
import React from "react";
import { Metadata } from "next";
import AchatKamasClient from "../components/AchatKamasClient";

export const metadata: Metadata = {
  title: "Acheter des Kamas Dofus - Achat Sécurisé et Instantané | ibendouma",
  description:
    "Achetez des Kamas Dofus, Touch et Retro de manière sécurisée sur ibendouma. Service d'achat rapide et fiable, taux compétitifs. Service client disponible 24/7. ✓ Transactions Sécurisées ✓ Livraison Instantanée",
  keywords:
    "acheter kamas, achat kamas sur ibendouma, acheter kamas dofus, kamas dofus, dofus touch, dofus retro, taux achat kamas, achat sécurisé kamas, livraison kamas rapide, kamas en stock, achat kamas fiable, transaction rapide kamas, meilleurs taux achat kamas",
  openGraph: {
    title: "Acheter des Kamas Dofus - Achat Sécurisé et Instantané",
    description:
      "Achetez vos Kamas Dofus en toute sécurité. Taux compétitifs, livraison instantanée, service client disponible 24/7.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/dofus-images/dofus-kamas-buy.png",
        width: 1200,
        height: 630,
        alt: "Achetez vos kamas Dofus sur ibendouma",
      },
    ],
  },
  alternates: {
    canonical: "https://ibendouma.com/acheter-des-kamas",
    languages: {
      "en-US": "https://ibendouma.com/en/acheter-des-kamas",
      "fr-FR": "https://ibendouma.com/fr/acheter-des-kamas",
      "es-ES": "https://ibendouma.com/es/acheter-des-kamas",
    },
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "gaming",
  referrer: "origin-when-cross-origin",
  authors: [{ name: "ibendouma" }],
  creator: "ibendouma",
  publisher: "ibendouma",
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
};

const AchatDeKamas = ({ searchParams }: SearchParamProps) => {
  const dofusName = searchParams.category as string;
  return <AchatKamasClient dofusName={dofusName} />;
};

export default AchatDeKamas;
