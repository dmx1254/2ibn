"use client";

import { useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useScopedI18n } from "@/locales/client";
import useStore from "@/lib/store-manage";
import Link from "next/link";
import { dofusItemNavSheetMenu, games } from "@/lib/utils";

const SheetMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { addToActiveServerRequest } = useStore();
  const tScope = useScopedI18n("menu");
  const handleActiveJeu = (slug: string) => {
    addToActiveServerRequest(slug);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="triggering menu opening"
          className="outline-none inline-flex lg:hidden items-center gap-1 p-3 transition-colors cursor-pointer rounded-[10px] hover:shadow-link"
        >
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
          {dofusItemNavSheetMenu.map((item, index) => (
            <Link
              key={item.id + index}
              href={`/acheter-des-kamas/${item.slug}`}
              className="outline-none w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2"
              // onClick={() => handleActiveJeu(item.slug)}
              aria-label="kamas server"
              onClick={() => setIsOpen(false)}
            >
              {tScope(item.typeslug as "kamas" | "touch" | "retro")}
            </Link>
          ))}
          <Link
            href="/echange-de-kamas"
            className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2"
            onClick={() => setIsOpen(false)}
          >
            {tScope("exchange")}
          </Link>
          <Link
            href="/vendre-des-kamas"
            className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2"
            onClick={() => setIsOpen(false)}
          >
            {tScope("sell")}
          </Link>
          {games.map((g, index) => (
            <Link
              key={g.id + index}
              href={`/jeux/${g.slug}`}
              className="outline-none w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2"
              onClick={() => setIsOpen(false)}
              aria-label="kamas server"
            >
              {g.name}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetMenu;
