import React, { Suspense } from "react";
import VirtualGame from "../../components/VirtualGame";
import { VirtualGameSkeleton } from "../../components/VirtualGameSkeleton";
import { goapiModels } from "@/lib/models/ibytrade-models";

const GamePage = async ({ params }: { params: { gamename: string } }) => {
  const { gamename } = await params;

  // console.log(gamename);

  // Récupérer les comptes pour cette licence ou category
  let accounts = [];
  try {
    const { AccountModel } = await goapiModels;

    // Si c'est "accounts" ou "gift-cards", chercher par category
    if (
      gamename === "accounts" ||
      gamename === "gift-cards" ||
      gamename === "giftcards"
    ) {
      const categoryName =
        gamename === "gift-cards"
          ? "gift cards"
          : gamename === "accounts"
            ? "accounts"
            : gamename;

            console.log(categoryName);
      const accountsData = await AccountModel.find({
        category: { $regex: new RegExp(categoryName, "i") },
      }).lean();

      // console.log(accountsData);

      accounts = accountsData.map((account: Record<string, unknown>) => ({
        ...account,
        _id:
          (account._id as { toString?: () => string })?.toString?.() ||
          account._id,
      }));
    } else {
      // Sinon, chercher par licence (convertir le slug en licence)
      // Convertir "dofus-retro" → "dofus retro" (remplacer les tirets par des espaces)
      const licenceName = gamename;

      const accountsData = await AccountModel.find({
        licence: licenceName,
      }).lean();

      // Convertir les documents Mongoose en objets JavaScript simples
      // et s'assurer que _id est une string
      accounts = accountsData.map((account: Record<string, unknown>) => ({
        ...account,
        _id:
          (account._id as { toString?: () => string })?.toString?.() ||
          account._id,
      }));
    }
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }

  return (
    <Suspense key={gamename} fallback={<VirtualGameSkeleton />}>
      <VirtualGame gamename={gamename} accounts={accounts} />
    </Suspense>
  );
};

export default GamePage;
