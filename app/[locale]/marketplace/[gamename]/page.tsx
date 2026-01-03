import React, { Suspense } from "react";
import VirtualGame from "../../components/VirtualGame";
import { VirtualGameSkeleton } from "../../components/VirtualGameSkeleton";
import { goapiModels } from "@/lib/models/ibytrade-models";

const GamePage = async ({ params }: { params: { gamename: string } }) => {
  const { gamename } = await params;

  // console.log(gamename);

  // Récupérer les comptes pour cette licence
  let accounts = [];
  try {
    const { AccountModel } = await goapiModels;

    // Chercher par licence avec regex (insensible à la casse)
    const accountsData = await AccountModel.find({
      licence: gamename,
    }).lean();

    // console.log(accountsData);

    accounts = accountsData.map((account: Record<string, unknown>) => ({
      ...account,
      _id:
        (account._id as { toString?: () => string })?.toString?.() ||
        account._id,
    }));
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
