import React from "react";
import VendreKamasClient from "../components/VendreKamasClient";

import { Metadata } from "next";

// Métadonnées de la page pour la vente
export const metadata: Metadata = {
  title:
    "Vendre des kamas Dofus - Vente de Kamas Dofus - Prix le Plus Bas & Livraison Rapide | IBendouma",
  description:
    "Vendez vos Kamas Dofus en toute sécurité sur ibendouma. Livraison rapide, prix compétitifs, paiement sécurisé. Service client 24/7. ✓ Transactions Sécurisées ✓ Livraison Express",
  keywords:
    "vente kamas, acheter kamas, echanger kamas, kamas dofus, dofus touch, dofus retro, prix kamas, kamas pas cher, kamas sécurisé, vente kamas dofus, vente de kamas sécurisé, kamas rapide, livraison kamas rapide, kamas en stock, kamas fiable, transaction rapide kamas, meilleurs prix kamas",
  openGraph: {
    title: "Vente de Kamas Dofus - Prix le Plus Bas & Livraison Rapide",
    description:
      "Vendez vos Kamas Dofus en toute sécurité. Prix compétitifs, paiement sécurisé, livraison rapide. Service client disponible 24/7.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/dofus-images/dofus-kamas.png",
        width: 1200,
        height: 630,
        alt: "Vendez vos kamas Dofus sur ibendouma",
      },
    ],
  },
  alternates: {
    canonical: "https://ibendouma.com/vendre-des-kamas",
    languages: {
      "en-US": "https://ibendouma.com/en/vendre-des-kamas",
      "fr-FR": "https://ibendouma.com/fr/vendre-des-kamas",
      "es-ES": "https://ibendouma.com/es/vendre-des-kamas",
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

const VendreDesKamas = () => {
  return <VendreKamasClient />;
};

export default VendreDesKamas;
