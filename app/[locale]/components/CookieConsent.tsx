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
          className="fixed bottom-4 left-4 max-sm:right-2 z-[100] mx-auto"
        >
          <div
            className="bg-gradient-to-br from-white to-blue-50
            border border-blue-100 rounded-2xl 
            p-4 space-y-4 backdrop-blur-lg"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
          >
            {!isDetailedView ? (
              <div className="flex flex-col items-end justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Cookie className="text-yellow-600 w-10 h-10 rtl:ml-2" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {tScope("title")}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {tScope("titleDesc")}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDetailedView(true)}
                    className="hover:bg-blue-50 rtl:ml-3"
                  >
                    <Settings className="mr-1 h-4 w-4" /> {tScope("btnPerso")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <CheckCheck className="mr-1 h-4 w-4" /> {tScope("btnAccet")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    {tScope("detailParamsTitle")}
                  </h2>
                  <XCircle
                    onClick={() => setIsDetailedView(false)}
                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                  />
                </div>

                {Object.entries(preferences).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 
                               bg-white rounded-lg border border-gray-200"
                  >
                    <div>
                      <h3 className="font-semibold capitalize text-gray-700">
                        {key === "necessary"
                          ? tScope("essTitle")
                          : key === "performance"
                          ? tScope("perfTitle")
                          : tScope("markTitle")}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {key === "necessary"
                          ? tScope("essDesc")
                          : key === "performance"
                          ? tScope("perfDesc")
                          : tScope("markDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={() => togglePreference(key)}
                      disabled={key === "necessary"}
                      className={
                        key === "necessary" ? "cursor-not-allowed" : ""
                      }
                    />
                  </div>
                ))}

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleRejectNonEssential}
                    className="text-red-600 hover:bg-red-50 rtl:ml-3"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {tScope("optRefus")}
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
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
