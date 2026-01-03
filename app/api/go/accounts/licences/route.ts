import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

export async function GET() {
  try {
    const { AccountModel } = await goapiModels;

    // Fonction pour récupérer les licences avec cache
    const getCachedLicences = unstable_cache(
      async () => {
        // Utiliser aggregate pour récupérer les licences distinctes avec leur count
        const licences = await AccountModel.aggregate([
          {
            $group: {
              _id: "$licence",
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 }, // Trier par nombre d'offres décroissant
          },
          {
            $project: {
              _id: 0,
              licence: "$_id",
              count: 1,
            },
          },
        ]);

        return licences;
      },
      ["licences-distinct"], // Clé de cache
      {
        revalidate: 3600, // Mettre en cache pendant 1 heure
        tags: ["licences"], // Tag pour invalider le cache si nécessaire
      }
    );

    const licences = await getCachedLicences();
    return NextResponse.json(licences, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
