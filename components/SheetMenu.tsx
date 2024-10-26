"use client";

import { useState } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

const SheetMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="outline-none inline-flex lg:hidden items-center gap-1 p-3 transition-colors cursor-pointer rounded-[10px] hover:shadow-link">
          <Image
            src="/assets/menu-burger.svg"
            alt="account logo"
            width={22}
            height={22}
            className="mt-0.5"
          />
          <span className="sr-only">hamburger menu</span>
        </button>
      </SheetTrigger>
      <SheetContent
        className="w-full flex items-center justify-center mx-auto rounded-tl-[30px] rounded-tr-[30px]"
        side="bottom"
      >
        <div className="w-full flex flex-col items-center gap-3">
          <span className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2">
            Buy Kamas Dofus 2.0 (PC)
          </span>
          <span className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2">
            Buy Kamas Dofus Touch
          </span>
          <span className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2">
            Buy Kamas Dofus Retro
          </span>
          <span className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2">
            Buy Kamas Exchange Kamas
          </span>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetMenu;
