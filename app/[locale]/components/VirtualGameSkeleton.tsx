import { Card } from "./ui/card";

export const VirtualGameSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#1A1D21] text-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-700 rounded-full animate-pulse" />
          <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-700 rounded-full animate-pulse" />
          <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-700 rounded mb-2 animate-pulse" />
          <div className="h-5 w-48 bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="h-12 w-full bg-gray-700 rounded-lg animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-5 w-20 bg-gray-700 rounded animate-pulse" />
            <div className="flex gap-4">
              <div className="h-5 w-28 bg-gray-700 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="h-5 w-40 bg-gray-700 rounded mb-4 animate-pulse" />

        {/* Grille de produits Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card
              key={i}
              className="bg-[#2A2D30] border border-gray-700 rounded-lg p-5"
            >
              <div className="h-10 w-full bg-gray-700 rounded mb-3 animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-700 rounded mb-3 animate-pulse" />
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-4 bg-gray-700 rounded-full animate-pulse" />
                <div className="h-4 w-full bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-3 w-16 bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="pt-4 border-t border-gray-700">
                <div className="h-4 w-24 bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

