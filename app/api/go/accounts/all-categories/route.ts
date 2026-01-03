import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

export async function GET() {
  try {
    const { AccountModel } = await goapiModels;

    // Fonction pour récupérer les catégories avec cache
    const getCachedCategories = unstable_cache(
      async () => {
        // Récupérer tous les comptes
        const accounts = await AccountModel.find({}).lean();

        // Normaliser et grouper les catégories en JavaScript
        const categoryMap = new Map<string, { category: string; count: number }>();

        accounts.forEach((account: Record<string, unknown>) => {
          // Normaliser la catégorie (lowercase + trim)
          const category = (account.category as string) || "";
          const normalized = category.toLowerCase().trim();

          if (normalized) {
            if (categoryMap.has(normalized)) {
              // Incrémenter le compteur
              const existing = categoryMap.get(normalized)!;
              existing.count += 1;
            } else {
              // Créer une nouvelle entrée avec la valeur originale
              categoryMap.set(normalized, {
                category: category || normalized,
                count: 1,
              });
            }
          }
        });

        // Convertir la Map en tableau et trier par count décroissant
        const categories = Array.from(categoryMap.values()).sort(
          (a, b) => b.count - a.count
        );

        return categories;
      },
      ["categories-distinct-all"], // Clé de cache
      {
        revalidate: 3600, // Mettre en cache pendant 1 heure
        tags: ["categories"], // Tag pour invalider le cache si nécessaire
      }
    );

    const categories = await getCachedCategories();
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

