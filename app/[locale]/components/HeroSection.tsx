"use client";

import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Label } from "./ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";

import { Plus } from "lucide-react";

import { FaCircleQuestion } from "react-icons/fa6";
import { IoIosFlash } from "react-icons/io";
import { ServerBuy, dofusItem, parsedDevise } from "@/lib/utils";
import useStore from "@/lib/store-manage";
import { useScopedI18n } from "@/locales/client";
import clsx from "clsx";
import { toast } from "sonner";

const HeroSection = () => {
  const { devise, activeServerRequest, addToActiveServerRequest, addToCart } =
    useStore();
  const tScope = useScopedI18n("hero");
  const { servers } = useStore();
  const [dofusChange, setDofusChange] = useState<string>(activeServerRequest);
  const [serverChange, setServerChange] = useState<string>("");
  const [serverSelected, setServerSelected] = useState<ServerBuy[] | null>(
    null
  );

  const [activeServer, setActiveServer] = useState<ServerBuy | null>(null);
  const [character, setCharacter] = useState<string>("");
  const [amount, setAmount] = useState<number | string>(0);
  const [bonus, setBonus] = useState<number | string>(0);

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
    <section className="w-full max-w-6xl font-poppins flex max-lg:flex-col items-center justify-between gap-10 lg:gap-20 m-0 p-0">
      <Card className="w-full max-lg:max-w-[450px] lg:w-2/4 flex flex-col items-center lg:items-start gap-2 shadow-none bg-transparent border-none">
        <div className="full text-4xl lg:text-5xl font-bold leading-[45px] lg:leading-[50px] max-lg:text-center">
          {tScope("titlefirst")} <span className="text-yellow-500">Dofus</span>{" "}
          {tScope("titlesecond")}
        </div>
        <p className="w-full text-lg max-lg:hidden">{tScope("desc")}</p>
        <div className="w-full flex flex-col items-center lg:items-start lg:mt-2">
          <div className="flex items-center text-sm">
            <span className="font-semibold"> {tScope("reviewsnote")}</span>
            <Separator className="w-0.5 h-5 mx-1.5 bg-gray-300" />
            <Image
              src="/assets/stars.svg"
              alt="truspilot reviews"
              width={100}
              height={100}
              className=""
            />
          </div>
          <p className="text-xs mt-0.5">{tScope("reviewsdesc")}</p>
        </div>
      </Card>
      <Card
        className="full max-lg:max-w-[450px] lg:w-1/3 flex flex-col items-start gap-4 shadow-none bg-white p-4 rounded-[10px] border-none"
        style={{
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
      >
        <div className="w-full flex flex-col items-start gap-3">
          <Label>{tScope("game")}</Label>
          <Select value={dofusChange} onValueChange={handleDofusChange}>
            <SelectTrigger className="w-full border-none outline-none focus:ring-0 focus:ring-offset-0 bg-[#EDEDED] px-5 py-7 rounded-[10px] text-base">
              <SelectValue placeholder="Selectionner un jeu" />
            </SelectTrigger>
            <SelectContent className="bg-[#EDEDED]">
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
          <Label>{tScope("server")}</Label>
          <Select value={serverChange} onValueChange={setServerChange}>
            <SelectTrigger className="w-full border-none outline-none focus:ring-0 focus:ring-offset-0 bg-[#EDEDED] px-5 py-7 rounded-[10px] text-base">
              <SelectValue placeholder="Sélectionnez le serveur" />
            </SelectTrigger>
            <SelectContent className="bg-[#EDEDED]">
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
          <Label>{tScope("needkamas")}</Label>
          <div className="flex items-center">
            <div className="relative flex items-center">
              <Input
                className="w-full bg-[#EDEDED] text-base px-5 py-7 rounded-tl-[10px] rounded-bl-[10px] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="0"
                type="number"
                value={amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.value)
                }
              />
              <span className="absolute text-[#a1a0a0] left-[50%] z-20 py-[18px] rounded-tr-[10px] rounded-br-[10px]">
                M Kamas
              </span>
            </div>
            <span className="mx-2">
              <Plus size={24} className="text-[#a1a0a0]" />
            </span>
            <div className="relative">
              <Input
                className="bg-[#EDEDED] text-base px-5 py-7 w-28 rounded-[10px] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 pointer-events-none"
                placeholder="0"
                type="number"
                value={bonus}
                // onChange={(e: ChangeEvent<HTMLInputElement>) =>
                //   setBonus(e.target.value)
                // }
                readOnly
              />
              <Image
                className="absolute top-[32%] left-[75%]"
                src="/assets/cadeau.png"
                alt="gift kamas"
                width={16}
                height={16}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-3">
          <Label className="flex items-center gap-2">
            {tScope("character")}
            <FaCircleQuestion className="text-[#a1a0a0]" />
          </Label>
          <Input
            className="w-full bg-[#EDEDED] text-base px-5 py-7 rounded-[10px] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder=""
            type="text"
            value={character}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCharacter(e.target.value)
            }
          />
        </div>
        <div className="w-full flex items-center justify-center my-5">
          <span className="text-sm">Total</span>
          <div className="w-full flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="text-sm">
                {parsedDevise(devise.currencyName)}
                {returTotalValue}
              </span>
              <span className="flex items-center justify-center text-sm bg-red-100 text-red-500 rounded-[5px] p-0.5">
                -36%
              </span>
            </div>
            <span className="text-sm text-[#a1a0a0] line-through">
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
        >
          {tScope("btn")}
        </button>
        <span className="flex items-center text-xs self-center text-green-500">
          <IoIosFlash size={20} />
          {tScope("bottomdesc")}
        </span>
      </Card>
    </section>
  );
};

export default HeroSection;
