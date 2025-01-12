"use client";

import React, { FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useScopedI18n } from "@/locales/client";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ResetPasswordModal = () => {
  const tScopeReset = useScopedI18n("login");
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-sm text-yellow-600 hover:text-yellow-700 hover:underline transition-colors">
          {tScopeReset("forgopassword")}
        </button>
      </DialogTrigger>
      <DialogContent showIcon={true} className="bg-gray-200 rounded-2xl p-0">
        <Card className="w-full max-w-md bg-gray-200 border-gray-300 mt-2">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/10 rounded-full">
                <KeyRound className="w-6 h-6 text-black/65" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-black/65 text-center">
              {tScope("title")}
            </CardTitle>
            <CardDescription className="text-center text-black/65">
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
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-black/65" />
                    <Input
                      type="email"
                      placeholder={tScope("placeholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 outline-none bg-transparent text-black/65 border-gray-400 placeholder:text-black/60 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;
