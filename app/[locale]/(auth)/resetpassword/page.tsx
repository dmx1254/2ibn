import React from "react";
import ResetPasswordPage from "../../components/resetpassword-form";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/option";

const page = async () => {
  const session = await getServerSession(options);
  if (session) redirect("/");
  return (
    <div className="w-full flex items-center justify-center min-h-screen p-4 signin-bgurl">
      <ResetPasswordPage />
    </div>
  );
};

export default page;
