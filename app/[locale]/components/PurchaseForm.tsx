"use client";

import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus, ChevronRight, Gift, Coins, CreditCard } from "lucide-react";
import { FaCircleQuestion } from "react-icons/fa6";
import { IoIosFlash } from "react-icons/io";
import { ServerBuy, dofusItem, parsedDevise } from "@/lib/utils";
import useStore from "@/lib/store-manage";
import { useScopedI18n } from "@/locales/client";
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
import { useRouter } from "next/navigation";
import Testimonials from "./Testimonials";

const PurchaseForm = ({ cat }: { cat?: string }) => {
  const router = useRouter();
  const {
    devise,
    carts,
    activeServerRequest,
    addToActiveServerRequest,
    addToCart,
  } = useStore();
  const tScope = useScopedI18n("hero");

  const [dofusChange, setDofusChange] = useState<string>(activeServerRequest);
  const [serverChange, setServerChange] = useState<string>("");
  const [serverSelected, setServerSelected] = useState<ServerBuy[] | null>(
    null
  );
  const [activeServer, setActiveServer] = useState<ServerBuy | null>(null);
  const [character, setCharacter] = useState<string>("");
  const [amount, setAmount] = useState<number | string>();
  const [bonus, setBonus] = useState<number | string>();
  const [servers, setServers] = useState<ServerBuy[] | null>(null);

  // useEffect(() => {
  //   const getPromotion = async () => {
  //     const response = await fetch(`/api/gsheet/webhook/getpromo`);
  //     const data = await response.json();
  //     setPromotionValue(data.promotion);
  //   };
  //   getPromotion();
  // }, []);

  useEffect(() => {
    const getServerBuy = async () => {
      try {
        const response = await fetch(`/api/iben/server`);
        const res = await response.json();
        setServers(res);
      } catch (error) {
        console.log(error);
      }
    };
    getServerBuy();
  }, []);

  useEffect(() => {
    if (cat) {
      addToActiveServerRequest(cat);
    }
  }, [cat]);

  const handleDofusChange = (slug: string) => {
    addToActiveServerRequest(slug);
    router.push(`/acheter-des-kamas/${slug}`);
  };

  const checkPrice = (price: number | undefined): number => {
    if (!price) return 1;
    if (price >= 50 && price <= 100) {
      return 4000;
    } else if (price >= 20 && price < 50) {
      return 3000;
    } else if (price >= 1 && price < 20) {
      return 2000;
    } else {
      return 1000;
    }
  };

  useMemo(() => {
    const p = checkPrice(activeServer?.serverPrice);
    if (amount && Number(amount) > 0) {
      const price = (
        (Number(amount) * (activeServer?.serverPrice || 1)) /
        p
      ).toFixed(2);

      const priceNumber = Number(price);
      const bon = priceNumber >= 1 ? Math.floor(priceNumber) : 0;
      setBonus(bon);
    }
  }, [amount]);

  // console.log(amount);

  useEffect(() => {
    setDofusChange(activeServerRequest);
  }, [activeServerRequest]);

  useMemo(() => {
    if (!servers) return [];
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
    const actualPriceCur = (activeServer?.serverPrice || 1) * (devise.curencyVal || 1);
    const total = (serverValue * actualPriceCur).toFixed(2);

   
      return Number(total).toFixed(2);
    
  }, [amount, activeServer, devise.curencyVal]);

  const handleAddToCart = () => {
    const actualPriceCur = (activeServer?.serverPrice || 1) / devise.curencyVal;
    const cart = {
      productId: activeServer?._id || "",
      category: activeServer?.serverCategory || "",
      server: activeServer?.serverName || "",
      qty: activeServer?.serverMinQty || 1,
      amount: Number(amount),
      bonus: Number(bonus) || 0,
      unitPrice: actualPriceCur,
      totalPrice: Number(returTotalValue),
      image: activeServer?.serverCategory || "",
      type: "dofus",
      currency: devise.currencyName,
      valCurrency: devise.curencyVal,
      character: character,
    };

    if (carts[0] && cart.currency !== carts[0].currency) {
      toast.error(tScope("currencyError"), {
        style: { color: "#dc2626" },
        position: "top-right",
      });
      return;
    }
    addToCart(cart);
    toast.success(
      tScope("added.cart", { serverName: activeServer?.serverName }),
      {
        style: { color: "#16a34a" },
      }
    );
    setTimeout(() => {
      router.push("/checkout");
    }, 1000);
  };

  return (
    <>
      <div className="w-full bg-[#2A2D30] p-4 rounded-[10px] mt-16 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {tScope("homeTitle")}
            </h1>
            <p className="text-[#a1a0a0]">{tScope("homeDesc")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne de gauche */}
            <div className="space-y-4">
              <Card className="bg-[#363A3D] border-none p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Coins className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    {tScope("homeSelect")}
                  </h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-[#a1a0a0] mb-2 block">
                      {tScope("homeGame")}
                    </Label>
                    <Select
                      value={dofusChange}
                      onValueChange={handleDofusChange}
                    >
                      <SelectTrigger className="w-full border-none bg-[#45494e] text-white p-6 rounded-xl text-base hover:bg-[#4a4f54] transition-colors">
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
                              <div className="flex items-center gap-3">
                                <Image
                                  src={dofus.img}
                                  alt={dofus.name}
                                  width={24}
                                  height={24}
                                  className="rounded"
                                />
                                <span>{dofus.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#a1a0a0] mb-2 block">
                      {tScope("homeServer")}
                    </Label>
                    <Select
                      value={serverChange}
                      onValueChange={setServerChange}
                    >
                      <SelectTrigger className="w-full border-none bg-[#45494e] text-white p-6 rounded-xl text-base hover:bg-[#4a4f54] transition-colors">
                        <SelectValue placeholder={tScope("server")} />
                      </SelectTrigger>
                      <SelectContent className="bg-[#363A3D] text-white border-[#45494e]">
                        <SelectGroup>
                          <SelectLabel>{tScope("serverdesc")}</SelectLabel>
                          {serverSelected
                            ?.filter(
                              (server) =>
                                server.serverCategory === activeServerRequest
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
                </div>
              </Card>

              <Card className="bg-[#363A3D] border-none p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    {tScope("homeMontantTite")}
                  </h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-[#a1a0a0] mb-2 block">
                      {tScope("homekamas")}
                    </Label>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Input
                          className="w-full bg-[#45494e] border-none text-white text-lg px-6 py-6 rounded-xl focus:outline-none focus-visible:ring-1 focus-visible:ring-yellow-500"
                          placeholder="0"
                          type="number"
                          value={amount}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setAmount(e.target.value)
                          }
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a1a0a0]">
                          M Kamas
                        </span>
                      </div>

                      <div className="relative w-24 sm:w-32">
                        <Input
                          className="w-full bg-[#45494e] border-none pointer-events-none text-white text-lg px-6 py-6 rounded-xl"
                          placeholder="0"
                          type="number"
                          value={bonus}
                          readOnly
                        />
                        <Gift className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500 w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#a1a0a0] mb-2 flex items-center gap-2">
                      {tScope("homePerso")}
                      <FaCircleQuestion className="text-[#a1a0a0]" />
                    </Label>
                    <Input
                      className="w-full bg-[#45494e] border-none text-white text-lg px-6 py-6 rounded-xl focus:outline-none focus-visible:ring-1 focus-visible:ring-yellow-500"
                      placeholder={tScope("homePersoPlace")}
                      type="text"
                      value={character}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCharacter(e.target.value)
                      }
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Colonne de droite - Récapitulatif */}
            <div className="space-y-5">
              <Card className="bg-[#363A3D] border-none p-6 rounded-xl sticky top-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {tScope("homeRecapTitle")}
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-[#45494e]">
                    <span className="text-[#a1a0a0]">
                      {tScope("homeServer")}
                    </span>
                    <span className="text-white font-medium">
                      {activeServer?.serverName || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-[#45494e]">
                    <span className="text-[#a1a0a0]">
                      {tScope("homeRecapQty")}
                    </span>
                    <span className="text-white font-medium">
                      {Number(amount) || 0} M
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-[#45494e]">
                    <span className="text-[#a1a0a0]">Bonus</span>
                    <span className="text-yellow-500 font-medium">
                      +{bonus || 0} M
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-white text-lg">
                      {tScope("homeRecapTot")}
                    </span>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">
                          {parsedDevise(devise.currencyName)}
                          {returTotalValue}
                        </span>
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-500 rounded-lg font-medium">
                          -{5}%
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
                      "w-full flex items-center justify-center gap-2 bg-yellow-500 text-white rounded-xl text-lg font-medium p-3 transition-all",
                      {
                        "opacity-50 cursor-not-allowed":
                          !returTotalValue || !character,
                        "hover:bg-yellow-600": returTotalValue && character,
                      }
                    )}
                    onClick={handleAddToCart}
                  >
                    {tScope("btn")}
                    {/* <ChevronRight className="w-5 h-5" /> */}
                  </button>

                  <div className="flex items-center gap-2 justify-center text-green-500 text-sm">
                    <IoIosFlash size={18} />
                    <span>{tScope("bottomdesc")}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl my-5 mx-auto">
        <Testimonials />
      </div>

      <Card className="w-full flex flex-col items-start justify-center mx-auto my-10 gap-4 max-w-6xl p-6 self-center bg-[#2A2D30] border-[#1A1D21]">
        <p className="text-base text-white/90">
          {tScope("buyDesc", { serverName: activeServer?.serverName })}
        </p>
        <p className="text-base text-red-500/80">{tScope("nb")}</p>
      </Card>
    </>
  );
};

export default PurchaseForm;
