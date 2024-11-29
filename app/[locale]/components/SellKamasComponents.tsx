"use client";

import { useLayoutEffect, useState } from "react";
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
  const { devise, addNewDevise } = useStore();
  const { data: session, status } = useSession();
  const tScope = useScopedI18n("dialogsell");
  useLayoutEffect(() => {
    addNewDevise({ currencyName: "mad", curencyVal: 1 });
  }, []);

  const [formData, setFormData] = useState({
    gameName: "",
    amount: "",
    paymentMethod: "",
    paymentDetails: "",
    lastname: "",
    firstname: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameNameError, setGameNameError] = useState<string>("");
  const [lastnameError, setLastnameError] = useState<string>("");
  const [firstnameError, setFirstnameError] = useState<string>("");
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
    "Bmce",
    "BMCI",
    "Crédit du maroc",
    "Crédit agricole",
    "Cfg",
    "Société générale",
    "Cash Plus",
    "Wafacash",
    "Paypal",
    "Skrill",
    "Usdt",
    // "Binance Pay",
    // "Payeer",
    // "Wise",
    // "TRC20",
  ];

  const getPaymentDetailsLabel = (method: string) => {
    switch (method) {
      case "CIH Bank":
      case "Attijariwafa Bank":
      case "Bmce":
      case "BMCI":
      case "Crédit du maroc":
      case "Crédit agricole":
      case "Cfg":
      case "Société générale":
        return tScope("casemaroccobank");
      case "Western Union":
        return tScope("casewestandcash");
      case "Cash Plus":
      case "Wafacash":
        return tScope("casemaroccobankCashAndWafa");
      case "Binance Pay":
      case "Paypal":
      case "Skrill":
        return tScope("casebinpaywise");
      case "ADV Cash":
        return tScope("caseadvcash");
      case "Usdt":
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
        return tScope("casewestandcashinput");
      case "Binance Pay":
      case "Payeer":
      case "Wise":
        return tScope("casebinpaywiseinput");
      case "Cash Plus":
      case "Wafacash":
        return tScope("casemaroccobankCashAndWafa");
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
      !formData.lastname ||
      !formData.firstname ||
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
      if (!formData.lastname) {
        setLastnameError(tScope("lastnameError"));
      } else {
        setLastnameError("");
      }
      if (!formData.firstname) {
        setFirstnameError(tScope("firstnameError"));
      } else {
        setFirstnameError("");
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
      setLastnameError("");
      setFirstnameError("");
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
        lastname: formData.lastname,
        firstname: formData.firstname,
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
              <Label htmlFor="server" className="text-white/90">
                {tScope("server")}
              </Label>
              <Select
                value={server?.serverName || ""}
                onValueChange={(value) => handleServerChange(value)}
              >
                <SelectTrigger className="outline-none bg-[#363A3D] text-white/80 border-[#363A3D] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder={tScope("selectServer")} />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1D21] border-[#45494e] text-white">
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
              <Label htmlFor="gameName" className="text-white/90">
                {tScope("IngameName")}
              </Label>
              <Input
                id="gameName"
                placeholder={tScope("IngameInput")}
                value={formData.gameName}
                onChange={(e) => handleInputChange("gameName", e.target.value)}
                className="outline-none bg-[#363A3D] text-white/80 border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {gameNameError && (
                <span className="text-sm text-red-500">{gameNameError}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white/90">
                {tScope("qtyOfKamas")}
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder={tScope("qtyOfKamasInput")}
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="outline-none bg-[#363A3D] text-white/80 border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {amountError && (
                <span className="text-sm text-red-500">{amountError}</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className="text-white/90">
              {tScope("paymentMethod")}
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleInputChange("paymentMethod", value)
              }
            >
              <SelectTrigger className="outline-none bg-[#363A3D] border-[#363A3D] text-white/80 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                <SelectValue placeholder={tScope("paymentMethodDesc")} />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1D21] border-[#45494e] text-white">
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
              <Label className="text-white/90">
                {getPaymentDetailsLabel(formData.paymentMethod)}
              </Label>
              <Input
                placeholder={getPaymentDetailsPlaceholder(
                  formData.paymentMethod
                )}
                value={formData.paymentDetails}
                onChange={(e) =>
                  handleInputChange("paymentDetails", e.target.value)
                }
                className="outline-none bg-[#363A3D] text-white/80 border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {paymentDetailsError && (
                <span className="text-sm text-red-500">
                  {paymentDetailsError}
                </span>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-white/90">
                {tScope("lastname")}
              </Label>
              <Input
                id="lastname"
                placeholder={tScope("lastnameInput")}
                value={formData.lastname}
                onChange={(e) => handleInputChange("lastname", e.target.value)}
                className="outline-none bg-[#363A3D] text-white/80 border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {lastnameError && (
                <span className="text-sm text-red-500">{lastnameError}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-white/90">
                {tScope("firstname")}
              </Label>
              <Input
                id="firstname"
                placeholder={tScope("firstnameInput")}
                value={formData.firstname}
                onChange={(e) => handleInputChange("firstname", e.target.value)}
                className="outline-none bg-[#363A3D] text-white/80 border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {firstnameError && (
                <span className="text-sm text-red-500">{firstnameError}</span>
              )}
            </div>
          </div>
          <div className="bg-[#363A3D] text-white/80 border-none p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>{tScope("pricedesc")}:</span>
              <span className="font-semibold text-amber-600">
                {((server?.serverPriceDh || 0) / devise.curencyVal).toFixed(2)}{" "}
                {parsedDevise(devise.currencyName)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{tScope("total")}:</span>
              <span className="font-semibold text-amber-600">
                {calculateTotal().total} {parsedDevise(devise.currencyName)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Gift className="h-4 w-4" />
              <span>{tScope("bonus")}</span>
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
