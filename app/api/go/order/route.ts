import { NewOrderConfirmationTemplate } from "@/app/[locale]/components/neworder-template";
import { goapiModels } from "@/lib/models/ibytrade-models";
// import { BuyModel } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

export async function POST(request: Request) {
  try {
    const { BuyModel } = await goapiModels;
    const data = await request.json();
    const { numBuy } = data;
    const orderbuy = await BuyModel.create(data);
    await resend.emails.send({
      from: "Ibendouma Notification <noreply@ibendouma.com>",
      to: ["support@ibendouma.com"],
      subject: "Notification de commande de ibendouma",
      react: NewOrderConfirmationTemplate({
        orderNum: numBuy,
        dateCreated: new Date(),
        type: "Commande de vente",
      }),
    });
    return NextResponse.json(orderbuy, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
