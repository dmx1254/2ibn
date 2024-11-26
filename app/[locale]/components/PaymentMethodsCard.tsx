import React from "react";
import { CreditCard, Banknote, Wallet, Bitcoin, BadgeCent } from "lucide-react";
import { Card } from "./ui/card";
import { useScopedI18n } from "@/locales/client";

interface Card {
  code: string;
  expirationDate: string;
}

interface UserPaymentMethodResponse {
  _id: string;
  UserId: string;
  method: string;
  rib?: string;
  email?: string;
  trc20Address?: string;
  cardInfo?: Card;
}

const PaymentMethodsCard: React.FC<{
  methods: UserPaymentMethodResponse[];
}> = ({ methods }) => {
  const tScope = useScopedI18n("paymentMethod");
  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "carte_bancaire":
        return <CreditCard className="text-blue-500" />;
      case "cih":
      case "bmce":
      case "attijariwafa-bank":
        return <Banknote className="text-green-500" />;
      case "paypal":
        return <Wallet className="text-indigo-500" />;
      case "trc20":
        return <BadgeCent className="text-orange-500" />;
      default:
        return <Wallet className="text-gray-500" />;
    }
  };

  const maskCardNumber = (code?: string) => {
    if (!code) return "";
    return code.slice(0, 4) + " **** **** " + code.slice(-4);
  };

  return (
    <div className="w-full flex flex-col items-start shadow-lg rounded-2xl p-6 mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {tScope("profilebankTitle")}
      </h2>
      {methods.length === 0 ? (
        <p className="text-center text-gray-500">
          {tScope("profilebankNotFound")}
        </p>
      ) : (
        <div className="space-y-4">
          {methods.map((method) => (
            <div
              key={method._id}
              className="flex items-center bg-gray-100 p-4 rounded-xl hover:shadow-md transition-all duration-300"
            >
              <div className="mr-4">{getMethodIcon(method.method)}</div>
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-700">
                  {method.method === "carte_bancaire"
                    ? tScope("bankCardTitle")
                    : method.method}
                </h3>
                {method.cardInfo && (
                  <p className="text-sm text-gray-500">
                    {maskCardNumber(method.cardInfo.code)}
                    <span className="ml-2 text-xs text-gray-400">
                      {tScope("profileBankExpire")}:{" "}
                      {method.cardInfo.expirationDate}
                    </span>
                  </p>
                )}
                {method.email && (
                  <p className="text-sm text-gray-500">{method.email}</p>
                )}
                {method.rib && (
                  <p className="text-sm text-gray-500">RIB: {method.rib}</p>
                )}
                {method.trc20Address && (
                  <p className="text-sm text-gray-500 truncate">
                    {tScope("profileBankCrypto")}: {method.trc20Address}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsCard;
