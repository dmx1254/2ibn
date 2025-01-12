"use client";

import React, { ChangeEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { useScopedI18n } from "@/locales/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ResetPasswordModal from "./ResetPasswordModal";

const SignInModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const tScope2 = useScopedI18n("modal");
  const router = useRouter();
  const tScope = useScopedI18n("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmaiError] = useState("");
  const [banError, setBanError] = useState("");
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
        if (response?.error?.includes("Utilisateur banni")) {
          setBanError(tScope("passwordError"));
        } else {
          setBanError("");
        }
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-white">{tScope2("signin")}</button>
      </DialogTrigger>
      <DialogContent showIcon={true} className="bg-gray-200 rounded-2xl p-0">
        <DialogHeader className="relative inline-flex items-start justify-start font-semibold mt-2 ml-6 ident">
          {tScope("modal.title")}
        </DialogHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-black">
                {tScope("mail")}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="dofus@example.com"
                  required
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className="pl-10 h-12 bg-transparent text-black border-gray-400 hover:border-gray-300 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              {emailError && (
                <span className="text-sm text-red-600">{emailError}</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-black"
                >
                  {tScope("password")}
                </Label>
                <ResetPasswordModal />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  placeholder={tScope("passwordPlaceholder")}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  className="pl-10 h-12 bg-transparent text-black border-gray-400 hover:border-gray-300 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              {passwordError && (
                <span className="text-sm text-red-600">{passwordError}</span>
              )}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-12 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
            aria-label="Submit login button"
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
          </Button>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
