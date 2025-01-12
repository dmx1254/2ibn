"use client";

import React from "react";

import Link from "next/link";
import {
  User,
  ShoppingBag,
  TrendingUp,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

import Image from "next/image";
import { FaSortDown } from "react-icons/fa6";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

import { signOut, useSession } from "next-auth/react";
import { useScopedI18n } from "@/locales/client";

const ProfilePopover = () => {
  const { data: session } = useSession();
  const tScope = useScopedI18n("sidebar");

  const menuItems = [
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
    <Popover>
      <PopoverTrigger
        asChild
        className="border-none p-0 outline-none bg-transparent hover:bg-transparent"
      >
        <Button
          aria-label="profile popover selection"
          variant="ghost"
          className="relative h-8 w-8 rounded-full mr-2"
        >
          <Image
            src="/avatar-image.png"
            alt="account logo"
            width={22}
            height={22}
            className="-mt-0.5"
          />
          <FaSortDown className="-mt-1.5 text-white -ml-0.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 max-md:ml-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Icon className="h-4 w-4 text-gray-500" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
            aria-label="logout button"
          >
            <LogOut className="h-4 w-4" />
            <span>{tScope("logout")}</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
