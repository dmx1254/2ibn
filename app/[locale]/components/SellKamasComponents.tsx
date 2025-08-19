"use client";

import { useState } from "react";
import { ServerExchange, codeGenerated, parsedDevise } from "@/lib/utils";
import { Loader } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { CUR } from "@/lib/types/types";
import { FaDiscord, FaFacebookF, FaWhatsapp } from "react-icons/fa";

const SellKamasComponents = ({
  servers,
}: {
  servers: ServerExchange[] | null;
}) => {
  const { devise, addNewDevise } = useStore();
  const { data: session, status } = useSession();

  // console.log(devise);

  const router = useRouter();

  const tScope = useScopedI18n("dialogsell");

  const [formData, setFormData] = useState({
    gameName: "",
    amount: "",
    paymentMethod: "",
    paymentDetails: "",
    lastname: "",
    firstname: "",
  });

  // function handleChatClick() {
  //   //@ts-ignore
  //   void window?.Tawk_API.toggle();
  // }

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameNameError, setGameNameError] = useState<string>("");
  const [lastnameError, setLastnameError] = useState<string>("");
  const [firstnameError, setFirstnameError] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [paymentMethodError, setPaymentMethodError] = useState<string>("");
  const [paymentDetailsError, setPaymentDetailsError] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");
  const [server, setServer] = useState<ServerExchange | null>(null);
  const [contactMethod, setContactMethod] = useState<{
    whatsapp: string;
    facebook: string;
    discord: string;
  }>({
    whatsapp: "",
    facebook: "",
    discord: "",
  });
  const [selectedContactMethod, setSelectedContactMethod] =
    useState<string>("");

  const handleContactMethod = (field: string, value: string) => {
    setContactMethod((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = async (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (value === "Paypal" || value === "Skrill" || value === "Sepa") {
      if (devise.currencyName === "euro") return;
      await fetchCurrency("euro");
    }
    if (
      value === "CIH Bank" ||
      value === "Attijariwafa Bank" ||
      value === "Bmce" ||
      value === "Crédit du maroc" ||
      value === "Crédit agricole" ||
      value === "Wafacash"
    ) {
      if (devise.currencyName === "mad") return;
      await fetchCurrency("mad");
    }
    if (
      value === "Aed" ||
      value === "Usdt(TRC20/ERC20) " ||
      value === "Usdt(TRC20/ERC20)/USDC(TRC20/ERC20/Binance ID)"
    ) {
      if (devise.currencyName === "dollar") return;
      await fetchCurrency("dollar");
    }
  };

  const paymentMethods = [
    "CIH Bank",
    "Attijariwafa Bank",
    "Bmce",
    "Usdt(TRC20/ERC20)/USDC(TRC20/ERC20/Binance ID)",
    "Sepa",
    "Crédit du maroc",
    "Crédit agricole",
    "Wafacash",
    "Paypal",
    "Skrill",
    // "Usdt(TRC20/ERC20)",
    "Aed",
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
      case "Crédit du maroc":
      case "Crédit agricole":
      case "Cfg":
      case "Société générale":
      case "Aed":
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
      // case "Usdt(TRC20/ERC20)":
        return tScope("casetrc20");
      case "Usdt(TRC20/ERC20)/USDC(TRC20/ERC20/Binance ID)":
        return tScope("caseusdc");
      case "Sepa":
        return tScope("casesepa");
      default:
        return "";
    }
  };

  const getPaymentDetailsPlaceholder = (method: string) => {
    switch (method) {
      case "CIH Bank":
      case "Attijariwafa Bank":
      case "Barid Bank":
      case "Aed":
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
      case "Usdt(TRC20/ERC20)/USDC(TRC20/ERC20/Binance ID)":
        return tScope("caseusdcinput");
      case "Sepa":
        return tScope("casesepainput");
      default:
        return "";
    }
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const total = Number(
      ((amount * (server?.serverPriceDh || 0)) / devise.curencyVal).toFixed(2)
    );
    return total;
  };

  const handleSubmit = async () => {
    if (!session?.user.id) {
      toast.error(tScope("sellOrderErrorLogin"), {
        style: { color: "#dc2626" },
      });
    } else if ((server?.serverPriceDh || 1) * Number(formData.amount) < 200) {
      toast.error("Le montant minimum de vente est de 200 DH", {
        style: { color: "#dc2626" },
        position: "top-right",
      });
      return;
    } else {
      let paymentInfoDetails = `${formData.paymentMethod}<br/>${formData.paymentDetails}`;

      let qty = Number(formData.amount);

      let unitPrice = (
        (server?.serverPriceDh || 1) / devise.curencyVal
      ).toFixed(2);

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
      }
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
        totalPrice: calculateTotal(),
        paymentMethod: formData.paymentMethod,
        gameName: formData.gameName,
        paymentInfoDetails: paymentInfoDetails,
        currencymethod: devise.currencyName,
        lastname: formData.lastname,
        firstname: formData.firstname,
      };

      const contact = Object.entries(contactMethod)
        .filter(([key, value]) => !!value)
        .join("-");

      try {
        setIsLoading(true);
        const response = await axios.post("/api/go/order", {
          data,
          contact,
        });
        if (response) {
          toast.success(tScope("success"), {
            style: { color: "#16a34a" },
          });
          setTimeout(() => {
            // handleChatClick();
            router.push("/order-success");
          }, 1000);
        }
      } catch (error) {
        // console.log(error);
        toast.success(tScope("error"), {
          style: { color: "#dc2626" },
        });
      } finally {
        setIsLoading(false);
      }
      // console.log("yes");
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

  const fetchCurrency = async (currency: string) => {
    const response = await fetch(`/api/iben/currency/${currency}`, {
      method: "POST",
      body: JSON.stringify({ cur: "eur" }),
    });
    if (!response.ok) {
      throw new Error("Fetching currency failed: ");
    }

    const data: CUR[] = await response.json();
    // console.log(data);
    if (data && data.length > 0) {
      let keys = Object.keys(data[0]);
      let values = Object.values(data[0]);
      let name = keys[1];
      let val = values[1];
      const dev = {
        currencyName: name,
        curencyVal: val,
      };
      addNewDevise(dev);
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
                {calculateTotal()} {parsedDevise(devise.currencyName)}
              </span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-white"
          onClick={handleSubmit}
          disabled={isLoading}
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
        <div className="w-full max-w-md bg-[#363A3D] text-white/80 mt-4 border-none p-4 rounded-lg space-y-4">
          <Label htmlFor="contactMethod" className="text-sm font-medium">
            {tScope("contactMethod")}
          </Label>
          <div className="space-y-4">
            <Select
              value={selectedContactMethod}
              onValueChange={(value) => {
                setSelectedContactMethod(value);
                // Reset contact method values when switching
                handleContactMethod(value, "");
              }}
            >
              <SelectTrigger className="outline-none bg-[#363A3D] border-white/10 text-white/80 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                <SelectValue placeholder={tScope("contactMethodDesc")} />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1D21] border-[#45494e] text-white">
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
              </SelectContent>
            </Select>

            {selectedContactMethod === "whatsapp" && (
              <div className="flex items-center gap-2">
                <Input
                  id="whatsapp"
                  placeholder="WhatsApp: +XXX XXXXXXXX"
                  value={contactMethod.whatsapp || ""}
                  onChange={(e) =>
                    handleContactMethod("whatsapp", e.target.value)
                  }
                  className="outline-none bg-[#363A3D] text-white/80 border-white/10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <FaWhatsapp className="text-green-500" size={20} />
              </div>
            )}

            {selectedContactMethod === "facebook" && (
              <div className="flex items-center gap-2">
                <Input
                  id="facebook"
                  placeholder="Facebook: your.username"
                  value={contactMethod.facebook || ""}
                  onChange={(e) =>
                    handleContactMethod("facebook", e.target.value)
                  }
                  className="outline-none bg-[#363A3D] text-white/80 border-white/10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <FaFacebookF className="text-blue-500" size={20} />
              </div>
            )}

            {selectedContactMethod === "discord" && (
              <div className="flex items-center gap-2">
                <Input
                  id="discord"
                  placeholder="Discord: username#0000"
                  value={contactMethod.discord || ""}
                  onChange={(e) =>
                    handleContactMethod("discord", e.target.value)
                  }
                  className="outline-none bg-[#363A3D] text-white/80 border-white/10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <FaDiscord className="text-purple-500" size={20} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SellKamasComponents;
