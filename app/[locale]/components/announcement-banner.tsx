"use client";

import { useScopedI18n } from "@/locales/client";

export const AnnouncementBanner = () => {
  const t = useScopedI18n("announcement");

  return (
    <div className="bg-yellow-500 text-black overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        <span className="mx-4 py-2 inline-block">
          {t("message")}
        </span>
      </div>
    </div>
  );
}; 