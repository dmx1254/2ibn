"use client";

import React, { useEffect, useState } from "react";
import { Gift, XCircle } from "lucide-react";
import Link from "next/link";
import { useScopedI18n } from "@/locales/client";
import { useSearchParams } from "next/navigation";

interface GIFT {
  id: number;
  left: number;
  delay: number;
  rotation: number;
  size: number;
}

const FailedOrder = () => {
  const tScope = useScopedI18n("orderFailed");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (orderId) {
  //       const response = await fetch(`/api/paypal/order/failled?orderId=${orderId}`);
  //       const data = await response.json();
  //       console.log(data);
  //     }
  //   };
  //   fetchData();
  // }, [orderId]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col items-center justify-center relative overflow-hidden">
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
          <Gift size={gift.size} className="text-red-500 opacity-50" />
        </div>
      ))}

      {/* Contenu principal */}
      <div className="bg-white p-8 rounded-lg shadow-xl text-center z-10 mx-4">
        <div className="mb-6 flex justify-center">
          <XCircle size={64} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {tScope("title")}
        </h1>
        <p className="text-gray-600 text-lg mb-6">{tScope("desc")}</p>
        <Link
          href="/"
          className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold 
                     hover:bg-red-700 transition-colors duration-300"
        >
          {tScope("btn")}
        </Link>
      </div>
    </div>
  );
};

export default FailedOrder;
