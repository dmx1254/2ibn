import React, { Suspense } from "react";
import AccountDetails from "../../../components/AccountDetails";
import { AccountDetailsSkeleton } from "../../../components/AccountDetailsSkeleton";
import { goapiModels } from "@/lib/models/ibytrade-models";

const AccountDetailsPage = async ({
  params,
}: {
  params: { gamename: string; accountId: string };
}) => {
  const { gamename, accountId } = await params;

  const licenceName = gamename.includes("-")
    ? gamename
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
        .toLowerCase()
    : gamename.toLowerCase();

  // Récupérer le compte spécifique
  let account = null;
  let relatedAccounts = [];

  // console.log(gamename);
  // console.log(accountId);
  // console.log(licenceName);

  try {
    const { AccountModel } = await goapiModels;
    // Convertir le slug en licence
    // Récupérer le compte spécifique
    const accountData = await AccountModel.findById(accountId).lean();

    if (accountData) {
      // Convertir en objet simple
      account = {
        ...accountData,
        _id:
          (accountData._id as { toString?: () => string })?.toString?.() ||
          accountData._id,
      };

      // Récupérer les comptes similaires (même licence) - limiter à 4 pour l'affichage
      const relatedData = await AccountModel.find({
        licence: { $regex: new RegExp(licenceName, "i") },
        _id: { $ne: accountId },
      })
        .limit(4)
        .lean();

      // Vérifier s'il y a plus de comptes disponibles
      const totalRelatedCount = await AccountModel.countDocuments({
        licence: { $regex: new RegExp(licenceName, "i") },
        _id: { $ne: accountId },
      });

      relatedAccounts = relatedData.map((acc: Record<string, unknown>) => ({
        ...acc,
        _id: (acc._id as { toString?: () => string })?.toString?.() || acc._id,
      }));

      const hasMoreRelated = totalRelatedCount > 4;

      return (
        <AccountDetails
          account={account}
          gamename={gamename}
          relatedAccounts={relatedAccounts}
          hasMoreRelated={hasMoreRelated}
        />
      );
    }
  } catch (error) {
    console.error("Error fetching account:", error);
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-[#1A1D21] flex items-center justify-center">
        <div className="text-white text-xl">Compte non trouvé</div>
      </div>
    );
  }

  return (
    <Suspense fallback={<AccountDetailsSkeleton />}>
      <AccountDetails
        account={account}
        gamename={gamename}
        relatedAccounts={relatedAccounts}
        hasMoreRelated={false}
      />
    </Suspense>
  );
};

export default AccountDetailsPage;
