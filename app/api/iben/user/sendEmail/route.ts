import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

import { EmailTemplate } from "@/app/[locale]/components/email-template";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

export async function POST(request: Request) {
  const { CodeIbenModel } = await ibenModels;

  try {
    const { email, lastname, firstname, object } = await request.json();
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const { data, error } = await resend.emails.send({
      from: "Ibendouma Verification <verification@ibendouma.com>",
      to: [email],
      subject: object,
      react: EmailTemplate({
        email: email,
        verificationCode: verificationCode.toString(),
        lastname: lastname,
        firstname: firstname,
      }),
    });
    if (error) {
      return NextResponse.json(error, { status: 500 });
    }
    await CodeIbenModel.create({ code: verificationCode });
    return NextResponse.json(
      { message: "Code de vérification envoyé avec succès", data: data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
