"use client";

import React, { useState, ChangeEvent } from "react";
import { ArrowRight, Mail, Lock } from "lucide-react";

import { useScopedI18n } from "@/locales/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const LoginForm = () => {
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
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-xl bg-white/20 border-white/20">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl text-white/80 font-bold tracking-tight text-center">
            {tScope("title")}
          </CardTitle>
          <CardDescription className="text-center text-white/80">
            {tScope("desc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-white/80"
              >
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
                  className="pl-10 h-12 bg-transparent text-white/80 border-gray-400 hover:border-gray-300 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                  className="text-sm font-medium text-white/80"
                >
                  {tScope("password")}
                </Label>
                <Link
                  href="/resetpassword"
                  className="text-sm text-yellow-600 hover:text-yellow-700 hover:underline transition-colors"
                >
                  {tScope("forgopassword")}
                </Link>
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
                  className="pl-10 h-12 bg-transparent text-white/80 border-gray-400 hover:border-gray-300 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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

          <div className="relative">
            {/* <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div> */}
            <div className="relative flex items-center justify-center text-sm">
              <span className="border-t border-white/10 w-1/5" />
              <span className="px-2  text-white/80 w-3/5">
                {tScope("bottomDesc")}
              </span>
              <span className="border-t border-white/10 w-1/5" />
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 bg-white/20 text-white/80 border-white/20 hover:border-gray-300 hover:bg-gray-50 font-medium transition-colors"
            asChild
            aria-label="go to signup"
          >
            <Link href="/signup">{tScope("bottomSignup")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
