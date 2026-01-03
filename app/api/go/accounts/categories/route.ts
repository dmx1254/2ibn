import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { AccountModel } = await goapiModels;
    const { searchParams } = new URL(request.url);
    const licence = searchParams.get("licence");

    if (!licence) {
      return NextResponse.json(
        { error: "Licence parameter is required" },
        { status: 400 }
      );
    }

    // Fonction pour récupérer les catégories avec cache
    const getCachedCategories = unstable_cache(
      async (licenceParam: string) => {
        // Convertir le slug en licence (remplacer les tirets par des espaces et capitaliser)

        // Utiliser aggregate pour récupérer les catégories distinctes avec leur count
        // Normaliser les catégories (lowercase + trim) pour grouper correctement
        const categories = await AccountModel.aggregate([
          {
            $match: {
              licence: licenceParam,
            },
          },
          {
            $addFields: {
              normalizedCategory: {
                $trim: {
                  input: { $toLower: "$category" },
                },
              },
            },
          },
          {
            $group: {
              _id: "$normalizedCategory",
              count: { $sum: 1 },
              originalCategory: { $first: "$category" }, // Garder la première valeur originale pour l'affichage
            },
          },
          {
            $sort: { count: -1 }, // Trier par nombre d'offres décroissant
          },
          {
            $project: {
              _id: 0,
              category: "$originalCategory",
              count: 1,
            },
          },
        ]);

        return categories;
      },
      ["categories-distinct"], // Clé de cache
      {
        revalidate: 3600, // Mettre en cache pendant 1 heure
        tags: ["categories"], // Tag pour invalider le cache si nécessaire
      }
    );

    const categories = await getCachedCategories(licence);
    return NextResponse.json(categories, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
