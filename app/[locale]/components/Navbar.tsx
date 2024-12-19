"use client";

import React, { useEffect } from "react";
import Image from "next/image";

import { FaSortDown } from "react-icons/fa";
import SheetMenu from "./SheetMenu";
import { CiUser } from "react-icons/ci";

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

import {
  FaFacebookF,
  FaInstagram,
  FaSkype,
  FaTiktok,
  FaDiscord,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";
import { useUserPresence } from "@/app/hooks/userPresence";

const Navbar = () => {
  const { data: session, status } = useSession();

  useUserPresence({
    userId: session?.user.id,
    onError: (error) => {
      console.error("Erreur de présence:", error);
    },
  });

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

  const fetchCurrency = async () => {
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
      <div className="z-50 font-poppins sticky top-0 left-0 right-0 w-full flex items-center justify-center text-center px-4 bg-[#18191A] border-b border-gray-100">
        <div className="w-full max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-0">
            <SheetMenu />
            <Link href="/" className="flex items-center justify-center gap-0">
              <Image
                src="/ibennewapp-logo.png"
                alt="ibendouma logo"
                height={70}
                width={70}
                className="-ml-4 lg:-ml-2 lg:-mt-1"
              />
              <span className="sr-only">Ibendouma logo</span>
              <span className="max-sm:hidden text-2xl font-extrabold -ml-3 text-white">
                2Ibn
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4 max-lg:hidden">
            <Popover>
              <PopoverTrigger className="flex items-center text-base text-white transition-colors hover:text-yellow-600">
                {tScope("title")} <FaSortDown className="-mt-1.5" />
              </PopoverTrigger>
              <PopoverContent className="max-w-36 shadow-none p-2 bg-[#1A1D21] border-[#45494e]">
                <div className="flex flex-col items-start text-base font-semibold">
                  {dofusItemNav.map((dofs, index) => (
                    <button
                      key={dofs.id + index}
                      onClick={() => handleActiveJeu(dofs.slug)}
                      className="outline-none text-left w-full text-white cursor-pointer p-1.5 transition-all rounded-[10px] hover:bg-[#363A3D] hover:text-white"
                      aria-label="Server dofus selection"
                    >
                      {dofs.name}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Link
              href="/echange-de-kamas"
              className="text-base text-white transition-colors hover:text-yellow-600"
            >
              {tScope("link1")}
            </Link>
            <Link
              href="/vendre-des-kamas"
              className="text-base text-white transition-colors hover:text-yellow-600"
            >
              {tScope("link2")}
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {session && status === "authenticated" ? (
              <ProfilePopover />
            ) : (
              <Link
                href="/signin"
                className="hidden sm:inline-flex items-center gap-1 p-3 transition-colors cursor-pointer rounded-[10px] hover:shadow-link text-white hover:text-yellow-600"
              >
                <CiUser size={24} className="-mt-1" />
                <span className="text-base ">{tScope("account")}</span>
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
            <div className="flex gap-2 max-lg:hidden">
              <Link
                href="#"
                className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-blue-600 hover:opacity-80"
              >
                <FaFacebookF size={14} />
              </Link>

              <Link
                href="#"
                className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-sky-600 hover:opacity-80"
              >
                <FaTelegramPlane size={13} />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-green-600 hover:opacity-80"
              >
                <FaWhatsapp size={14} />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-gray-500 hover:opacity-80"
              >
                <FaTiktok size={13} />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-violet-500 hover:opacity-80"
              >
                <FaDiscord size={13} />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-[#E1306C] hover:opacity-80"
              >
                <FaInstagram size={13} />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-blue-600 hover:opacity-80"
              >
                <FaSkype size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Navbar;
