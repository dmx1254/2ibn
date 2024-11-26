import { getServerSession } from "next-auth";
import LoginForm from "../../components/login-form";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const session = await getServerSession(options);
  if (session) redirect("/");

  return (
    <div className="flex items-center justify-center p-4 signin-bgurl">
      <LoginForm />;
    </div>
  );
};

export default SignInPage;
