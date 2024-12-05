"use client";

import React, { FormEvent, useState } from "react";
import useStore from "@/lib/store-manage";

import { KeyRound, ArrowRight, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";

const ResetPasswordPage = () => {
  const tScope = useScopedI18n("resetPaasowrdLink");
  const tScopeLink = useScopedI18n("resetlinktemplate");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      setEmailError("The email format is invalid");
    } else {
      setError("");
      setEmailError("");
      try {
        setIsLoading(true);

        await axios
          .post("/api/iben/user/resetpasswordLink", {
            email: email,
            object: tScopeLink("object"),
          })
          .then((response) => {
            if (response.data.successMessage) {
              //   console.log(response);
              setIsSuccess(true);
            }
          });
      } catch (error: any) {
        if (error?.response?.data?.errorMessage) {
          toast.error(tScope("errorServerMessage"), {
            style: { color: "#dc2626" },
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white/20 border-white/20">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/10 rounded-full">
              <KeyRound className="w-6 h-6 text-white/50" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white/80 text-center">
            {tScope("title")}
          </CardTitle>
          <CardDescription className="text-center text-white/80">
            {tScope("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-600">
                {tScope("successMessage")}
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                  <Input
                    type="email"
                    placeholder={tScope("placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 outline-none bg-transparent text-white/80 border-white/80 placeholder:text-white/60 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                  {!emailError && (
                    <span className="text-sm text-red-600">{emailError}</span>
                  )}
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email}
                aria-label="confirm reset password email"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {tScope("btn")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-white/80"
            onClick={() => window.history.back()}
            aria-label="return to the previous page"
          >
            {tScope("btnBack")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
