"use client";

import React, { ChangeEvent, FormEvent, useEffect } from "react";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import NotFound from "./not-found";
import { useScopedI18n } from "@/locales/client";
import { useSession } from "next-auth/react";
const page = ({ searchParams }: { searchParams: { token: string } }) => {
  const tScope = useScopedI18n("resetPasswordPage");
  const token = searchParams.token;
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [errorMessageToken, setErrorMessageToken] = useState<string>("");
  const [userTokenId, setUserTokenId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showToastError = (name: string) =>
    toast.error(name, { style: { color: "#dc2626" }, duration: 20000 });

  useEffect(() => {
    const checkIsTokenValid = async () => {
      try {
        const { data } = await axios.post("/api/iben/user/checkToken", {
          token: token,
        });

        if (data) {
          setUserTokenId(data.userId);
        }
      } catch (error: any) {
        if (error?.response?.data?.name) {
          if (error?.response?.data?.name === "JsonWebTokenError") {
            showToastError(tScope("invalidTokenError"));
          } else if (error?.response?.data?.name === "TokenExpiredError") {
            showToastError(tScope("expiresTokenError"));
          } else {
            setErrorMessageToken("");
          }
        }
      }
    };

    if (token) {
      checkIsTokenValid();
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8 || password !== confirmPassword) {
      if (password.length < 8) {
        setPasswordError(tScope("passwordError"));
      } else {
        setPasswordError("");
      }

      if (password !== confirmPassword) {
        setConfirmPasswordError(tScope("confirmPasswordError"));
      } else {
        setConfirmPasswordError("");
      }
    } else {
      setPasswordError("");
      setConfirmPasswordError("");
      try {
        setIsLoading(true);
        await axios
          .post("/api/iben/user/changePassword", {
            userId: userTokenId,
            password: password,
          })
          .then((response) => {
            if (response.data.successMessage) {
              toast.success(tScope("successResetPassword"), {
                style: { color: "#22c55e" },
              });
              setIsLoading(false);
            }
          });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!token) return <NotFound />;

  return (
    <div className="flex min-h-screen items-center justify-center signin-bgurl">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white/20 p-6 shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-extrabold text-white/80">
            {tScope("title")}
          </h2>
          <p className="mt-2 text-sm text-white/80">{tScope("subtitle")}</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80"
            >
              {tScope("password")}
            </label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="block w-full bg-transparent text-white/80 border-white/20 placeholder:text-white/60 p-5 rounded-md fucus:ring-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm"
                placeholder={tScope("passwordPlace")}
                required
              />

              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="show password"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {passwordError && (
              <span className="text-sm text-red-600">{passwordError}</span>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white/80"
            >
              {tScope("confirmPassword")}
            </label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                className="block w-full bg-transparent text-white/80 border-white/20 placeholder:text-white/60 p-5 rounded-md fucus:ring-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm"
                placeholder={tScope("confirmPasswordPlace")}
                required
              />

              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="show password"
              >
                {showConfirmPassword ? (
                  <Eye className="h-5 w-5 text-white/60" />
                ) : (
                  <EyeOff className="h-5 w-5 text-white/60" />
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <span className="text-sm text-red-600">
                {confirmPasswordError}
              </span>
            )}
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-2 text-sm text-green-600" role="alert">
              {tScope("success")}
            </p>
          )}

          <Button
            aria-label="submit reset password"
            type="submit"
            className="w-full"
            disabled={!userTokenId}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex items-center justify-center text-white/80">
                <Lock className="mr-2 h-4 w-4" /> {tScope("btn")}
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default page;
