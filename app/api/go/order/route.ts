import { NewOrderConfirmationTemplate } from "@/app/[locale]/components/neworder-template";
import { goapiModels } from "@/lib/models/ibytrade-models";
import { ibenModels } from "@/lib/models/ibendouma-models";
// import { BuyModel } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addOrderAchatToSheet } from "@/lib/orderSheets-exchange";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

export async function POST(request: Request) {
  try {
    const { BuyModel } = await goapiModels;
    const { UserIbenModel } = await ibenModels;
    const { data, contact } = await request.json();
    const { numBuy, userId } = data;

    const newContact = contact.split(",").join(" ");

    // Récupérer les informations de l'utilisateur
    const user = await UserIbenModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orderbuy = await BuyModel.create(data);

    // console.log(orderbuy);
    // console.log(user);

    const orderSheet = {
      code: "#" + orderbuy.numBuy,
      serveur: orderbuy.server,
      total: orderbuy.totalPrice + " " + orderbuy.currencymethod + "/" + orderbuy.qte,
      InfoPay: orderbuy.paymentInfoDetails,
      personnage: orderbuy.gameName,
      contact: newContact,
      status: orderbuy.status,
      idCommande: orderbuy._id.toString(),
    };

    await addOrderAchatToSheet(orderSheet);

    await resend.emails.send({
      from: "Ibendouma Notification <noreply@ibendouma.com>",
      to: ["support@ibendouma.com"],
      subject: "Notification de commande de ibendouma",
      react: NewOrderConfirmationTemplate({
        orderNum: numBuy,
        dateCreated: new Date(),
        type: "Commande de vente",
        billing: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
        },
        saleDetails: {
          numBuy: data.numBuy,
          jeu: data.jeu,
          server: data.server,
          pu: data.pu,
          qte: data.qte,
          cur: data.currencymethod,
          gameName: data.gameName,
          totalPrice: data.totalPrice,
          paymentMethod: data.paymentMethod,
          paymentDetails: data.paymentInfoDetails,
          lastname: user.lastname,
          firstname: user.firstname,
        },
      }),
    });
    return NextResponse.json(orderbuy, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
