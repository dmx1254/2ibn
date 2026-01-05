import { goapiModels } from "@/lib/models/ibytrade-models";
import { ibenModels } from "@/lib/models/ibendouma-models";
import { parsedDevise } from "@/lib/utils";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { NotifyIlyasstemplate } from "@/app/[locale]/components/notifyilyasstemplate";
import { addOrderMarketplaceToSheet } from "@/lib/orderSheets-exchange";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

export async function POST(req: Request) {
  try {
    const { OrderAccountModel } = await goapiModels;
    const { UserIbenModel } = await ibenModels;
    const data = await req.json();
    if (!data) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }

    // console.log(data);
    // return;

    const userId = data.userId;
    const user = await UserIbenModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newOrder = await OrderAccountModel.create(data);

    try {
      const time = new Date().toISOString();

      const newTime1 = time.split("T")[0];
      const newTime2 = time.split("T")[1];
      const newTime3 = newTime2.split(".")[0];
      const newTime = newTime1 + " " + newTime3;

      for (const product of newOrder.products) {
        const cur = parsedDevise(newOrder.cur);
        const orderSheet = {
          newTime: ` 
              #${newOrder.numOrder}
              [${newTime}]
              `,
          // code: "#" + newOrder.orderNum,
          type: "Marketplace",
          produit: product.description,
          qte: parseInt(product.qty),
          montant: Number(product.totalPrice) + cur,
          puV: product.price + cur,
          personnage: `produit: ${product.product} category: ${product.category}
          licence: ${product.licence} deliveryDelay: ${product.deliveryDelay}
          `,
          payment: newOrder.paymentMethod,
          etatCommande: "En attente",
          platform: "iBendouma",
          userInfo: `
                ${newOrder.billing.firstname} ${newOrder.billing.lastname}
                adresse: ${newOrder.billing.address}
                email: ${newOrder.billing.email}
                phone: ${newOrder.billing.phone}`,

          email: newOrder.billing.email,
        };
        // La vente ici correspond a l'achat sur le site
        await addOrderMarketplaceToSheet(orderSheet);
      }

      if (newOrder) {
        try {
          await resend.emails.send({
            from: "Ibendouma Notification <noreply@ibendouma.com>",
            to: ["bendoumailyass@gmail.com"],
            subject: "Notification de commande de vente de ibendouma",
            react: NotifyIlyasstemplate({
              type: "Commande de vente vers google sheet",
            }),
          });
        } catch (error) {
          console.log(error);
        } finally {
          return NextResponse.json(newOrder, { status: 200 });
        }
      }
      return NextResponse.json(newOrder, { status: 200 });
    } catch (error) {
      return NextResponse.json(error, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { OrderAccountModel } = await goapiModels;

    const order = await OrderAccountModel.find().sort({ createdAt: -1 });
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


// export async function DELETE() {
//   try {
//     const { OrderAccountModel } = await goapiModels;
//     await OrderAccountModel.deleteMany();
//     return NextResponse.json({ message: "Orders deleted successfully" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(error, { status: 500 });
//   }
// }
