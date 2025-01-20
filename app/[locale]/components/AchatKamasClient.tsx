"use client";

import React, { useEffect } from "react";
import PurchaseForm from "./PurchaseForm";
import useStore from "@/lib/store-manage";
import { useQuery } from "@tanstack/react-query";

const AchatKamasClient = ({ dofusName }: { dofusName: string }) => {
  const { addSevers, activeServerRequest, addToActiveServerRequest } =
    useStore();

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
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (data) {
      addSevers(data);
    }
  }, [data]);
  return (
    <div className="container font-poppins mx-auto p-4 space-y-5 max-w-6xl min-h-screen mb-10 mt-4">
      <PurchaseForm cat={dofusName} />
    </div>
  );
};

export default AchatKamasClient;
