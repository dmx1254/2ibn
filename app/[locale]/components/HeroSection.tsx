"use client";

import React, { ChangeEvent, useEffect, useMemo, useState } from "react";

import Image from "next/image";

import { Plus } from "lucide-react";

import { FaCircleQuestion } from "react-icons/fa6";
import { IoIosFlash } from "react-icons/io";
import { ServerBuy, dofusItem, parsedDevise } from "@/lib/utils";
import useStore from "@/lib/store-manage";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import clsx from "clsx";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import TestimonialsCard from "./TestimonialsCard";

const HeroSection = () => {
  const { devise, activeServerRequest, addToActiveServerRequest, addToCart } =
    useStore();
  const tScope = useScopedI18n("hero");
  const locale = useCurrentLocale();
  const { servers } = useStore();
  const [dofusChange, setDofusChange] = useState<string>(activeServerRequest);
  const [serverChange, setServerChange] = useState<string>("");
  const [serverSelected, setServerSelected] = useState<ServerBuy[] | null>(
    null
  );

  const [activeServer, setActiveServer] = useState<ServerBuy | null>(null);
  const [character, setCharacter] = useState<string>("");
  const [amount, setAmount] = useState<number | string>();
  const [bonus, setBonus] = useState<number | string>();

  const handleDofusChange = (slug: string) => {
    addToActiveServerRequest(slug);
  };

  useEffect(() => {
    setDofusChange(activeServerRequest);
  }, [activeServerRequest]);

  useMemo(() => {
    if (!servers) return [];
    // setServerChange(servers[0]?._id);
    const serverFiltered = servers.filter(
      (server) => server.serverCategory === activeServerRequest
    );
    setServerChange(serverFiltered[0]?._id);
    setServerSelected(serverFiltered);
  }, [servers, activeServerRequest]);

  useEffect(() => {
    const serverActive = serverSelected?.find((s) => s._id === serverChange);
    setActiveServer(serverActive || null);
  }, [serverChange]);

  const returTotalValue = useMemo(() => {
    const serverValue = Number(amount);
    if (!serverValue) return 0;
    let actualPriceCur = (activeServer?.serverPrice || 1) / devise.curencyVal;
    let total = (serverValue * actualPriceCur).toFixed(2);
    return Number(total);
  }, [amount, activeServer, devise.curencyVal]);

  const handleAddToCart = () => {
    let actualPriceCur = (activeServer?.serverPrice || 1) / devise.curencyVal;
    const cart = {
      productId: activeServer?._id || "",
      category: activeServer?.serverCategory || "",
      server: activeServer?.serverName || "",
      qty: activeServer?.serverMinQty || 1,
      amount: Number(amount),
      unitPrice: actualPriceCur,
      totalPrice: returTotalValue,
      image: activeServer?.serverCategory || "",
      type: "dofus",
      currency: devise.currencyName,
      valCurrency: devise.curencyVal,
      character: character,
    };
    addToCart(cart);
    toast.success(
      tScope("added.cart", { serverName: activeServer?.serverName }),
      {
        style: { color: "#16a34a" },
      }
    );
  };

  return (
    <section
      id="home"
      className="w-full max-w-6xl font-poppins flex max-lg:flex-col items-center justify-between gap-10 lg:gap-20 m-0 p-0"
    >
      <div className="full max-lg:max-w-[450px] lg:w-3/5">
        <TestimonialsCard />
      </div>
      <Card
        className="full lg:min-w-72 max-lg:max-w-[450px] lg:w-1/3 flex flex-col items-start gap-4 shadow-none bg-[#363A3D] p-4 rounded-[10px] border-none"
        style={{
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
      >
        <div className="w-full flex flex-col items-start gap-3">
          <Label className="text-white">{tScope("game")}</Label>
          <Select value={dofusChange} onValueChange={handleDofusChange}>
            <SelectTrigger className="w-full border-none outline-none focus:ring-0 focus:ring-offset-0 bg-[#45494e] text-white px-5 py-6 rounded-[10px] text-base">
              <SelectValue placeholder="Selectionner un jeu" />
            </SelectTrigger>
            <SelectContent className="bg-[#363A3D] text-white border-[#45494e]">
              <SelectGroup>
                <SelectLabel>Dofus</SelectLabel>
                {dofusItem.map((dofus) => (
                  <SelectItem
                    key={dofus.id}
                    value={dofus.slug}
                    className="text-base"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={dofus.img}
                        alt={dofus.name}
                        width={20}
                        height={20}
                      />
                      <span>{dofus.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex flex-col items-start gap-3">
          <Label className="text-white">{tScope("server")}</Label>
          <Select value={serverChange} onValueChange={setServerChange}>
            <SelectTrigger className="w-full border-none outline-none focus:ring-0 focus:ring-offset-0 bg-[#45494e] text-white px-5 py-6 rounded-[10px] text-base">
              <SelectValue placeholder="Sélectionnez le serveur" />
            </SelectTrigger>
            <SelectContent className="bg-[#363A3D] text-white border-[#45494e]">
              <SelectGroup>
                <SelectLabel>{tScope("serverdesc")}</SelectLabel>
                {serverSelected
                  ?.filter(
                    (server) => server.serverCategory === activeServerRequest
                  )
                  ?.map((server) => (
                    <SelectItem
                      key={server._id}
                      value={server._id}
                      className="text-base"
                    >
                      {server.serverName}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex flex-col items-start gap-3">
          <Label className="text-white">{tScope("needkamas")}</Label>
          <div className="flex items-center">
            <div className="relative flex items-center">
              <Input
                className="w-full bg-[#45494e] border-[#45494e] text-white text-base px-5 py-6 rounded-[10px] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="0"
                type="number"
                value={amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.value)
                }
              />
              <span
                className={clsx(
                  "absolute text-[#a1a0a0] z-20 py-[18px] rounded-tr-[10px] rounded-br-[10px] text-sm",
                  {
                    "left-[10%]": locale === "ar",
                    "left-[50%]": locale !== "ar",
                  }
                )}
              >
                M Kamas
              </span>
            </div>
            <span className="mx-2">
              <Plus size={24} className="text-[#a1a0a0]" />
            </span>
            <div className="relative">
              <Input
                className="bg-[#45494e] border-[#45494e] text-white text-base px-5 py-6 w-28 rounded-[10px] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 pointer-events-none"
                placeholder="0"
                type="number"
                value={bonus}
                // onChange={(e: ChangeEvent<HTMLInputElement>) =>
                //   setBonus(e.target.value)
                // }
                readOnly
              />
              <Image
                className={clsx("absolute top-[32%]", {
                  "left-[15%]": locale === "ar",
                    "left-[75%]": locale !== "ar",
                })}
                src="/assets/cadeau.png"
                alt="gift kamas"
                width={16}
                height={16}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-3">
          <Label className="flex items-center gap-2 text-white">
            {tScope("character")}
            <FaCircleQuestion className="text-[#a1a0a0]" />
          </Label>
          <Input
            className="w-full bg-[#45494e] border-[#45494e] text-white text-base px-5 py-6 rounded-[10px] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder=""
            type="text"
            value={character}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCharacter(e.target.value)
            }
          />
        </div>
        <div className="w-full flex items-center justify-center my-2">
          <span className="text-sm text-white">Total</span>
          <div className="w-full flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="text-sm text-white">
                {parsedDevise(devise.currencyName)}
                {returTotalValue}
              </span>
              <span className="flex items-center justify-center text-sm bg-red-100 text-red-500 rounded-[5px] p-0.5">
                -36%
              </span>
            </div>
            <span className="text-sm text-white line-through">
              {parsedDevise(devise.currencyName)}0.00
            </span>
          </div>
        </div>
        <button
          disabled={!returTotalValue || !character}
          className={clsx(
            "w-full text-center bg-yellow-500 text-white rounded-[15px] text-base p-3 transition-colors",
            {
              "opacity-75": !returTotalValue || !character,
              " hover:opacity-90": returTotalValue && character,
            }
          )}
          onClick={handleAddToCart}
          aria-label="Add to Cart"
        >
          {tScope("btn")}
        </button>
        <span className="flex items-start text-xs self-center text-green-500">
          <IoIosFlash size={20} className="mt-[-1px]" />
          {tScope("bottomdesc")}
        </span>
      </Card>
    </section>
  );
};

export default HeroSection;
