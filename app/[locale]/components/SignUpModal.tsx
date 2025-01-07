"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import SignUpForm from "./signup-form";
import { useScopedI18n } from "@/locales/client";

const SignUpModal = () => {
    const tScope = useScopedI18n("modal");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-white">{tScope("signup")}</button>
      </DialogTrigger>
      <DialogContent
        showIcon={false}
        isDialog={true}
        className="font-poppins w-full max-w-[450px] rounded-none p-0 bg-white shadow-xl border-none signin-bgurl"
      >
        <SignUpForm />
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
