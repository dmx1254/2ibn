import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { AccountModel } = await goapiModels;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { error: "Category parameter is required" },
        { status: 400 }
      );
    }

    // Fonction pour récupérer les licences avec cache
    const getCachedLicences = unstable_cache(
      async (categoryParam: string) => {
        // Récupérer tous les comptes pour cette catégorie
        const accounts = await AccountModel.find({
          category: { $regex: new RegExp(categoryParam, "i") },
        }).lean();

        // Normaliser et grouper les licences en JavaScript
        const licenceMap = new Map<string, { licence: string; count: number }>();

        accounts.forEach((account: Record<string, unknown>) => {
          // Normaliser la licence (lowercase + trim)
          const licence = (account.licence as string) || "";
          const normalized = licence.toLowerCase().trim();

          if (normalized) {
            if (licenceMap.has(normalized)) {
              // Incrémenter le compteur
              const existing = licenceMap.get(normalized)!;
              existing.count += 1;
            } else {
              // Créer une nouvelle entrée avec la valeur originale
              licenceMap.set(normalized, {
                licence: licence || normalized,
                count: 1,
              });
            }
          }
        });

        // Convertir la Map en tableau et trier par count décroissant
        const licences = Array.from(licenceMap.values()).sort(
          (a, b) => b.count - a.count
        );

        return licences;
      },
      [`category-licences-${category}`], // Clé de cache unique par catégorie
      {
        revalidate: 3600, // Mettre en cache pendant 1 heure
        tags: ["category-licences"], // Tag pour invalider le cache si nécessaire
      }
    );

    const licences = await getCachedLicences(category);
    return NextResponse.json(licences, {
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

