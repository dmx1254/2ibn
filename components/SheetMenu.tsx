"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

import { X } from "lucide-react";

const SheetMenu = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleSetOpen = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="outline-none inline-flex lg:hidden items-center gap-1 p-3 transition-colors cursor-pointer rounded-[10px] hover:shadow-link">
          <Image
            src="/assets/menu-burger.svg"
            alt="account logo"
            width={24}
            height={24}
            className=""
          />
          <span className="sr-only">hamburger menu</span>
        </button>
      </SheetTrigger>
      <SheetContent
        className="w-full flex items-center justify-center mx-auto rounded-tl-[30px] rounded-tr-[30px]"
        side="bottom"
        showIcon={false}
      >
        <div className="w-full flex flex-col items-center gap-3">
          <span className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2">
            Acheter Kamas Dofus 2.0 (PC)
          </span>
          <span className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2">
            Acheter Kamas Dofus Touch
          </span>
          <span className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2">
            Acheter Kamas Dofus Retro
          </span>
          <span className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2">
            Acheter Kamas Échanger Kamas
          </span>
        </div>
        <button
          className="absolute sm:hidden flex items-center gap-2 top-[-22%] left-[75%] z-50 bg-white/5 p-1.5 rounded-full text-white/80 text-sm"
          onClick={handleSetOpen}
        >
          Fermer <X size={16} />
        </button>
      </SheetContent>
    </Sheet>
  );
};

export default SheetMenu;
