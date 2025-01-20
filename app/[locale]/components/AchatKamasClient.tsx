"use client";

import React, { useEffect } from "react";
import PurchaseForm from "./PurchaseForm";

const AchatKamasClient = ({ dofusName }: { dofusName: string }) => {
  return (
    <div className="container font-poppins mx-auto p-4 space-y-5 max-w-6xl min-h-screen mb-10 mt-4">
      <PurchaseForm cat={dofusName} />
    </div>
  );
};

export default AchatKamasClient;
