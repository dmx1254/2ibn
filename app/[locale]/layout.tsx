import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

import { Toaster } from "sonner";
import { Providers } from "./providers";
import QueryProvider from "./components/QueryProvider";
import Navbar from "./components/Navbar";
import { ProviderSession } from "./components/session-providers";
import Footer from "./components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "2ibn - Achat, Vente et Échange de Kamas Dofus | Plateforme Sécurisée",
  description:
    "La référence pour acheter, vendre et échanger vos kamas Dofus, Dofus Touch et Dofus Retro. ✓ Paiement Sécurisé ✓ Livraison Express ✓ Service Client 24/7 ✓ Meilleurs Prix Garantis",
  icons: {
    icon: "/ibennewapp-logo.png",
    shortcut: "/ibennewapp-logo.png",
    apple: "/ibennewapp-logo.png",
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
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://2ibn.com",
    siteName: "2ibn",
    title: "2ibn - Plateforme d'Achat, Vente et Échange de Kamas Dofus",
    description:
      "Votre marketplace de confiance pour les kamas Dofus. Transactions sécurisées, prix compétitifs et service client réactif.",
    images: [
      {
        url: "/dofus-images/dofus-kamas.png", // Assurez-vous d'avoir cette image
        width: 1200,
        height: 630,
        alt: "Plateforme 2ibn - Marketplace de Kamas Dofus",
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@2ibn",
    creator: "@2ibn",
    title: "2ibn - Marketplace de Kamas Dofus",
    description:
      "Achetez, vendez et échangez vos kamas Dofus en toute sécurité sur 2ibn. Prix compétitifs et livraison rapide.",
    images: ["/dofus-images/dofus-kamas.png"],
  },
  alternates: {
    canonical: "https://2ibn.com",
    languages: {
      "en-US": "https://2ibn.com/en",
      "fr-FR": "https://2ibn.com/fr",
      "es-ES": "https://2ibn.com/es",
    },
  },
  category: "marketplace",
  referrer: "origin-when-cross-origin",
  authors: [{ name: "2ibn" }],
  creator: "2ibn",
  publisher: "2ibn",
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const isRTL = params.locale === "ar";
  return (
    <html lang={params.locale} dir={isRTL ? "rtl" : "ltr"}>
      <body
        className={clsx(
          poppins.variable,
          "w-full h-full antialiased font-sans bg-gray-50"
        )}
      >
        <div className="relative w-full h-full home-all">
          <Providers locale={params.locale}>
            <QueryProvider>
              <ProviderSession>
                <Navbar />
                <Toaster />
                {children}
                <Footer />
              </ProviderSession>
            </QueryProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
