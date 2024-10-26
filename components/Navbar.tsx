"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FaSortDown } from "react-icons/fa";
import SheetMenu from "./SheetMenu";

import { useQuery } from "@tanstack/react-query";
import { dofusItemNav } from "@/lib/utils";
import useStore from "@/lib/store-manage";
import LanguageAndCurrency from "./LanguageAndCurrency";
import CardHoverCon from "./HoverCard";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ProfilePopover from "./ProfilePopover";

const Navbar = () => {
  const pathname = usePathname();
  const { addSevers, activeServerRequest, addToActiveServerRequest, user } =
    useStore();
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const handleActiveJeu = (slug: string) => {
    addToActiveServerRequest(slug);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolling = window.scrollY;
      setScrollPosition(scrolling);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchCurrency = async (isActiveJeu: string) => {
    // const currency = queryKey[1];
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_IBENDOUMA_CLIENT_URL}/server/serverCat/${isActiveJeu}`
    );
    if (!response.ok) {
      throw new Error("Fetching currency failed: ");
    }

    return response.json();
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["dofus", activeServerRequest],
    queryFn: () => fetchCurrency(activeServerRequest),
    enabled: !!activeServerRequest,
  });

  useEffect(() => {
    if (data) {
      addSevers(data);
    }
  }, [data]);

  return (
    !pathname.includes("signin") &&
    !pathname.includes("signup") &&
    !pathname.includes("resetpassword") && (
      <div
        className="z-50 font-poppins sticky top-0 left-0 right-0 w-full flex items-center justify-center bg-transparent text-center px-4"
        style={{
          backgroundColor: scrollPosition >= 70 ? "white" : "transparent",
          boxShadow:
            scrollPosition >= 70 ? "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px" : "",
        }}
      >
        <div className="w-full max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-0">
            <SheetMenu />
            <Link href="/" className="flex items-center justify-center gap-0">
              <Image
                src="/ibennewapp-logo.png"
                alt="ibendouma logo"
                height={74}
                width={74}
                className="-ml-5 lg:-ml-2"
              />
              <span className="sr-only">Ibendouma logo</span>
              <span className="max-sm:hidden text-2xl font-extrabold -ml-3">
                2Ibn
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4 max-lg:hidden">
            <Popover>
              <PopoverTrigger className="flex items-center text-base">
                Buy Kamas <FaSortDown className="-mt-1.5 text-black" />
              </PopoverTrigger>
              <PopoverContent className="max-w-36 shadow-none p-2">
                <div className="flex flex-col items-start text-base text-[#212529BF] font-semibold">
                  {dofusItemNav.map((dofs, index) => (
                    <button
                      key={dofs.id + index}
                      onClick={() => handleActiveJeu(dofs.slug)}
                      className="outline-none text-left w-full cursor-pointer p-1.5 transition-all rounded-[10px] hover:bg-zinc-50"
                    >
                      {dofs.name}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Link href="/echange-de-kamas" className="text-base">
              Exchange Kamas
            </Link>
            <Link href="/vendre-des-kamas" className="text-base">
              Sell Kamas
            </Link>
            <Link href="/paysafecard" className="text-base">
              Paysafecard
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <ProfilePopover />
            ) : (
              <Link
                href="/signin"
                className="hidden sm:inline-flex items-center gap-1 p-3 transition-colors cursor-pointer rounded-[10px] hover:shadow-link"
              >
                <Image
                  src="/assets/locker.svg"
                  alt="account logo"
                  width={20}
                  height={20}
                  className="-mt-0.5"
                />
                <span className="text-base">Account</span>
              </Link>
            )}
            {!user && (
              <Link
                href="/signin"
                className="inline-flex sm:hidden items-center gap-1 p-3 transition-colors cursor-pointer rounded-[10px] hover:shadow-link"
              >
                <Image
                  src="/assets/circle-user.svg"
                  alt="account logo"
                  width={22}
                  height={22}
                  className=""
                />
                <span className="sr-only">language and currency</span>
              </Link>
            )}

            <LanguageAndCurrency />
            <CardHoverCon />
          </div>
        </div>
      </div>
    )
  );
};

export default Navbar;
