"use client";

import { useLayoutEffect } from "react";
import LoginForm from "@/components/login-form";
import { redirect } from "next/navigation";
import useStore from "@/lib/store-manage";

const SignInPage = () => {
  const { user } = useStore();
  useLayoutEffect(() => {
    if (user) {
      redirect("/");
    }
  }, [user]);
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <LoginForm />;
    </div>
  );
};

export default SignInPage;
