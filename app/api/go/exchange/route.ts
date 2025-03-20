import { NextResponse } from "next/server";

import { Resend } from "resend";
import { goapiModels } from "@/lib/models/ibytrade-models";
import { NewOrderConfirmationTemplate } from "@/app/[locale]/components/neworder-template";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);
export async function GET() {
  try {
    const { ExchangeModel } = await goapiModels;
    const exchanges = await ExchangeModel.find();
    return NextResponse.json(exchanges, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { ExchangeModel } = await goapiModels;
    const data = await request.json();
    const {codeToExchange } = data;
    const newExchange = await ExchangeModel.create(data);

     await resend.emails.send({
      from: "Ibendouma Notification <noreply@ibendouma.com>",
      to: ["support@ibendouma.com"],
      subject: "Notification d'échange de ibendouma",
      react: NewOrderConfirmationTemplate({
        orderNum: codeToExchange,
        dateCreated: new Date(),
        type: "Échange",
      }),
    });
    return NextResponse.json(newExchange, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
