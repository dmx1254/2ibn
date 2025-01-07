"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import LoginForm from "./login-form";
import { useScopedI18n } from "@/locales/client";

const SignInModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const tScope = useScopedI18n("modal");
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-white">{tScope("signin")}</button>
      </DialogTrigger>
      <DialogContent
        showIcon={false}
        isDialog={true}
        className="font-poppins w-full max-w-[450px] rounded-none p-0 bg-white shadow-xl border-none signin-bgurl"
      >
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
