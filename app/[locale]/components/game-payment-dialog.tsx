"use client";

import { useState } from "react";
import { useScopedI18n } from "@/locales/client";
import {
  orderBuyNumGenerated,
  parsedDevise,
  paymentMethod,
  paymentMethodMorroco,
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
import axios from "axios";

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
}

export const GamePaymentDialog = ({
  isOpen,
  onClose,
  product,
  gameTitle,
}: GamePaymentDialogProps) => {
  const t = useScopedI18n("paymentMode");
  const tScope = useScopedI18n("cartpage");
  const tScopeR = useScopedI18n("signup");
  const tScopeCheck = useScopedI18n("checkout");
  const tScopeConfirm = useScopedI18n("orderConfirmation");
  const { devise } = useStore();
  const router = useRouter();
  const { data: session } = useSession();
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  // console.log(product);
  // console.log(gameTitle);

  // const handlePaymentSelect = async (method: string) => {
  //   try {
  //   } catch (error) {
  //   } finally {
  //     setIsPaying(false);
  //   }
  // };

  const handleCheckout = async () => {
    const data = {
      userId: session?.user.id,
      name: gameTitle,
      items: product.amount.split(" ")[1] || "",
      orderNum: orderBuyNumGenerated(),
      bonus: Number(product.bonus) || 0,
      status: "pending",
      type: "game",
      totalPrice: Number(product.price / devise.curencyVal).toFixed(2),
      paymentMethod: selectedMethod,
      orderIdPaid: "",
      amount: parseInt(product.amount),
      cur: devise.currencyName,
      valcurrency: Number(devise.curencyVal),
      price: Number(product.price / devise.curencyVal).toFixed(2),
    };

    // userId: string;
    // name: string;
    // items: string;
    // orderNum: string;
    // status: GameStatus;
    // bonus?:number;
    // type: GameType;
    // amount: number;
    // price: number;
    // paymentMethod: string;
    // currency: string;
    // valcurrency: number;
    // totalPrice: number;
    // orderIdPaid?: string;

    if (!session?.user.id) {
      toast.error(tScope("login"), {
        style: { color: "#dc2626" },
        position: "top-right",
      });
      return;
    }

    if (selectedMethod === "paypal") {
      try {
        setIsPaying(true);
        const result = await axios.post("/api/paypal", {
          data,
          object: tScopeConfirm("object"),
        });
        window.location.href = result.data.redirectUrl;
      } catch (error) {
        console.log(error);
      } finally {
        setIsPaying(false);
      }
      // console.log("yes");
    } else if (selectedMethod === "crypto") {
      try {
        setIsPaying(true);
        const result = await axios.post("/api/nowpayment", {
          data,
          object: tScopeConfirm("object"),
        });
        window.location.href = result.data.invoice_url;
      } catch (error) {
        console.log(error);
      } finally {
        setIsPaying(false);
      }
    } else if (selectedMethod === "coinpal" || selectedMethod === "binance") {
      try {
        setIsPaying(true);
        const result = await axios.post("/api/coinpal", {
          data,
          object: tScopeConfirm("object"),
        });
        window.location.href = result.data.nextStepContent;
      } catch (error) {
        console.log(error);
      } finally {
        setIsPaying(false);
      }
    }

    // else if (selectedMethod === "binance") {
    //   try {
    //     setIsPaying(true);
    //     const result = await axios.post("/api/iben/order", {
    //       data,
    //       object: tScopeConfirm("object"),
    //     });
    //     if (result.data) {
    //       toast.success(tScope("success"), {
    //         style: { color: "#16a34a" },
    //       });

    //       setTimeout(() => {
    //         // handleChatClick();
    //         router.push("/pay-with-binance");
    //       }, 1000);
    //     }
    //   } catch (error) {
    //     toast.success(tScope("error"), {
    //       style: { color: "#dc2626" },
    //     });
    //     console.log(error);
    //   } finally {
    //     setIsPaying(false);
    //   }
    // }
    else {
      try {
        setIsPaying(true);
        const result = await axios.post("/api/iben/order", {
          data,
          object: tScopeConfirm("object"),
        });
        if (result.data) {
          toast.success(tScope("success"), {
            style: { color: "#16a34a" },
          });

          setTimeout(() => {
            // handleChatClick();
            router.push("/order-success");
          }, 1000);
        }
      } catch (error) {
        toast.success(tScope("error"), {
          style: { color: "#dc2626" },
        });
        console.log(error);
      } finally {
        setIsPaying(false);
      }
    }

    // console.log("data", data);
  };

  // console.log(product);
  // console.log(gameTitle);
  // console.log(selectedMethod);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-scroll overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t("selectPayment")}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Détails du produit */}
          <Card className="p-6 relative">
            <h3 className="text-lg font-semibold mb-4">{gameTitle}</h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{t("amount")}:</span>
                <span className="font-semibold">{product.amount}</span>
              </div>
              {product.bonus && (
                <div className="flex justify-between text-yellow-600">
                  <span>{t("bonus")}:</span>
                  <span className="font-semibold">+{product.bonus}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">{t("price")}:</span>
                <span className="font-semibold">
                  {(Number(product.price) / devise.curencyVal).toFixed(2)}{" "}
                  {parsedDevise(devise.currencyName)}
                </span>
              </div>
              <div className="mb-2 pt-12 sm:pt-4">
                <button
                  onClick={handleCheckout}
                  disabled={!selectedMethod || isPaying}
                  className="absolute bottom-2 flex items-center justify-center left-0 right-0 mx-4 bg-gradient-to-r from-[#eab308] to-[#f97316] hover:from-[#f97316] hover:to-[#eab308] text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {isPaying ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    t("confirmPayment")
                  )}
                </button>
              </div>
            </div>
          </Card>

          {/* Méthodes de paiement */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("international")}
              </h3>
              <div className="space-y-4">
                {paymentMethod.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedMethod === method.title
                        ? "border-yellow-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedMethod(method.title)}
                  >
                    {selectedMethod === method.title ? (
                      <IoIosCheckmarkCircleOutline
                        className="w-5 h-5 text-yellow-500 cursor-pointer"
                        onClick={() => setSelectedMethod(method.title)}
                      />
                    ) : (
                      <LiaCircleSolid
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                        onClick={() => setSelectedMethod(method.title)}
                      />
                    )}
                    <Image
                      src={method.imgPay}
                      alt={method.title}
                      width={
                        method.title === "binance"
                          ? 220
                          : method.title === "crypto"
                          ? 140
                          : method.title === "coinpal"
                          ? 150
                          : 100
                      }
                      height={
                        method.title === "binance"
                          ? 220
                          : method.title === "crypto"
                          ? 140
                          : method.title === "coinpal"
                          ? 150
                          : 100
                      }
                      className="object-contain"
                    />
                    {method.fee && (
                      <span className="text-sm text-gray-500">
                        {method.fee}% {t("feegame")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t("morocco")}</h3>
              <div className="space-y-4">
                {paymentMethodMorroco.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedMethod === method.title
                        ? "border-yellow-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedMethod(method.title)}
                  >
                    {selectedMethod === method.title ? (
                      <IoIosCheckmarkCircleOutline
                        className="w-5 h-5 text-yellow-500 cursor-pointer"
                        onClick={() => setSelectedMethod(method.title)}
                      />
                    ) : (
                      <LiaCircleSolid
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                        onClick={() => setSelectedMethod(method.title)}
                      />
                    )}
                    <Image
                      src={method.imgPay}
                      alt={method.title}
                      width={method.w || 200}
                      height={method.h || 200}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
