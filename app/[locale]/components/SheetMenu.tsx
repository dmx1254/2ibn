"use client";

import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useScopedI18n } from "@/locales/client";
import useStore from "@/lib/store-manage";
import Link from "next/link";
import { dofusItemNavSheetMenu } from "@/lib/utils";

const SheetMenu = () => {
  const { addToActiveServerRequest } = useStore();
  const tScope = useScopedI18n("menu");
  const handleActiveJeu = (slug: string) => {
    addToActiveServerRequest(slug);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button aria-label="triggering menu opening" className="outline-none inline-flex lg:hidden items-center gap-1 p-3 transition-colors cursor-pointer rounded-[10px] hover:shadow-link">
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
            <button
              key={item.id + index}
              className="outline-none w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2"
              onClick={() => handleActiveJeu(item.slug)}
              aria-label="kamas server"
            >
              {tScope(item.typeslug as "kamas" | "touch" | "retro")}
            </button>
          ))}

          <Link
            href="/echange-de-kamas"
            className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2"
          >
            {tScope("exchange")}
          </Link>
          <Link
            href="/vendre-des-kamas"
            className="w-full text-center rounded-[10px] text-sm cursor-pointer bg-[#EDEDED] p-2"
          >
            {tScope("sell")}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetMenu;
