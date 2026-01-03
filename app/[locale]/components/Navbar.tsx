"use client";

import React, { useState } from "react";
import Image from "next/image";

import { FaSortDown } from "react-icons/fa";
import SheetMenu from "./SheetMenu";

import { dofusItemNav, games } from "@/lib/utils";
import LanguageAndCurrency from "./LanguageAndCurrency";
import { useScopedI18n } from "@/locales/client";
import CardHoverCon from "./HoverCard";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { useSession } from "next-auth/react";
import ProfilePopover from "./ProfilePopover";
// import { useUserPresence } from "@/app/hooks/userPresence";
import SocialMediaDropdown from "./SocialMediaDropdown ";
import MobileTopMenus from "./MobileTopMenus";
// import useStore from "@/lib/store-manage";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  // const { devise } = useStore();
  const [isGameHovering, setIsGameHovering] = useState<boolean>(false);
  const [isDofusHovering, setIsDofusHovering] = useState<boolean>(false);

  // useUserPresence({
  //   userId: session?.user.id,
  //   onError: (error) => {
  //     console.error("Erreur de présence:", error);
  //   },
  // });

  // console.log(devise);

  const tScope = useScopedI18n("navbar.popover");
  const tScope2 = useScopedI18n("navbar");
  const tScope3 = useScopedI18n("menu");
  const tScope4 = useScopedI18n("modal");
  const pathname = usePathname();

  // const [scrollPosition, setScrollPosition] = useState<number>(0);

  return (
    !pathname.includes("signin") &&
    !pathname.includes("signup") &&
    !pathname.includes("reset-password") &&
    !pathname.includes("profile") &&
    !pathname.includes("resetpassword") && (
      <>
        <MobileTopMenus />
        <div className="z-50 font-poppins sticky flex top-0 left-0 right-0 w-full items-center justify-center text-center px-2 md:px-4 bg-[#2A2D30]">
          <div className="w-full max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-0">
              <SheetMenu />
              <Link href="/" className="flex items-center justify-center gap-0">
                <Image
                  src="/logo.png"
                  alt="ibendouma logo"
                  height={70}
                  width={70}
                  className="-ml-4 lg:-ml-2 -mt-1"
                />
                <span className="sr-only">Ibendouma logo</span>
                <span className="text-2xl font-extrabold -ml-3 text-white">
                  iBendouma
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4 max-lg:hidden">
              <Popover open={isDofusHovering} onOpenChange={setIsDofusHovering}>
                <PopoverTrigger
                  className="flex items-center text-sm text-white transition-colors hover:text-yellow-600"
                  onMouseEnter={() => setIsDofusHovering(true)}
                >
                  {tScope("title")} <FaSortDown className="-mt-1.5" />
                </PopoverTrigger>
                <PopoverContent
                  className="max-w-36 shadow-none p-2 bg-[#1A1D21] border-[#45494e]"
                  onMouseLeave={() => setIsDofusHovering(false)}
                >
                  <div className="flex flex-col items-start text-base font-semibold">
                    {dofusItemNav.map((dofs, index) => (
                      <Link
                        key={dofs.id + index}
                        href={`/acheter-des-kamas/${dofs.slug}`}
                        // onClick={() => handleActiveJeu(dofs.slug)}
                        className="outline-none text-sm text-left w-full text-white cursor-pointer p-1.5 transition-all rounded-[10px] hover:bg-[#363A3D] hover:text-white"
                        aria-label="Server dofus selection"
                      >
                        {dofs.name}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Link
                href="/echange-de-kamas"
                className="text-sm text-white transition-colors hover:text-yellow-600"
              >
                {tScope("link1")}
              </Link>
              <Link
                href="/vendre-des-kamas"
                className="text-sm text-white transition-colors hover:text-yellow-600"
              >
                {tScope("link2")}
              </Link>
              <Popover open={isGameHovering} onOpenChange={setIsGameHovering}>
                <PopoverTrigger
                  className="flex items-center text-sm text-white transition-colors hover:text-yellow-600"
                  onMouseEnter={() => setIsGameHovering(true)}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/marketplace");
                  }}
                >
                  {tScope2("game")} <FaSortDown className="-mt-1.5" />
                </PopoverTrigger>
                <PopoverContent
                  className="max-w-48 shadow-none p-2 bg-[#1A1D21] border-[#45494e]"
                  onMouseLeave={() => setIsGameHovering(false)}
                >
                  <div className="flex flex-col items-start text-base font-semibold">
                    {games.map((g, index) => (
                      <Link
                        key={g.id + index}
                        href={`/marketplace/category/${g.slug}`}
                        // onClick={() => handleActiveJeu(dofs.slug)}
                        className="outline-none text-sm text-left w-full text-white cursor-pointer p-1.5 transition-all rounded-[10px] hover:bg-[#363A3D] hover:text-white"
                        aria-label="categories"
                      >
                        {tScope2(g.traduc as "accounts" | "gift-cards" | "game-coins" | "software-and-app" | "carte-prepayees")}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {/* <Link
                href="/crypto"
                className="text-sm text-white transition-colors hover:text-yellow-600"
              >
                {tScope3("crypto")}
              </Link> */}
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {session && status === "authenticated" ? (
                <div className="max-md:hidden">
                  <ProfilePopover />
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="hidden sm:inline-flex items-center text-sm gap-1 p-2 transition-colors cursor-pointer rounded-[10px] hover:shadow-link bg-yellow-500 text-white hover:opacity-80"
                >
                  {tScope4("signin")}/{tScope4("signup")}
                </Link>
              )}

              <LanguageAndCurrency />
              <CardHoverCon />
              <div>
                <SocialMediaDropdown />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Navbar;
