"use client";

import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { useScopedI18n } from "@/locales/client";

export default function NotFound() {
  const tScope = useScopedI18n("notFound");
  return (
    <div className="min-h-screen flex items-center justify-center -mt-20">
      <div className="text-center space-y-6 p-8">
        {/* Large 404 Number */}
        <h1 className="text-9xl font-bold text-gray-200">404</h1>

        {/* Error Message Container */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">
            {tScope("title")}
          </h2>
          <p className="text-gray-600">{tScope("subtitle")}</p>
        </div>

        {/* Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-200"
        >
          <HomeIcon size={20} />
          <span>{tScope("backHome")}</span>
        </Link>

        {/* Additional Help Text */}
        <p className="text-sm text-gray-500">{tScope("desc")}</p>
      </div>
    </div>
  );
}
