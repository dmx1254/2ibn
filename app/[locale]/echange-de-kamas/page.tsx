import React from "react";
import EchangeKamasClient from "../components/EchangeKamasClient";
import { Metadata } from "next";

// Métadonnées de la page pour l'échange de kamas
export const metadata: Metadata = {
  title: "Échange de kamas Dofus - Échangez vos Kamas en Toute Sécurité | 2ibn",
  description:
    "Échangez vos Kamas Dofus, Touch et Retro de manière sécurisée sur 2ibn. Service d'échange rapide et fiable, taux compétitifs. Service client 24/7. ✓ Transactions Sécurisées ✓ Échange Instantané",
  keywords:
    "echange kamas, echange kams sur 2ibn, echanger kamas, kamas dofus, dofus touch, dofus retro, taux echange kamas, echange securise, transfert kamas, kamas cross serveur, echange de kamas sécurisé, kamas rapide, livraison kamas rapide, kamas en stock, echange kamas fiable, transaction rapide kamas, meilleurs taux echange kamas",
  openGraph: {
    title: "Échange de Kamas Dofus - Service Sécurisé & Instantané",
    description:
      "Échangez vos Kamas Dofus entre serveurs en toute sécurité. Taux compétitifs, échange instantané, service client disponible 24/7.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/dofus-images/dofus-kamas-exchange.png",
        width: 1200,
        height: 630,
        alt: "Échangez vos kamas Dofus sur 2ibn",
      },
    ],
  },
  alternates: {
    canonical: "https://2ibn.com/echange-de-kamas",
    languages: {
      "en-US": "https://2ibn.com/en/echange-de-kamas",
      "fr-FR": "https://2ibn.com/fr/echange-de-kamas",
      "es-ES": "https://2ibn.com/es/echange-de-kamas",
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
  category: 'gaming',
  referrer: 'origin-when-cross-origin',
  authors: [{ name: '2ibn' }],
  creator: '2ibn',
  publisher: '2ibn',
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
};

const EchangeDeKamas = () => {
  return <EchangeKamasClient />;
};

export default EchangeDeKamas;
