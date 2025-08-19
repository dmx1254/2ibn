"use client";

import PurchaseForm from "./PurchaseForm";

const AchatKamasClient = ({ dofusName }: { dofusName: string }) => {
  return (
    <div className="container font-poppins mx-auto p-4 max-w-6xl min-h-screen mb-10">
      <PurchaseForm cat={dofusName} />
    </div>
  );
};

export default AchatKamasClient;
