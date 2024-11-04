"use client";

import { useState } from "react";
import { ServerExchange, codeGenerated, parsedDevise } from "@/lib/utils";
import { Gift, Loader } from "lucide-react";
import { useScopedI18n } from "@/locales/client";
import useStore from "@/lib/store-manage";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSession } from "next-auth/react";
import { Card } from "./ui/card";

const SellKamasComponents = ({
  servers,
}: {
  servers: ServerExchange[] | null;
}) => {
  const { data: session, status } = useSession();
  const tScope = useScopedI18n("dialogsell");
  const { devise } = useStore();
  const [formData, setFormData] = useState({
    gameName: "",
    amount: "",
    paymentMethod: "",
    paymentDetails: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameNameError, setGameNameError] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [paymentMethodError, setPaymentMethodError] = useState<string>("");
  const [paymentDetailsError, setPaymentDetailsError] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");
  const [server, setServer] = useState<ServerExchange | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const paymentMethods = [
    "CIH Bank",
    "Attijariwafa Bank",
    "Barid Bank",
    "Western Union",
    "Cash Plus",
    "ADV Cash",
    "Binance Pay",
    "Payeer",
    "Wise",
    "TRC20",
  ];

  const getPaymentDetailsLabel = (method: string) => {
    switch (method) {
      case "CIH Bank":
      case "Attijariwafa Bank":
      case "Barid Bank":
        return tScope("casemaroccobank");
      case "Western Union":
      case "Cash Plus":
        return tScope("casewestandcash");
      case "Binance Pay":
      case "Payeer":
      case "Wise":
        return tScope("casebinpaywise");
      case "ADV Cash":
        return tScope("caseadvcash");
      case "TRC20":
        return tScope("casetrc20");
      default:
        return "";
    }
  };

  const getPaymentDetailsPlaceholder = (method: string) => {
    switch (method) {
      case "CIH Bank":
      case "Attijariwafa Bank":
      case "Barid Bank":
        return tScope("casemaroccobankinput");
      case "Western Union":
      case "Cash Plus":
        return tScope("casewestandcashinput");
      case "Binance Pay":
      case "Payeer":
      case "Wise":
        return tScope("casebinpaywiseinput");
      case "ADV Cash":
        return tScope("caseadvcashinput");
      case "TRC20":
        return tScope("casetrc20input");
      default:
        return "";
    }
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const total = Number(
      ((amount * (server?.serverPriceDh || 0)) / devise.curencyVal).toFixed(2)
    );
    const bonusNoParsed =
      total > 3000 ? (50 / devise.curencyVal).toFixed(2) : 0;
    const bonus = Number(bonusNoParsed);
    return { total, bonus };
  };

  const handleSubmit = async () => {
    // console.log("Form submitted:", formData);
    let paymentInfoDetails = `${formData.paymentMethod}<br/>${formData.paymentDetails}`;

    let qty = Number(formData.amount);

    let unitPrice = ((server?.serverPriceDh || 1) / devise.curencyVal).toFixed(
      2
    );

    if (
      !formData.gameName ||
      !formData.amount ||
      !formData.paymentMethod ||
      !formData.paymentDetails ||
      !server
    ) {
      if (!formData.gameName) {
        setGameNameError(tScope("gameNameError"));
      } else {
        setGameNameError("");
      }

      if (!formData.amount) {
        setAmountError(tScope("amountError"));
      } else {
        setAmountError("");
      }

      if (!formData.paymentMethod) {
        setPaymentMethodError(tScope("paymentMethodError"));
      } else {
        setPaymentMethodError("");
      }

      if (!formData.paymentDetails) {
        setPaymentDetailsError(tScope("paymentDetailsError"));
      } else {
        setPaymentDetailsError("");
      }
      if (!server) {
        setServerError(tScope("serverError"));
      } else {
        setServerError("");
      }
    } else {
      setGameNameError("");
      setAmountError("");
      setPaymentMethodError("");
      setPaymentDetailsError("");
      setServerError("");
      const data = {
        userId: session?.user.id,
        numBuy: codeGenerated(),
        jeu: server?.serverCategory,
        server: server?.serverName,
        pu: Number(unitPrice),
        qte: qty,
        totalPrice: calculateTotal().total + calculateTotal().bonus,
        paymentMethod: formData.paymentMethod,
        gameName: formData.gameName,
        paymentInfoDetails: paymentInfoDetails,
        currencymethod: devise.currencyName,
      };

      try {
        setIsLoading(true);
        const response = await axios.post("/api/go/order", data);
        if (response) {
          toast.success(tScope("success"), {
            style: { color: "#16a34a" },
          });
        }
      } catch (error) {
        // console.log(error);
        toast.success(tScope("error"), {
          style: { color: "#dc2626" },
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleServerChange = (value: string) => {
    const serverSelected = servers?.find(
      (server) => server.serverName === value
    );
    if (serverSelected) {
      setServer(serverSelected);
    }
  };

  return (
    <Card className="w-full bg-transparent p-6">
      <div className="w-full overflow-y-scroll scroll-thumb">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="server">{tScope("server")}</Label>
              <Select
                value={server?.serverName || ""}
                onValueChange={(value) => handleServerChange(value)}
              >
                <SelectTrigger className="outline-none focus:outline-none focus:ring-0">
                  <SelectValue placeholder={tScope("selectServer")} />
                </SelectTrigger>
                <SelectContent>
                  {servers?.map((server) => (
                    <SelectItem key={server._id} value={server.serverName}>
                      {server.serverName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {serverError && (
                <span className="text-sm text-red-500">{serverError}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gameName">{tScope("IngameName")}</Label>
              <Input
                id="gameName"
                placeholder={tScope("IngameInput")}
                value={formData.gameName}
                onChange={(e) => handleInputChange("gameName", e.target.value)}
                className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {gameNameError && (
                <span className="text-sm text-red-500">{gameNameError}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">{tScope("qtyOfKamas")}</Label>
              <Input
                id="amount"
                type="number"
                placeholder={tScope("qtyOfKamasInput")}
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {amountError && (
                <span className="text-sm text-red-500">{amountError}</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">{tScope("paymentMethod")}</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleInputChange("paymentMethod", value)
              }
            >
              <SelectTrigger className="outline-none focus:outline-none focus:ring-0">
                <SelectValue placeholder={tScope("paymentMethodDesc")} />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {paymentMethodError && (
              <span className="text-sm text-red-500">{paymentMethodError}</span>
            )}
          </div>
          {formData.paymentMethod && (
            <div className="space-y-2">
              <Label>{getPaymentDetailsLabel(formData.paymentMethod)}</Label>
              <Input
                placeholder={getPaymentDetailsPlaceholder(
                  formData.paymentMethod
                )}
                value={formData.paymentDetails}
                onChange={(e) =>
                  handleInputChange("paymentDetails", e.target.value)
                }
                className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {paymentDetailsError && (
                <span className="text-sm text-red-500">
                  {paymentDetailsError}
                </span>
              )}
            </div>
          )}
          <div className="bg-amber-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>{tScope("pricedesc")}:</span>
              <span className="font-semibold text-amber-700">
                {((server?.serverPriceDh || 0) / devise.curencyVal).toFixed(2)}{" "}
                {parsedDevise(devise.currencyName)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{tScope("total")}:</span>
              <span className="font-semibold text-amber-700">
                {calculateTotal().total} {parsedDevise(devise.currencyName)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-700">
              <Gift className="h-4 w-4" />
              <span>
                {tScope("bonus", {
                  bonus1: (50 / devise.curencyVal).toFixed(2),
                  cur: parsedDevise(devise.currencyName),
                  totalbonus: (3000 / devise.curencyVal).toFixed(2),
                })}
              </span>
            </div>
          </div>
        </div>
        {/* "dialogsell.bonus":"Bonus: +{bonus1} {cur} (orders over {totalbonus} {cur})", */}

        <Button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-white"
          onClick={handleSubmit}
          disabled={isLoading || !session?.user.id}
          aria-label="submit sell kamas button"
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <Loader className="animate-spin" size={24} />
              {tScope("btnLoading")}
            </span>
          ) : (
            tScope("btn")
          )}
        </Button>
      </div>
    </Card>
  );
};

export default SellKamasComponents;
