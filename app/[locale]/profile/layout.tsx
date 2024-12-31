"use client";

import { useCurrentLocale, useScopedI18n } from "@/locales/client";
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
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const tScope = useScopedI18n("sidebar");
  const pathname = usePathname();
  const locale = useCurrentLocale();

  //   console.log(pathname)
  const profileItems = [
    {
      href: "/profile",
      label: tScope("profile"),
      icon: User,
      traduct: "profile",
      size: 24,
    },
    {
      href: "/profile/orders-buys",
      label: tScope("ordersBuy"),
      icon: ShoppingBag,
      traduct: "ordersBuy",
      size: 22,
    },
    {
      href: "/profile/order-sell",
      label: tScope("ordersSell"),
      icon: TrendingUp,
      traduct: "ordersSell",
      size: 24,
    },
    {
      href: "/profile/exchange",
      label: tScope("exchange"),
      icon: BarChart2,
      traduct: "exchange",
      size: 24,
    },
    {
      href: "/profile/update-profile",
      label: tScope("updateProfile"),
      icon: Settings,
      traduct: "updateProfile",
      size: 24,
    },
  ];

  const handleLogout = async () => {
    const data = JSON.stringify({ userId: session?.user.id, online: false });
    await navigator.sendBeacon("/api/users-status-changed", data);
    await signOut();
  };

  return (
    <div className="flex h-screen font-poppins">
      {/* Barre latérale */}
      <div className="h-full flex flex-col items-start justify-between bg-[#1A1D21] text-white px-6 border-r border-gray-700 w-20 sm:w-64">
        <div>
          <Link href="/" className="flex items-center gap-2 -ml-4">
            <Image
              src="/ibennewapp-logo.png"
              alt="ibendouma logo"
              height={70}
              width={70}
              className="max-sm:w-[60px] max-sm:h-[60px] object-cover"
            />
            <span className="sr-only">2Iben logo</span>
            <span className="max-sm:hidden text-2xl font-extrabold -ml-3 text-gray-300">
              ibendouma
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
                <item.icon className="" size={item.size} />
                <span className="max-sm:hidden">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <button
          className="flex items-center gap-2 text-gray-300 bottom-0 py-6 px-2 transition-colors hover:opacity-75"
          onClick={handleLogout}
          aria-label="logout button"
        >
          <LogOut size={24} />
          <span className="max-sm:hidden">{tScope("logout")}</span>
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-2 sm:p-6 overflow-y-auto profile-user">
        {children}
      </div>
    </div>
  );
}
