import React, { Suspense } from "react";
import CategoryGame from "../../../components/CategoryGame";
import { VirtualGameSkeleton } from "../../../components/VirtualGameSkeleton";
import { goapiModels } from "@/lib/models/ibytrade-models";

const CategoryPage = async ({ params }: { params: { categoryname: string } }) => {
  const { categoryname } = await params;

  // Récupérer les comptes pour cette catégorie
  let accounts = [];
  try {
    const { AccountModel } = await goapiModels;

    // Chercher par catégorie avec regex (insensible à la casse)
    const accountsData = await AccountModel.find({
      category: { $regex: new RegExp(categoryname, "i") },
    }).lean();

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
    <Suspense key={categoryname} fallback={<VirtualGameSkeleton />}>
      <CategoryGame categoryname={categoryname} accounts={accounts} />
    </Suspense>
  );
};

export default CategoryPage;
