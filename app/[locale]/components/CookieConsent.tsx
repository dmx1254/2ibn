"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Cookie, CheckCheck, XCircle, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "@/components/ui/switch";
import { useScopedI18n } from "@/locales/client";

const CookieConsent = () => {
  const tScope = useScopedI18n("cookie");
  const [isVisible, setIsVisible] = useState(false);
  const [isDetailedView, setIsDetailedView] = useState(false);
  const [preferences, setPreferences] = useState<{
    [key: string]: boolean;
  }>({
    necessary: true,
    performance: false,
    // marketing: false,
  });

  useEffect(() => {
    // Vérifier si les cookies ont déjà été configurés
    const cookiesConfigured = localStorage.getItem("cookiesConfigured");

    // S'affiche 1 seconde après le chargement de la page
    const timer = setTimeout(() => {
      if (!cookiesConfigured) {
        setIsVisible(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    setPreferences({
      necessary: true,
      performance: true,
      //   marketing: true,
    });
    localStorage.setItem("cookiesConfigured", "true");
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    setPreferences({
      necessary: true,
      performance: false,
      //   marketing: false,
    });
    localStorage.setItem("cookiesConfigured", "true");
    setIsVisible(false);
  };

  const togglePreference = (key: string) => {
    if (key !== "necessary") {
      setPreferences((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-2xl"
        >
          <div className="bg-black/90 rounded-xl p-6 text-white shadow-[0_0_20px_rgba(0,128,255,0.3)] border border-blue-500/30 backdrop-blur">
            {!isDetailedView ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <Cookie className="text-blue-400 w-12 h-12 animate-pulse" />
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {tScope("title")}
                    </h2>
                    <p className="text-gray-400 mt-2">{tScope("titleDesc")}</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailedView(true)}
                    className="border-blue-500/50 hover:bg-blue-500/20 text-blue-400"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    {tScope("btnPerso")}
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                  >
                    <CheckCheck className="mr-2 h-4 w-4" />
                    {tScope("btnAccet")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {tScope("detailParamsTitle")}
                  </h2>
                  <XCircle
                    onClick={() => setIsDetailedView(false)}
                    className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  />
                </div>

                <div className="space-y-4">
                  {Object.entries(preferences).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-blue-400 capitalize">
                          {key === "necessary"
                            ? tScope("essTitle")
                            : tScope("perfTitle")}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {key === "necessary"
                            ? tScope("essDesc")
                            : tScope("perfDesc")}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={() => togglePreference(key)}
                        disabled={key === "necessary"}
                        className={`${
                          key === "necessary" ? "cursor-not-allowed" : ""
                        } data-[state=checked]:bg-blue-500`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleRejectNonEssential}
                    className="border-red-500/50 hover:bg-red-500/20 text-red-400"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {tScope("optRefus")}
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                  >
                    <CheckCheck className="mr-2 h-4 w-4" />
                    {tScope("optAccept")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
