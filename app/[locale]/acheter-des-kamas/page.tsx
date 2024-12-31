import { SearchParamProps } from "@/lib/types/types";
import React from "react";
import HeroSection from "../components/HeroSection";

const BuyKamas = ({ searchParams }: SearchParamProps) => {
  const dofusName = searchParams.category as string;
  return (
    <div className="container font-poppins mx-auto p-6 space-y-6 max-w-6xl bg-[#1A1D21] min-h-screen my-10">
      <HeroSection cat={dofusName} />
    </div>
  );
};

export default BuyKamas;
