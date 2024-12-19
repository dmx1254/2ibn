import { NextResponse } from "next/server";

import { ConfirmEmailTemplate } from "@/app/[locale]/components/confirm-template";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, lastname, firstname, object } = await request.json();
    const { data, error } = await resend.emails.send({
      from: "2IBN Support <support@2ibn.com>",
      to: [email],
      subject: object,
      react: ConfirmEmailTemplate({
        lastname: lastname,
        firstname: firstname,
      }),
    });
    if (error) {
      return NextResponse.json(error, { status: 500 });
    }

    return NextResponse.json(
      { message: "Code de vérification envoyé avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
