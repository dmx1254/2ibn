"use client";

import React, { useState } from "react";
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
import { dofusItem } from "@/lib/utils";
import useStore from "@/lib/store-manage";

const HeroSection = () => {
  const { servers } = useStore();
  const [dofusChange, setDofusChange] = useState<string>("dofus-kamas");
  const [serverChange, setServerChange] = useState<string>(servers[0]?._id);

  //   console.log(servers);

  return (
    <section className="w-full max-w-6xl font-poppins flex max-lg:flex-col items-center justify-between gap-10 lg:gap-20 m-0 p-0">
      <Card className="w-full max-lg:max-w-[450px] lg:w-2/4 flex flex-col items-center lg:items-start gap-2 shadow-none bg-transparent border-none">
        <div className="full text-4xl lg:text-5xl font-bold leading-[48px] max-lg:text-center">
          Acheter Kamas <span className="text-yellow-500">Dofus</span> Sécurisé,
          Rapide avec Meilleur Prix
        </div>
        <p className="w-full text-lg max-lg:hidden">
          Expérimentez la confiance de plus de 100 000 clients satisfaits avec
          le principal fournisseur de Kamas depuis plus de 4 ans, ici pour vous
          servir.
        </p>
        <div className="w-full flex flex-col items-center lg:items-start">
          <div className="flex items-center text-sm">
            <span className="font-semibold">Noté 4.9 / 5</span>
            <Separator className="w-0.5 h-5 mx-1.5 bg-gray-300" />
            <Image
              src="/assets/stars.svg"
              alt="truspilot reviews"
              width={100}
              height={100}
              className=""
            />
          </div>
          <p className="text-xs mt-0.5">Basé sur 932,15 avis</p>
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
          <Label>Sélectionnez le jeu</Label>
          <Select  onValueChange={setDofusChange}>
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
          <Label>Sélectionnez le serveur</Label>
          <Select defaultValue={serverChange} onValueChange={setServerChange}>
            <SelectTrigger className="w-full border-none outline-none focus:ring-0 focus:ring-offset-0 bg-[#EDEDED] px-5 py-7 rounded-[10px] text-base">
              <SelectValue placeholder="Sélectionnez le serveur" />
            </SelectTrigger>
            <SelectContent className="bg-[#EDEDED]">
              <SelectGroup>
                <SelectLabel>Serveurs</SelectLabel>
                {servers?.map((server) => (
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
          <Label>Combien de kamas avez-vous besoin ?</Label>
          <div className="flex items-center">
            <div className="relative flex items-center">
              <Input
                className="w-full bg-[#EDEDED] text-base px-5 py-7 rounded-tl-[10px] rounded-bl-[10px]"
                placeholder="0"
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
                className="bg-[#EDEDED] text-base px-5 py-7 w-28 rounded-[10px]"
                placeholder="0"
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
            Votre nom dans le jeu{" "}
            <FaCircleQuestion className="text-[#a1a0a0]" />
          </Label>
          <Input
            className="w-full bg-[#EDEDED] text-base px-5 py-7 rounded-[10px]"
            placeholder=""
          />
        </div>
        <div className="w-full flex items-center justify-center my-5">
          <span className="text-sm">Total</span>
          <div className="w-full flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="text-sm">€0.00</span>
              <span className="flex items-center justify-center text-sm bg-red-100 text-red-500 rounded-[5px] p-0.5">
                -36%
              </span>
            </div>
            <span className="text-sm text-[#a1a0a0] line-through">€0.00</span>
          </div>
        </div>
        <button className="w-full text-center bg-yellow-500 text-white rounded-[15px] text-base p-3 transition-colors hover:opacity-90">
          Ajouter au panier
        </button>
        <span className="flex items-center text-xs text-green-500">
          <IoIosFlash size={20} />
          Livraison en quelques minutes et 100% sécurisée
        </span>
      </Card>
    </section>
  );
};

export default HeroSection;
