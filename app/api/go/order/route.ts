import { goapiModels } from "@/lib/models/ibytrade-models";
import { ibenModels } from "@/lib/models/ibendouma-models";
// import { BuyModel } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addOrderAchatToSheet } from "@/lib/orderSheets-exchange";
import { NotifyIlyasstemplate } from "@/app/[locale]/components/notifyilyasstemplate";
import { parsedDevise } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

export async function POST(request: Request) {
  try {
    const { BuyModel } = await goapiModels;
    const { UserIbenModel } = await ibenModels;
    const { data, contact } = await request.json();
    const { userId } = data;
    const time = new Date().toISOString();

    // console.log(data);
    const newTime1 = time.split("T")[0];
    const newTime2 = time.split("T")[1];
    const newTime3 = newTime2.split(".")[0];
    const newTime = newTime1 + " " + newTime3;

    const newContact = contact.split(",").join(" : ");

    // console.log(newContact);
    // console.log(data);
    // return;

    // Récupérer les informations de l'utilisateur
    const user = await UserIbenModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orderbuy = await BuyModel.create(data);

    const paymentMethod = data.paymentInfoDetails.split("<br/>")[0];
    const paymentValue = data.paymentInfoDetails.split("<br/>")[1];

    // console.log(orderbuy);
    // console.log(user);
    const cur = parsedDevise(orderbuy.currencymethod);

    const orderSheet = {
      newTime: ` 
        #${orderbuy.numBuy}
        [${newTime}]
        `,
      type: "Vente",
      produit: orderbuy.server,
      qte: orderbuy.qte,
      montant: orderbuy.totalPrice + cur,
      puA: orderbuy.pu + cur,
      personnage: orderbuy.gameName,
      infoPay: ` 
        ${paymentValue} 
        ${data.lastname}
        `,
      payment: paymentMethod,
      etatCommande: "En attente",
      platform: "iBendouma",
      methodContact: newContact,
      userInfo: `
          ${user.firstname} ${user.lastname}
          email: ${user.email}
          phone: ${user.phone}
        `,
      email: user.email,
    };

    // Les orders Ventes correspondent aux orders d'acahts sur le google sheet
    await addOrderAchatToSheet(orderSheet);

    await resend.emails.send({
      from: "Ibendouma Notification <noreply@ibendouma.com>",
      to: ["bendoumailyass@gmail.com"],
      subject: "Notification de commande de ibendouma",
      react: NotifyIlyasstemplate({
        type: "Commande d'achat vers google sheet",
      }),
    });

    return NextResponse.json(orderbuy, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
