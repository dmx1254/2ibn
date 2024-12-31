import { SearchParamProps } from "@/lib/types/types";
import React from "react";
import HeroSection from "../components/HeroSection";
import PurchaseForm from "../components/PurchaseForm";

const BuyKamas = ({ searchParams }: SearchParamProps) => {
  const dofusName = searchParams.category as string;
  return (
    <div className="container font-poppins mx-auto p-4 space-y-5 max-w-6xl min-h-screen mb-10 mt-4">
      <PurchaseForm cat={dofusName} />
    </div>
  );
};

export default BuyKamas;
