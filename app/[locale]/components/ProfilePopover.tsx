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

import { signOut } from "next-auth/react";

const ProfilePopover = () => {
  const menuItems = [
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
    <Popover>
      <PopoverTrigger
        asChild
        className="border-none p-0 outline-none bg-transparent hover:bg-transparent"
      >
        <Button variant="ghost" className="relative h-8 w-8 rounded-full mr-2">
          <Image
            src="/avatar-image.png"
            alt="account logo"
            width={22}
            height={22}
            className="-mt-0.5"
          />
          <FaSortDown className="-mt-1.5 text-black/40" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
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
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
