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
import CookieConsent from "./components/CookieConsent";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title:
    "ibendouma - Achat, Vente et Échange de Kamas Dofus | Plateforme Sécurisée",
  description:
    "La référence pour acheter, vendre et échanger vos kamas Dofus, Dofus Touch et Dofus Retro. ✓ Paiement Sécurisé ✓ Livraison Express ✓ Service Client 24/7 ✓ Meilleurs Prix Garantis",
  icons: {
    icon: "/favlogo.png",
    shortcut: "/favlogo.png",
    apple: "/favlogo.png",
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
    url: "https://ibendouma.com",
    siteName: "ibendouma",
    title: "ibendouma - Plateforme d'Achat, Vente et Échange de Kamas Dofus",
    description:
      "Votre marketplace de confiance pour les kamas Dofus. Transactions sécurisées, prix compétitifs et service client réactif.",
    images: [
      {
        url: "/dofus-images/dofus-kamas.png",
        width: 1200,
        height: 630,
        alt: "Plateforme ibendouma - Marketplace de Kamas Dofus",
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@ibendouma",
    creator: "@ibendouma",
    title: "ibendouma - Marketplace de Kamas Dofus",
    description:
      "Achetez, vendez et échangez vos kamas Dofus en toute sécurité sur ibendouma. Prix compétitifs et livraison rapide.",
    images: ["/dofus-images/dofus-kamas.png"],
  },
  alternates: {
    canonical: "https://ibendouma.com",
    languages: {
      "en-US": "https://ibendouma.com/en",
      "fr-FR": "https://ibendouma.com/fr",
      "es-ES": "https://ibendouma.com/es",
    },
  },
  category: "marketplace",
  referrer: "origin-when-cross-origin",
  authors: [{ name: "ibendouma" }],
  creator: "ibendouma",
  publisher: "ibendouma",
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
      <head>
        <Script
          id="tawk-to-inline"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/5ef8a6b84a7c6258179b7d5d/1fav89jc0';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `,
          }}
        />
      </head>
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
            <CookieConsent />
          </Providers>
        </div>
      </body>
    </html>
  );
}
