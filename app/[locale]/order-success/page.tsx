"use client";

import React, { useEffect, useState } from "react";
import { Gift, CheckCircle } from "lucide-react";
import { useScopedI18n } from "@/locales/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import useStore from "@/lib/store-manage";

interface GIFT {
  id: number;
  left: number;
  delay: number;
  rotation: number;
  size: number;
}

const SuccessOrder = () => {
  const tScope = useScopedI18n("orderSuccess");
  const tScopeOrder = useScopedI18n("orderConfirmation");
  const { clearCart } = useStore();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const type = searchParams.get("type");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const router = useRouter();
  // Assurez-vous que orderId ne contient pas déjà un point d'interrogation
  const cleanOrderId = orderId?.replace(/\?/g, "");
  useEffect(() => {
    const fetchData = async () => {
      const object = tScopeOrder("object");
      if (orderId) {
        await fetch(
          `/api/paypal/order/success?orderId=${cleanOrderId}&type=${type}&object=${encodeURIComponent(
            object
          )}`
        );
      }
    };
    fetchData();
  }, [orderId]);

  setTimeout(() => {
    setIsButtonDisabled(false);
  }, 3000);

  const [gifts, setGifts] = useState<GIFT[]>([]);

  useEffect(() => {
    // Créer 20 cadeaux avec des positions et délais aléatoires
    const newGifts = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      rotation: Math.random() * 360,
      size: 24 + Math.random() * 24, // Taille entre 24px et 48px
    }));
    setGifts(newGifts);
  }, []);

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Cadeaux qui tombent */}
      {gifts.map((gift) => (
        <div
          key={gift.id}
          className="absolute animate-fall"
          style={{
            left: `${gift.left}%`,
            animationDelay: `${gift.delay}s`,
            transform: `rotate(${gift.rotation}deg)`,
          }}
        >
          <Gift size={gift.size} className="text-orange-500 opacity-50" />
        </div>
      ))}

      {/* Contenu principal */}
      <div className="bg-white p-8 rounded-lg shadow-xl text-center z-10 mx-4">
        <div className="mb-6 flex justify-center">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {tScope("title")}
        </h1>
        <p className="text-gray-600 text-lg mb-6">{tScope("desc")}</p>
        <Button
          disabled={isButtonDisabled}
          onClick={() => router.push("/")}
          className="bg-yellow-600 text-white px-8 py-3 rounded-full font-semibold 
                     hover:bg-yellow-700 transition-colors duration-300"
        >
          {tScope("btn")}
        </Button>
      </div>
    </div>
  );
};

export default SuccessOrder;
