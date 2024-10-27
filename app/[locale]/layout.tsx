import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

import { Toaster } from "sonner";
import { Providers } from "./providers";
import QueryProvider from "./components/QueryProvider";
import Navbar from "./components/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
          "w-full h-full antialiased font-sans"
        )}
      >
        <div className="relative w-full h-full home-all">
          <Providers locale={params.locale}>
            <QueryProvider>
              <Navbar />
              <Toaster />
              {children}
            </QueryProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
