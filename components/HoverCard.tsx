"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import useStore from "@/lib/store-manage";
import { parsedDevise } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const CardHoverCon = () => {
  const { totalItems, carts } = useStore();
  const totalPrice = carts.reduce((acc, item) => acc + item.totalPrice, 0);
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="relative outline-none inline-flex items-center gap-1 p-3 transition-colors cursor-pointer rounded-[10px] hover:shadow-link">
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
      <HoverCardContent className="w-80">
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="w-full flex items-center justify-between">
            <span className="text-sm">Total ({totalItems} items)</span>
            <span className="text-base font-bold  text-yellow-500 rounded">
              {totalPrice.toFixed(2)} {parsedDevise(carts[0]?.currency)}
            </span>
          </div>
          <Link
            href="/cart"
            className="w-full outline-none text-base p-2 rounded bg-yellow-500 text-white transition-colors hover:opacity-90"
          >
            Go to cart
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CardHoverCon;
