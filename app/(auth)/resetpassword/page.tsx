"use client";

import React, { useLayoutEffect } from "react";
import useStore from "@/lib/store-manage";
import { redirect } from "next/navigation";

const ResetPasswordPage = () => {
  const { user } = useStore();
  useLayoutEffect(() => {
    if (user) {
      redirect("/");
    }
  }, [user]);
  return <div>ResetPassword Page</div>;
};

export default ResetPasswordPage;
