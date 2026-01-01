import { Card } from "./ui/card";

export const AccountDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#1A1D21] text-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-700 rounded-full animate-pulse" />
          <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-700 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-700 rounded-full animate-pulse" />
          <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Titre et bouton partager */}
            <div className="flex items-start justify-between">
              <div className="h-9 w-64 bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-32 bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Carte du produit */}
            <Card className="bg-[#2A2D30] border border-gray-700 rounded-lg p-8">
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="h-48 w-full max-w-md bg-gray-700 rounded-lg mb-4 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-700 rounded-full animate-pulse" />
                  <div className="h-5 w-48 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </Card>

            {/* Informations sur le produit */}
            <Card className="bg-[#2A2D30] border border-gray-700 rounded-lg p-6">
              <div className="h-7 w-64 bg-gray-700 rounded mb-4 animate-pulse" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-gray-700 rounded-full animate-pulse" />
                  <div className="h-5 w-48 bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-gray-700 rounded-full animate-pulse" />
                  <div className="h-5 w-40 bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-5 w-56 bg-gray-700 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#2A2D30] border border-gray-700 rounded-lg p-6 sticky top-4">
              {/* Disponibilité */}
              <div className="h-5 w-32 bg-gray-700 rounded mb-6 animate-pulse" />

              {/* Sélecteur de quantité */}
              <div className="mb-6">
                <div className="h-4 w-20 bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-700 rounded-lg animate-pulse" />
                  <div className="h-10 w-20 bg-gray-700 rounded-lg animate-pulse" />
                  <div className="h-10 w-10 bg-gray-700 rounded-lg animate-pulse" />
                </div>
              </div>

              {/* Montant total */}
              <div className="mb-6 pb-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-32 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>

              {/* Bouton Acheter maintenant */}
              <div className="h-14 w-full bg-gray-700 rounded-lg mb-6 animate-pulse" />

              {/* Note du vendeur */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-700">
                <div className="h-5 w-5 bg-gray-700 rounded-full animate-pulse" />
                <div className="h-5 w-20 bg-gray-700 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-700 rounded animate-pulse" />
              </div>

              {/* Informations du vendeur */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse" />
                  <div>
                    <div className="h-5 w-32 bg-gray-700 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-gray-700 rounded animate-pulse" />
                  <div className="flex-1 h-10 bg-gray-700 rounded animate-pulse" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

