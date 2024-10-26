"use client";

import React, { useState, ChangeEvent } from "react";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import useStore from "@/lib/store-manage";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const router = useRouter();
  const { addUser } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmaiError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_IBENDOUMA_CLIENT_URL}/users/login`,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.data.person) {
            addUser(response.data.person);
            router.push("/");
          }
        });
    } catch (error: any) {
      const emailErr = error?.response?.data?.emailError;
      const passwordErr = error?.response?.data?.passwordError;
      if (emailErr) {
        setEmaiError(emailErr);
      } else {
        setEmaiError("");
      }
      if (passwordErr) {
        setPasswordError(passwordErr);
      } else {
        setPasswordError("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const checkToken = async () => {
  //   try {
  //     await axios
  //       .get(`${process.env.NEXT_PUBLIC_IBENDOUMA_CLIENT_URL}/checkToken`, {
  //         withCredentials: true,
  //       })
  //       .then((response) => {
  //         console.log(response);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     console.log("error.response: " + error.response);
  //     console.log("error.status: " + error.status);
  //   }
  // };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl font-bold tracking-tight text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
           Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
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
                  className="pl-10 h-12 border-gray-200 hover:border-gray-300 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              {emailError && (
                <span className="text-sm text-red-600">{emailError}</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/resetpassword"
                  className="text-sm text-yellow-600 hover:text-yellow-700 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  className="pl-10 h-12 border-gray-200 hover:border-gray-300 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
          

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
              Don't have an account?
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium transition-colors"
            asChild
          >
            <Link href="/signup">Create an account?</Link>
          </Button>
        </CardContent>
        {/* <button
          onClick={checkToken}
          className="bg-yellow-600 text-white p-3 rounded"
        >
          checkToken
        </button> */}
      </Card>
    </div>
  );
};

export default LoginForm;
