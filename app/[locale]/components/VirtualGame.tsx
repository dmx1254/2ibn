"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Gamepad2, Shield, Sparkles } from "lucide-react";
import { gameProducts, parsedDevise } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import useStore from "@/lib/store-manage";
import { GamePaymentDialog } from "./game-payment-dialog";

interface GameProduct {
  id: number;
  amount: string;
  bonus?: string;
  price: number;
}

const VirtualGame = ({ gamename }: { gamename: string }) => {
  const { devise } = useStore();
  const gameData = gameProducts[gamename];
  const tScope = useScopedI18n("virtualgame");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<GameProduct | null>(null);

  const handleBuyClick = (product: GameProduct) => {
    setSelectedProduct(product);
    setIsPaymentDialogOpen(true);
  };

  if (!gameData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0F10]">
        <p className="text-xl text-gray-400">{tScope("jeuNonTrouve")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0F10] text-white mb-12">
      <div className="container mx-auto px-4 py-12">
        <div className="relative mb-16 p-8 rounded-2xl bg-[#131619] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#eab308]/20 to-[#f97316]/20 z-10"></div>
          <div className="absolute inset-0">
            <Image
              src={`/jeux/${gamename}.webp`}
              alt={gameData.title}
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
          <div className="relative z-20">
            <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-[#eab308] to-[#f97316] text-transparent bg-clip-text">
              {tScope(
                `${
                  gamename as
                    | "pubg-mobile"
                    | "free-fire"
                    | "fortnite"
                    | "mobile-legends"
                    | "pasha-fencer-diamonds"
                }.title`
              )}
            </h1>
            <div className="max-w-3xl mx-auto space-y-6 bg-[#0D0F10]/50 p-6 rounded-xl backdrop-blur-sm">
              {gamename === "pubg-mobile" && (
                <>
                  <p className="text-2xl font-bold text-[#eab308] text-center">
                    {tScope("pubg.description")}
                  </p>
                  <p className="text-lg text-gray-200">
                    {tScope("pubg.descriptionComplete")}:
                  </p>
                  <div className="space-y-2 text-gray-200">
                    <p>✅{tScope("pubg.benefit1")}</p>
                    <p>✅ {tScope("pubg.benefit2")}</p>
                    <p>✅ {tScope("pubg.benefit3")}</p>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <p>🔹 {tScope("pubg.service1")}</p>
                    <p>🔹 {tScope("pubg.service2")}</p>
                    <p>🔹 {tScope("pubg.service3")}</p>
                  </div>
                  <p className="text-lg font-semibold text-[#f97316] text-center">
                    {tScope("pubg.conclusion")} 🎮🔥
                  </p>
                </>
              )}

              {gamename === "free-fire" && (
                <>
                  <p className="text-2xl font-bold text-[#eab308] text-center">
                    {tScope("free-fire.title")}
                  </p>
                  <p className="text-lg text-gray-200">
                    {tScope("freefire.description")}
                  </p>
                  <p className="text-lg text-gray-200">
                    {tScope("freefire.descriptionComplete")} :
                  </p>
                  <div className="space-y-2 text-gray-200">
                    <p>✅ {tScope("freefire.benefit1")}</p>
                    <p>✅ {tScope("freefire.benefit2")}</p>
                    <p>✅ {tScope("freefire.benefit3")}</p>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <p>🔹 {tScope("freefire.service1")}</p>
                    <p>🔹 {tScope("freefire.service2")}</p>
                    <p>🔹 {tScope("freefire.service3")}</p>
                  </div>
                  <p className="text-lg font-semibold text-[#f97316] text-center">
                    {tScope("freefire.conclusion")} 💎🔥
                  </p>
                </>
              )}

              {gamename === "fortnite" && (
                <>
                  <p className="text-2xl font-bold text-[#eab308] text-center">
                    {tScope("fortnite.description")}
                  </p>
                  <p className="text-lg text-gray-200">
                    {tScope("fortnite.descriptionComplete")} :
                  </p>
                  <div className="space-y-2 text-gray-200">
                    <p>✅ {tScope("fortnite.benefit1")}</p>
                    <p>✅ {tScope("fortnite.benefit2")}</p>
                    <p>✅ {tScope("fortnite.benefit3")}</p>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <p>🔹{tScope("freefire.service1")}</p>
                    <p>🔹 {tScope("freefire.service2")}</p>
                    <p>🔹 {tScope("freefire.service3")}</p>
                  </div>
                  <p className="text-lg font-semibold text-[#f97316] text-center">
                    {tScope("fortnite.conclusion")} 🎮💥
                  </p>
                </>
              )}

              {gamename === "mobile-legends" && (
                <>
                  <p className="text-2xl font-bold text-[#eab308] text-center">
                    {tScope("mobilelegends.subtitle")}
                  </p>
                  <p className="text-lg text-gray-200">
                    {tScope("mobilelegends.description")} :
                  </p>
                  <div className="space-y-2 text-gray-200">
                    <p>✅ {tScope("mobilelegends.benefit1")}</p>
                    <p>✅ {tScope("mobilelegends.benefit2")}</p>
                    <p>✅ {tScope("mobilelegends.benefit3")}</p>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <p>🔹 {tScope("mobilelegends.service1")}</p>
                    <p>🔹 {tScope("mobilelegends.service2")}</p>
                    <p>🔹 {tScope("mobilelegends.service3")}</p>
                  </div>
                  <p className="text-lg font-semibold text-[#f97316] text-center">
                    {tScope("mobilelegends.conclusion")} 🎮💎
                  </p>
                </>
              )}

              {gamename === "pasha-fencer-diamonds" && (
                <>
                  <p className="text-2xl font-bold text-[#eab308] text-center">
                    {tScope("pasha.subtitle")}
                  </p>
                  <p className="text-lg text-gray-200">
                    {tScope("pasha.descriptionComplete")} :
                  </p>
                  <div className="space-y-2 text-gray-200">
                    <p>✅ {tScope("pasha.benefit1")}</p>
                    <p>✅ {tScope("pasha.benefit2")}</p>
                    <p>✅ {tScope("pasha.benefit3")}</p>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <p>🔹 {tScope("pasha.service1")}</p>
                    <p>🔹 {tScope("pasha.service2")}</p>
                    <p>🔹 {tScope("pasha.service3")}</p>
                  </div>
                  <p className="text-lg font-semibold text-[#f97316] text-center">
                    {tScope("pasha.conclusion")} 💎🎮
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-[#1A1D21] border-0 overflow-hidden group hover:shadow-xl hover:shadow-[#eab308]/5 transition-all duration-300">
            <CardHeader className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#eab308]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Gamepad2 className="w-12 h-12 mb-4 text-[#eab308]" />
              <CardTitle className="text-white">
                {tScope("contentExclusif")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 text-base">
                {tScope("accesContenu")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1D21] border-0 overflow-hidden group hover:shadow-xl hover:shadow-[#f97316]/5 transition-all duration-300">
            <CardHeader className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Sparkles className="w-12 h-12 mb-4 text-[#f97316]" />
              <CardTitle className="text-white">
                {tScope("bonusSpeciaux")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 text-base">
                {tScope("profitezBonus")}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1D21] border-0 overflow-hidden group hover:shadow-xl hover:shadow-[#eab308]/5 transition-all duration-300">
            <CardHeader className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#eab308]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Shield className="w-12 h-12 mb-4 text-[#eab308]" />
              <CardTitle className="text-white">
                {tScope("livraisonSecurisee")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 text-base">
                {tScope("receptionInstantanee")}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gameData.products.map((product) => (
            <Card
              key={product.id}
              className="bg-[#131619] border-0 group hover:shadow-2xl hover:shadow-[#eab308]/5 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0">
                <Image
                  src={`/jeux/${gamename}.webp`}
                  alt={gameData.title}
                  fill
                  className="object-cover opacity-10 transition-opacity group-hover:opacity-20"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-[#eab308]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mb-2">
                    <Image
                      src={`/jeux/${gamename}.webp`}
                      alt={gameData.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl font-bold text-white">
                  {product.amount}
                </CardTitle>
                {product.bonus && (
                  <span className="absolute top-2 right-2 bg-[#eab308] text-black text-sm font-bold px-2 py-1 rounded-full">
                    +{product.bonus}
                  </span>
                )}
              </CardHeader>

              <CardContent className="relative z-10">
                <div className="text-center space-y-4">
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#eab308] to-[#f97316] text-transparent bg-clip-text">
                    {(Number(product.price) / devise.curencyVal).toFixed(2)}{" "}
                    {parsedDevise(devise.currencyName)}
                  </p>
                  <button
                    onClick={() => handleBuyClick(product)}
                    className="w-full bg-gradient-to-r from-[#eab308] to-[#f97316] hover:from-[#f97316] hover:to-[#eab308] text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {tScope("acheterMaintenant")}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <GamePaymentDialog
          isOpen={isPaymentDialogOpen}
          onClose={() => setIsPaymentDialogOpen(false)}
          product={selectedProduct}
          gameTitle={gameData.title}
        />
      )}
    </div>
  );
};

export default VirtualGame;
