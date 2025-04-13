"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useScopedI18n } from "@/locales/client";

const BinancePayPage = () => {
  const tScope = useScopedI18n("binance");
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, completed, failed

  function handleChatClick() {
    //@ts-ignore
    void window?.Tawk_API.toggle();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-black/20 via-black-/50 to-yellow-600 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">{tScope("title")}</h1>
            <p className="text-white/80 mt-2">{tScope("desc")}</p>
          </div>

          {/* Main Content */}
          <div className="py-8 px-4">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* QR Code Section */}
              <div className="flex-1 flex flex-col items-center">
                <div className="border-4 border-yellow-400 rounded-xl p-3 mb-4 w-full max-w-xs">
                  {/* Remplacez par votre propre image */}
                  <div className="relative aspect-square w-full">
                    <Image
                      src="/payMethod/binance-pay.jpeg"
                      alt="QR Code Binance Pay"
                      width={300}
                      height={300}
                      className="object-cover object-center rounded-lg"
                    />
                  </div>
                </div>
                <div className="text-center my-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                    <span className="text-base">{tScope("pending")}</span>
                  </div>
                </div>
              </div>

              {/* Instructions Section */}
              <div className="flex-1">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                  {tScope("instructTitle")}
                </h2>
                <ol className="space-y-4 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-full h-6 w-6 flex items-center justify-center text-yellow-600 font-bold text-sm">
                      1
                    </div>
                    <p className="text-lg">{tScope("instructDesc1")}</p>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-full h-6 w-6 flex items-center justify-center text-yellow-600 font-bold text-sm">
                      2
                    </div>
                    <p className="text-lg">{tScope("instructDesc2")}</p>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-full h-6 w-6 flex items-center justify-center text-yellow-600 font-bold text-sm">
                      3
                    </div>
                    <p className="text-lg">{tScope("instructDesc3")}</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-full h-6 w-6 flex items-center justify-center text-yellow-600 font-bold text-sm">
                      4
                    </div>
                    <p className="text-lg">{tScope("instructDesc4")}</p>
                  </li>
                </ol>
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-bold text-lg text-gray-600 mb-2">
                {tScope("infoTitle")}
              </h3>
              <ul className="space-y-2 text-base font-medium text-gray-500">
                <li>• {tScope("infoDesc1")}</li>
                <li>• {tScope("infoDesc2")}</li>
                <li>• {tScope("infoDesc3")}</li>
                <li>• {tScope("infoDesc4")}</li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 mb-3">{tScope("needhelp")}</p>
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                onClick={handleChatClick}
              >
                {tScope("support")}
              </button>
            </div>
          </div>

          {/* Footer */}
          {/* <div className="bg-gray-50 px-6 py-4 flex justify-between items-center text-sm text-gray-500 border-t">
            <div>Paiement sécurisé par Binance Pay</div>
            <div>© {new Date().getFullYear()} Ibendouma</div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BinancePayPage;
