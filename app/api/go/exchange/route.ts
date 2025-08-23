import { NextResponse } from "next/server";

import { Resend } from "resend";
import { goapiModels } from "@/lib/models/ibytrade-models";
import { ibenModels } from "@/lib/models/ibendouma-models";
import { NewOrderConfirmationTemplate } from "@/app/[locale]/components/neworder-template";
import { addOrderToSheet } from "@/lib/orderSheets-exchange";
import { NotifyIlyasstemplate } from "@/app/[locale]/components/notifyilyasstemplate";

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

export async function POST(req: Request) {
  try {
    const { ExchangeModel } = await goapiModels;
    const { UserIbenModel } = await ibenModels;
    const data = await req.json();
    const time = new Date().toISOString();

    const newTime1 = time.split("T")[0];
    const newTime2 = time.split("T")[1];
    const newTime3 = newTime2.split(".")[0];
    const newTime = newTime1 + " " + newTime3;

    const { codeToExchange, userId } = data;

    // Récupérer les informations de l'utilisateur
    const user = await UserIbenModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newExchange = await ExchangeModel.create(data);
    // console.log(user);
    // console.log(newExchange);

    const order = {
      newTime: newTime,
      code: newExchange.codeToExchange,
      serveurARecevoir: newExchange.serverOut + "/" + newExchange.characterToPay,
      quantiteA: newExchange.qtyToPay,
      serveurADonner: newExchange.serverIn + "/" + newExchange.characterToReceive,
      quantiteB: newExchange.qtyToReceive,
      contact:
        user.email +
        "-" +
        user.phone +
        "-" +
        user.firstname +
        "-" +
        user.lastname,
      etatCommande: newExchange.status,
      idCommande: newExchange._id,
    };

    await addOrderToSheet(order);
    // console.log(addOrder);

    await resend.emails.send({
      from: "Ibendouma Notification <noreply@ibendouma.com>",
      to: ["support@ibendouma.com"],
      subject: "Notification d'échange de ibendouma",
      react: NewOrderConfirmationTemplate({
        orderNum: codeToExchange,
        dateCreated: new Date(),
        type: "Échange",
        billing: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
        },
        exchangeDetails: {
          userId: data.userId,
          serverOut: data.serverOut,
          serverIn: data.serverIn,
          codeToExchange: data.codeToExchange,
          characterToPay: data.characterToPay,
          characterToReceive: data.characterToReceive,
          qtyToPay: data.qtyToPay,
          qtyToReceive: data.qtyToReceive,
        },
      }),
    });

    await resend.emails.send({
      from: "Ibendouma Notification <noreply@ibendouma.com>",
      to: ["bendoumailyass@gmail.com"],
      subject: "Notification d'échange de ibendouma",
      react: NotifyIlyasstemplate({
        type: "Commande d'échange vers google sheet",
      }),
    });
    return NextResponse.json(newExchange, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
