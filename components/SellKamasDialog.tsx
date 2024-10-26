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
import { ServerExchange, codeGenerated, parsedDevise } from "@/lib/utils";
import { Gift, Loader } from "lucide-react";
import useStore from "@/lib/store-manage";
import axios from "axios";
import { toast } from "sonner";

const SellKamasDialog = ({
  serverStatus,
  server,
}: {
  serverStatus: string;
  server: ServerExchange;
}) => {
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameNameError, setGameNameError] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [paymentMethodError, setPaymentMethodError] = useState<string>("");
  const [paymentDetailsError, setPaymentDetailsError] = useState<string>("");

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
        return "Complete RIB:";
      case "Western Union":
      case "Cash Plus":
        return "Your city:";
      case "Binance Pay":
      case "Payeer":
      case "Wise":
        return "Payment email:";
      case "ADV Cash":
        return "Account number:";
      case "TRC20":
        return "TRX address:";
      default:
        return "";
    }
  };

  const getPaymentDetailsPlaceholder = (method: string) => {
    switch (method) {
      case "CIH Bank":
      case "Attijariwafa Bank":
      case "Barid Bank":
        return "Enter your RIB";
      case "Western Union":
      case "Cash Plus":
        return "Enter your city";
      case "Binance Pay":
      case "Payeer":
      case "Wise":
        return "Enter payment email";
      case "ADV Cash":
        return "Enter account number";
      case "TRC20":
        return "Enter TRX address";
      default:
        return "";
    }
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const total = Number(
      ((amount * server.serverPriceDh) / devise.curencyVal).toFixed(2)
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
      !formData.paymentDetails
    ) {
      if (!formData.gameName) {
        setGameNameError("In-game name is required");
      } else {
        setGameNameError("");
      }

      if (!formData.amount) {
        setAmountError("Amount is required");
      } else {
        setAmountError("");
      }

      if (!formData.paymentMethod) {
        setPaymentMethodError("Payment method is required");
      } else {
        setPaymentMethodError("");
      }

      if (!formData.paymentDetails) {
        setPaymentDetailsError("This field is required");
      } else {
        setPaymentDetailsError("");
      }
    } else {
      const data = {
        userId: "63c52df8f1adcc81fad062b3",
        numBuy: codeGenerated(),
        jeu: server?.serverCategory,
        server: server?.serverName,
        pu: unitPrice,
        qte: qty,
        totalPrice: calculateTotal().total + calculateTotal().bonus,
        paymentMethod: formData.paymentMethod,
        gameName: formData.gameName,
        paymentInfoDetails: paymentInfoDetails,
        comments: formData.comments,
        email: "mamadousy1254@gmail.com",
        currencymethod: devise.currencyName,
      };

      try {
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_IBYTRADE_CLIENT_URL}/buy`,
          data
        );
        if (response) {
          toast.success(
            "Order successfully placed. Open the chat to proceed with the exchange",
            {
              style: { color: "#16a34a" },
            }
          );
        }
      } catch (error) {
        console.log(error);
        toast.success("Something went wrong, please try again later", {
          style: { color: "#dc2626" },
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-amber-500 hover:bg-amber-600 text-white border-none hover:text-white"
          disabled={serverStatus === "Stock complet"}
        >
          Sell Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[calc(100vh-60px)] h-full overflow-y-scroll scroll-thumb">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900">
            {`Sell Kamas on ${server.serverName}`}
          </DialogTitle>
          <DialogDescription>
            Please fill in your details to proceed with the sale.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gameName">In-game name</Label>
              <Input
                id="gameName"
                placeholder="Enter your game name"
                value={formData.gameName}
                onChange={(e) => handleInputChange("gameName", e.target.value)}
                className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {gameNameError && (
                <span className="text-sm text-red-500">{gameNameError}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Quantity of kamas (M)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
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
            <Label htmlFor="paymentMethod">Payment method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleInputChange("paymentMethod", value)
              }
            >
              <SelectTrigger className="outline-none focus:outline-none focus:ring-0">
                <SelectValue placeholder="Select payment method" />
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
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              placeholder="Add any additional comments"
              value={formData.comments}
              onChange={(e) => handleInputChange("comments", e.target.value)}
              className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="bg-amber-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Price per million:</span>
              <span className="font-semibold text-amber-700">
                {(server.serverPriceDh / devise.curencyVal).toFixed(2)}{" "}
                {parsedDevise(devise.currencyName)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total:</span>
              <span className="font-semibold text-amber-700">
                {calculateTotal().total} {parsedDevise(devise.currencyName)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-700">
              <Gift className="h-4 w-4" />
              <span>
                {`Bonus ${(50 / devise.curencyVal).toFixed(2)}${parsedDevise(
                  devise.currencyName
                )} (orders over ${(3000 / devise.curencyVal).toFixed(
                  2
                )}${parsedDevise(devise.currencyName)})`}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <Loader className="animate-spin" size={24} />
                Order in progress...
              </span>
            ) : (
              "Place Order"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SellKamasDialog;
