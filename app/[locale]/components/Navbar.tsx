"use client";

import React, { useEffect } from "react";
import Image from "next/image";

import { FaSortDown } from "react-icons/fa";
import SheetMenu from "./SheetMenu";

import { useQuery } from "@tanstack/react-query";
import { dofusItemNav } from "@/lib/utils";
import useStore from "@/lib/store-manage";
import LanguageAndCurrency from "./LanguageAndCurrency";
import { useScopedI18n } from "@/locales/client";
import CardHoverCon from "./HoverCard";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { useSession } from "next-auth/react";
import ProfilePopover from "./ProfilePopover";

import { FaFacebookF, FaFlipboard, FaInstagram, FaSkype } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Navbar = () => {
  const { data: session, status } = useSession();

  // console.log(session);
  // console.log(status);

  const tScope = useScopedI18n("navbar.popover");
  const pathname = usePathname();
  const { addSevers, activeServerRequest, addToActiveServerRequest } =
    useStore();
  // const [scrollPosition, setScrollPosition] = useState<number>(0);

  const handleActiveJeu = (slug: string) => {
    addToActiveServerRequest(slug);
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrolling = window.scrollY;
  //     setScrollPosition(scrolling);
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  const fetchCurrency = async () => {
    // const currency = queryKey[1];
    // await fetch(`/api/iben/server/${isActiveJeu}`);
    const response = await fetch(`/api/iben/server`);
    if (!response.ok) {
      throw new Error("Fetching currency failed: ");
    }

    return response.json();
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["dofus-buy"],
    queryFn: () => fetchCurrency(),
  });

  useEffect(() => {
    if (data) {
      addSevers(data);
    }
  }, [data]);

  return (
    !pathname.includes("signin") &&
    !pathname.includes("signup") &&
    !pathname.includes("reset-password") &&
    !pathname.includes("profile") &&
    !pathname.includes("resetpassword") && (
      <div className="z-50 font-poppins sticky top-0 left-0 right-0 w-full flex items-center justify-center bg-transparent text-center px-4 bg-white border-b border-gray-100">
        <div className="w-full max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-0">
            <SheetMenu />
            <Link href="/" className="flex items-center justify-center gap-0">
              <Image
                src="/ibennewapp-logo.png"
                alt="ibendouma logo"
                height={70}
                width={70}
                className="-ml-4 lg:-ml-2"
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
                {tScope("title")} <FaSortDown className="-mt-1.5 text-black" />
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
              {tScope("link1")}
            </Link>
            <Link href="/vendre-des-kamas" className="text-base">
              {tScope("link2")}
            </Link>
            {/* <Link href="/paysafecard" className="text-base">
              {tScope("link3")}
            </Link> */}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {session && status === "authenticated" ? (
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
                <span className="text-base">{tScope("account")}</span>
              </Link>
            )}
            {(!session || status !== "authenticated") && (
              <div className="inline-flex sm:hidden items-center gap-1 p-3 transition-colors cursor-pointer rounded-[10px] hover:shadow-link">
                <Image
                  src="/assets/circle-user.svg"
                  alt="account logo"
                  width={22}
                  height={22}
                  className=""
                />
                <span className="sr-only">language and currency</span>
              </div>
            )}
            <LanguageAndCurrency />
            <CardHoverCon />
            <div className="flex space-x-4 max-lg:hidden">
              <Link
                href="#"
                className="flex items-center justify-center p-1.5 rounded-full border border-zinc-500 text-blue-600 hover:border-zinc-800"
              >
                <FaFacebookF size={15} />
              </Link>

              <Link
                href="#"
                className="flex items-center justify-center p-1.5 rounded-full border border-zinc-500 hover:border-zinc-800 text-pink-600"
              >
                <FaInstagram size={15} />
              </Link>

              <Link
                href="#"
                className="flex items-center justify-center p-1.5 rounded-full border border-zinc-500 text-black hover:border-zinc-800"
              >
                <FaXTwitter size={14} />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center p-1.5 rounded-full border border-zinc-500 text-blue-600 hover:border-zinc-800"
              >
                <FaSkype size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Navbar;
