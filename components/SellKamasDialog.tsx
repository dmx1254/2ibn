"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServerExchange, parsedDevise } from "@/lib/utils";
import { Gift } from "lucide-react";
import { useScopedI18n } from "@/locales/client";
import useStore from "@/lib/store-manage";

const SellKamasDialog = ({
  serverStatus,
  server,
}: {
  serverStatus: string;
  server: ServerExchange;
}) => {
  const tScope = useScopedI18n("dialogsell");
  const { devise } = useStore();
  const [formData, setFormData] = useState({
    gameName: "",
    email: "",
    fullName: "",
    amount: "",
    paymentMethod: "",
    paymentDetails: "",
    comments: "",
  });

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
      ((amount * server.serverPriceDh) / devise.curencyVal).toFixed(2)
    );
    const bonus = total > 3000 ? (50 / devise.curencyVal).toFixed(2) : 0;
    return { total, bonus };
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add your submission logic here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-amber-500 hover:bg-amber-600 text-white border-none hover:text-white"
          disabled={serverStatus === "Stock complet"}
        >
          {tScope("btnSell")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[calc(100vh-60px)] h-full overflow-y-scroll scroll-thumb">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900">
            {tScope("title", { server: server.serverName })}
          </DialogTitle>
          <DialogDescription>{tScope("desc")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gameName">{tScope("IngameName")}</Label>
              <Input
                id="gameName"
                placeholder={tScope("IngameInput")}
                value={formData.gameName}
                onChange={(e) => handleInputChange("gameName", e.target.value)}
                className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{tScope("contactEmail")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={tScope("contactEmailInput")}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{tScope("fullname")}</Label>
              <Input
                id="fullName"
                placeholder={tScope("fullnameInput")}
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
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
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="comments">{tScope("comments")}</Label>
            <Textarea
              id="comments"
              placeholder={tScope("commentsInput")}
              value={formData.comments}
              onChange={(e) => handleInputChange("comments", e.target.value)}
              className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="bg-amber-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>{tScope("pricedesc")}:</span>
              <span className="font-semibold text-amber-700">
                {(server.serverPriceDh / devise.curencyVal).toFixed(2)}{" "}
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
        <DialogFooter>
          <Button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleSubmit}
          >
            {tScope("btn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SellKamasDialog;
