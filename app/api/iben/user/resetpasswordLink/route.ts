import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { PasswordResetEmail } from "@/app/[locale]/components/resetlink-template";

import { Resend } from "resend";
import { ibenModels } from "@/lib/models/ibendouma-models";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

export async function POST(request: Request) {
  const { UserIbenModel } = await ibenModels;
  try {
    const { email } = await request.json();
    // const req = request
    const allUrl = new URL(request.url);
    const url = allUrl.origin;
    const user = await UserIbenModel.findOne({ email: email });
    if (!user)
      return NextResponse.json(
        { errorMessage: "User does not exist" },
        { status: 500 }
      );

    const token = await jwt.sign(
      { userId: user._id },
      process.env.TOKEN_SECRET!,
      {
        expiresIn: "30m",
      }
    );

    const resetLink = `${url}/reset-password?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: "2IBN Verification <verification@2ibn.com>",
      to: [email],
      subject: "Votre code de vérification - 2IBN",
      react: PasswordResetEmail({
        resetLink: resetLink,
      }),
    });
    if (error) {
      return NextResponse.json(error, { status: 500 });
    }
    return NextResponse.json(
      {
        successMessage:
          "If an account exists with this email, you will receive a resetlink.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
