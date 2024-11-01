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
  title: "2ibn",
  description:
    "Acheter, vendre et echanger vos kamas dofus, dofus touch et dofus retro sur 2ibn",
  icons: {
    icon: "/ibennewapp-logo.png",
    shortcut: "/ibennewapp-logo.png",
    apple: "/ibennewapp-logo.png",
  },
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={params.locale}>
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
