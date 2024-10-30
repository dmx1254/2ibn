"use client";

import { useCurrentLocale } from "@/locales/client";
import clsx from "clsx";
import {
  BarChart2,
  Settings,
  ShoppingBag,
  TrendingUp,
  User,
  LogOut,
} from "lucide-react";
import type { Metadata } from "next";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const locale = useCurrentLocale();

  //   console.log(pathname)
  const profileItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/profile/orders-buys", label: "Orders Buy", icon: ShoppingBag },
    { href: "/profile/order-sell", label: "Orders Sell", icon: TrendingUp },
    { href: "/profile/exchange", label: "Exchange", icon: BarChart2 },
    {
      href: "/profile/update-profile",
      label: "Update Profile",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen font-poppins">
      {/* Barre latérale */}
      <div className="h-full flex flex-col items-start justify-between bg-[#1A1D21] text-white px-6 border-r border-gray-700 w-64">
        <div>
          <Link href="/" className="flex items-center gap-2 -ml-4">
            <Image
              src="/ibennewapp-logo.png"
              alt="ibendouma logo"
              height={70}
              width={70}
              className=""
            />
            <span className="sr-only">2Iben logo</span>
            <span className="max-sm:hidden text-2xl font-extrabold -ml-3 text-gray-300">
              2Ibn
            </span>
          </Link>
          <div className="flex flex-col items-start gap-6 w-full py-6">
            {profileItems.map((item) => (
              <Link
                key={item.label}
                className={clsx("flex items-center gap-2 transition-colors", {
                  "text-yellow-600": pathname === `/${locale}${item.href}`,
                  "text-gray-300 hover:text-yellow-600":
                    pathname !== `/${locale}${item.href}`,
                })}
                href={item.href}
              >
                <item.icon className="" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <button
          className="flex items-center gap-2 text-gray-300 bottom-0 py-6 px-2 transition-colors hover:opacity-75"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
    </div>
  );
}
