import { NextResponse } from "next/server";

import { Resend } from "resend";
import { goapiModels } from "@/lib/models/ibytrade-models";
import { ibenModels } from "@/lib/models/ibendouma-models";
import { addOrderExchangeToSheet } from "@/lib/orderSheets-exchange";
import { NotifyIlyasstemplate } from "@/app/[locale]/components/notifyilyasstemplate";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);
export async function GET() {
  try {
    const { ExchangeModel } = await goapiModels;
    const exchanges = await ExchangeModel.find();
    return NextResponse.json(exchanges, { status: 200 });
  } catch (error) {
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

    const { userId } = data;

    // console.log(data);
    // console.log(newTime);
    // return;

    // Récupérer les informations de l'utilisateur
    const user = await UserIbenModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newExchange = await ExchangeModel.create(data);
    // console.log(user);
    // console.log(newExchange);

    const order = {
      newTime: ` 
        #${newExchange.numExchange}
        [${newTime}]
        `,
      type: "Echange",
      produit: newExchange.serverOut,
      qtyToPay: newExchange.qtyToPay,
      montant: newExchange.qtyToReceive,
      puV: data.puV + "MAD",
      personnage: `Personnage à payer: ${newExchange.characterToPay}
       Personnage à recevoir: ${newExchange.characterToReceive}  Code d'échange: ${newExchange.codeToExchange}
        `,
      payment: newExchange.serverIn,
      statutPayment: "En attente",
      platform: "iBendouma",
      userInfo: `
          ${user.firstname} ${user.lastname}
          email: ${user.email}
          phone: ${user.phone}
        `,
      email: user.email,
    };

    await addOrderExchangeToSheet(order);

    await resend.emails.send({
      from: "Ibendouma Notification <noreply@ibendouma.com>",
      to: ["bendoumailyass@gmail.com"],
      subject: "Notification d'échange de ibendouma",
      react: NotifyIlyasstemplate({
        type: "Commande d'échange vers google sheet",
      }),
    });
    return NextResponse.json(newExchange, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { ExchangeModel } = await goapiModels;

    await ExchangeModel.deleteMany();
    return NextResponse.json(
      { message: "Exchange deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
