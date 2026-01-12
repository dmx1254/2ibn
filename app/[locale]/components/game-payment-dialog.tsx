"use client";

import { useState, useEffect } from "react";
import { useScopedI18n } from "@/locales/client";
import {
  orderBuyNumGenerated,
  paymentMethod,
  paymentMethodMorroco,
  Billing,
} from "@/lib/utils";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card } from "./ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LiaCircleSolid } from "react-icons/lia";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import useStore from "@/lib/store-manage";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

interface Account {
  _id: string;
  category: string;
  licence: string;
  description: string;
  minQ: number;
  stock: number;
  deliveryDelay: number;
  price: number;
  status: string;
  moreDetails: string;
}

interface GamePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    amount: string;
    bonus?: string;
    price: number;
  };
  gameTitle: string;
  account: Account;
  quantity: number;
}

export const GamePaymentDialog = ({
  isOpen,
  onClose,
  account,
  quantity,
}: GamePaymentDialogProps) => {
  const router = useRouter();
  const t = useScopedI18n("paymentMode");
  const tsCope = useScopedI18n("paymentMode");
  const tScope = useScopedI18n("cartpage");
  const { devise } = useStore();
  const { data: session } = useSession();
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [billingInfo, setBillingInfo] = useState<Billing>({
    lastname: "",
    firstname: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    codePostal: "",
    country: "",
    departement: "",
  });

  // Récupérer les informations utilisateur
  const getUser = async () => {
    if (!session?.user.id) return null;
    const response = await fetch(`/api/iben/user/${session.user.id}`);
    const data = await response.json();
    return data;
  };

  const handleChatClick = () => {
    //@ts-expect-error - Tawk_API is not defined in the global scope
    void window?.Tawk_API.toggle();
  };

  const { data: userData } = useQuery({
    queryKey: ["userOrder", session?.user.id],
    queryFn: getUser,
    enabled: !!session?.user.id && isOpen,
  });

  useEffect(() => {
    if (userData) {
      setBillingInfo({
        lastname: userData.lastname || "",
        firstname: userData.firstname || "",
        address: userData.address || "",
        phone: userData.phone || "",
        email: userData.email || "",
        city: userData.city || "",
        codePostal: userData.codePostal || "",
        country: userData.country || "",
        departement: userData.departement || "",
      });
    }
  }, [userData]);

  const handleCheckout = async () => {
    if (!session?.user.id) {
      toast.error(tScope("login"), {
        style: { color: "#dc2626" },
        position: "top-right",
      });
      return;
    }

    if (!selectedMethod) {
      toast.error("Veuillez sélectionner une méthode de paiement", {
        style: { color: "#dc2626" },
        position: "top-right",
      });
      return;
    }

    // Préparer les produits pour la commande selon le modèle IProduct
    const unitPrice = account.price / devise.curencyVal;
    const totalPriceForProduct = (account.price * quantity) / devise.curencyVal;

    const products = [
      {
        description: account.description,
        qty: quantity,
        price: Number(unitPrice.toFixed(2)),
        totalPrice: Number(totalPriceForProduct.toFixed(2)),
        product: account.description, // product correspond à la description
        category: account.category,
        licence: account.licence,
        deliveryDelay: account.deliveryDelay,
      },
    ];

    const orderData = {
      userId: session.user.id,
      numOrder: orderBuyNumGenerated(),
      products: products,
      totalPrice: Number(totalPriceForProduct.toFixed(2)),
      paymentMethod: selectedMethod,
      status: "En attente",
      address: "",
      billing: billingInfo,
      cur: devise.currencyName,
      valCurency: devise.curencyVal,
    };

    // Créer la commande (tous les paiements se font via le chat)
    try {
      setIsPaying(true);
      const response = await fetch("/api/go/accounts/order", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      if (data) {
        toast.success(tScope("success"), {
          style: { color: "#16a34a" },
        });

        handleChatClick();
        setTimeout(() => {
          router.push("/order-success");
        }, 1000);
      }
    } catch (error) {
      toast.error(tScope("error"), {
        style: { color: "#dc2626" },
      });
      console.log(error);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-scroll overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            {t("selectPayment")}
          </DialogTitle>
        </DialogHeader>

        {/* Méthodes de paiement - En colonne, responsive */}
        <div className="flex flex-col gap-6">
          <Card className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-4">
              {tsCope("international")}
            </h3>
            <div className="space-y-3 md:space-y-4">
              {paymentMethod.map((method) => (
                <div
                  key={method.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedMethod === method.title
                      ? "border-yellow-500"
                      : "border-gray-300"
                  }`}
                  style={{
                    opacity: method.isActive ? 1 : 0.5,
                  }}
                  onClick={() => {
                    if (method.isActive) {
                      setSelectedMethod(method.title);
                    }
                  }}
                  aria-label={`${method.title} payment method`}
                >
                  {selectedMethod === method.title ? (
                    <IoIosCheckmarkCircleOutline
                      className="w-5 h-5 text-yellow-500 cursor-pointer"
                      onClick={() => setSelectedMethod(method.title)}
                    />
                  ) : (
                    <LiaCircleSolid
                      className="w-5 h-5 text-gray-400 cursor-pointer"
                      onClick={() => {
                        if (method.isActive) {
                          setSelectedMethod(method.title);
                        }
                      }}
                    />
                  )}
                  <div className="flex-1 flex items-center gap-3 sm:gap-4">
                    <Image
                      src={method.imgPay}
                      alt={method.title}
                      width={
                        method.title === "binance"
                          ? 220
                          : method.title ===
                              "USDT/USDC (TRC20/ERC20/USDC/Binance ID)"
                            ? 140
                            : method.title === "coinpal"
                              ? 150
                              : method.title === "creditcard"
                                ? 180
                                : method.title === "Skrill"
                                  ? 100
                                  : 80
                      }
                      height={
                        method.title === "binance"
                          ? 220
                          : method.title ===
                              "USDT/USDC (TRC20/ERC20/USDC/Binance ID)"
                            ? 140
                            : method.title === "coinpal"
                              ? 150
                              : method.title === "creditcard"
                                ? 80
                                : method.title === "Skrill"
                                  ? 80
                                  : 80
                      }
                      className="object-contain w-auto h-auto max-w-full sm:max-w-none"
                    />
                    {method.desc && (
                      <span className="text-xs sm:text-sm text-gray-500 flex-1">
                        {method.title === "paypal"
                          ? tsCope("paypalDesc")
                          : method.title === "crypto"
                            ? tsCope("cryptoDesc")
                            : method.title === "creditcard"
                              ? tsCope("creditcardDesc")
                              : method.desc}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-4">
              {tsCope("morocco")}
            </h3>
            <div className="space-y-3 md:space-y-4">
              {paymentMethodMorroco.map((method) => (
                <div
                  key={method.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedMethod === method.title
                      ? "border-yellow-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedMethod(method.title)}
                  aria-label={`${method.title} payment method`}
                >
                  {selectedMethod === method.title ? (
                    <IoIosCheckmarkCircleOutline
                      className="w-5 h-5 text-yellow-500 cursor-pointer flex-shrink-0"
                      onClick={() => setSelectedMethod(method.title)}
                    />
                  ) : (
                    <LiaCircleSolid
                      className="w-5 h-5 text-gray-400 cursor-pointer flex-shrink-0"
                      onClick={() => setSelectedMethod(method.title)}
                    />
                  )}
                  <div className="flex-1 flex items-center gap-3 sm:gap-4">
                    <Image
                      src={method.imgPay}
                      alt={method.title}
                      width={method.w || 200}
                      height={method.h || 200}
                      className="object-contain w-auto h-auto max-w-full sm:max-w-none"
                    />
                    {method.desc && (
                      <span className="text-xs sm:text-sm text-gray-500 flex-1">
                        {method.title === "paypal"
                          ? tsCope("paypalDesc")
                          : method.title === "crypto"
                            ? tsCope("cryptoDesc")
                            : method.title === "creditcard"
                              ? tsCope("creditcardDesc")
                              : method.desc}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bouton de confirmation */}
        <div className="flex justify-center mt-4 md:mt-6">
          <button
            onClick={handleCheckout}
            disabled={!selectedMethod || isPaying}
            className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-[#eab308] to-[#f97316] hover:from-[#f97316] hover:to-[#eab308] text-black font-bold py-3 px-6 md:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-sm md:text-base"
          >
            {isPaying ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Traitement...
              </>
            ) : (
              t("confirmPayment")
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
