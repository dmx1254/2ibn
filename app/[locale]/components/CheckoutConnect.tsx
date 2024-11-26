"use client";

import React, { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";

const CheckoutConnect = ({
  onContinue,
  isNewAccount,
  setIsNewAccount,
  setActiveStep,
  cartControl,
}: {
  onContinue: () => void;
  isNewAccount: boolean;
  setIsNewAccount: (type: boolean) => void;
  setActiveStep: (step: string) => void;
  cartControl: number;
}) => {
  const router = useRouter();
  const tScope = useScopedI18n("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmaiError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!response?.ok) {
        if (response?.error?.includes("Adresse E-mail incorrect")) {
          setEmaiError(tScope("emailError"));
        } else {
          setEmaiError("");
        }
        if (response?.error?.includes("Mot de passe incorrect")) {
          setPasswordError(tScope("passwordError"));
        } else {
          setPasswordError("");
        }
      } else {
        router.refresh();
        setActiveStep("facturation");
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full max-sm:flex-col flex items-start justify-between gap-8">
      <div className="w-full flex flex-col items-start gap-4">
        <h2 className="w-full border-b border-dashed pb-2 text-base">
          {tScope("newClient")}
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="newAccount"
            checked={isNewAccount}
            readOnly
            id="newAccount"
            className="accent-blue-500"
          />
          <span className="text-base">{tScope("createNewAc")}</span>
        </div>
        <p className="w-full text-justify text-base">
          {tScope("createAccountDesc")}
        </p>
        <button
          onClick={onContinue}
          className="bg-yellow-600 text-white text-base px-6 py-2 rounded hover:bg-yellow-700 transition-colors"
          disabled={cartControl < 1}
          style={{
            opacity: cartControl < 1 ? 0.6 : 1,
          }}
        >
          {tScope("continue")}
        </button>
      </div>
      <div className="w-full">
        <h2 className="w-full border-b border-dashed pb-2 text-base">
          {tScope("alreadyClient")}
        </h2>
        <div className="w-full flex flex-col items-start gap-4 mt-4">
          <div className="w-full">
            <Label className="block text-base font-medium">
              {tScope("mail")}
            </Label>
            <Input
              type={tScope("mail")}
              className="mt-1 block w-full text-base rounded border-gray-300 shadow-sm p-2 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            {emailError && (
              <span className="text-xs text-red-600">{emailError}</span>
            )}
          </div>
          <div className="w-full">
            <Label className="block text-base font-medium">
              {tScope("password")}
            </Label>
            <Input
              type="password"
              className="mt-1 block w-full text-base rounded border-gray-300 shadow-sm p-2 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder={tScope("passwordPlaceholder")}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            {passwordError && (
              <span className="text-xs text-red-600">{passwordError}</span>
            )}
          </div>
          <button
            disabled={!email || !password}
            onClick={handleSubmit}
            className="bg-yellow-600 text-white text-base px-6 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                <span>{tScope("btnloginLoader")}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>{tScope("btnlogin")}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConnect;
