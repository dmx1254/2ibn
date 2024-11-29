import React from "react";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignUpForm from "../../components/signup-form";

const page = async () => {
  const session = await getServerSession(options);
  if (session) redirect("/");
  return (
    <div className="w-full flex items-center justify-center min-h-screen p-4 signin-bgurl">
      <SignUpForm />
    </div>
  );
};

export default page;
