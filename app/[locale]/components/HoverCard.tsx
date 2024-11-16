"use client";

import { useState } from "react";
import useStore from "@/lib/store-manage";
import { Cart } from "@/lib/types/types";
import { parsedDevise } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import Image from "next/image";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { usePathname } from "next/navigation";

const CardHoverCon = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);
  const t = useI18n();
  const { totalItems, carts } = useStore();
  const totalPrice = carts.reduce(
    (acc: number, item: Cart) => acc + item.totalPrice,
    0
  );

  const handleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <HoverCard open={open} onOpenChange={handleOpen}>
      {!pathname.includes("vendre-des-kamas") && (
        <HoverCardTrigger asChild>
          <button
            className="relative outline-none inline-flex items-center gap-1 p-3 transition-colors cursor-pointer rounded-[10px] hover:shadow-link"
            onClick={handleOpen}
            aria-label="Cart open"
          >
            <Image
              src="/assets/cart.svg"
              alt="account logo"
              width={20}
              height={20}
              className=""
            />
            <span className="sr-only">Cart</span>
            <span className="flex items-center justify-center text-center absolute h-4 w-4 text-xs bg-yellow-500 text-white rounded-full top-[12%] left-[50%]">
              {totalItems}
            </span>
          </button>
        </HoverCardTrigger>
      )}

      <HoverCardContent className="w-80 bg-[#1A1D21] border-[#45494e]">
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="w-full flex items-center justify-between">
            <span className="text-sm text-white/90">Total ({totalItems} items)</span>
            <span className="text-base font-bold  text-yellow-500 rounded">
              {totalPrice.toFixed(2)} {parsedDevise(carts[0]?.currency)}
            </span>
          </div>
          <Link
            href="/cart"
            className="w-full outline-none text-base p-2 rounded bg-yellow-500 text-white transition-colors hover:opacity-90"
          >
            {t("cart.goToCart")}
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CardHoverCon;
