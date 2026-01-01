import { OrderConfirmationTemplate } from "@/app/[locale]/components/orderConfirm-template";
import { addOrderVentesToSheet } from "@/lib/orderSheets-exchange";
import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

import { Resend } from "resend";
import { NotifyIlyasstemplate } from "@/app/[locale]/components/notifyilyasstemplate";
import { parsedDevise } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

export async function POST(req: Request) {
  try {
    const { OrderModelIben, UserIbenModel } = await ibenModels;

    const { data, object } = await req.json();
    const isInviteOrder = data.userId.includes("invitedOrder");
    const user = isInviteOrder
      ? null
      : await UserIbenModel.findById(data.userId);

    const time = new Date().toISOString();

    // console.log(data);
    const newTime1 = time.split("T")[0];
    const newTime2 = time.split("T")[1];
    const newTime3 = newTime2.split(".")[0];
    const newTime = newTime1 + " " + newTime3;
    // console.log(newTime);
    // console.log(data);

    const newOrder = await OrderModelIben.create(data);

    // console.log(newOrder);
    // console.log(user);

    if (!user && !isInviteOrder) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    for (const product of newOrder.products) {
      const cur = parsedDevise(newOrder.cur);
      const orderSheet = {
        newTime: ` 
        #${newOrder.orderNum}
        [${newTime}]
        `,
        // code: "#" + newOrder.orderNum,
        type: "Vente",
        produit: product.server,
        qte: parseInt(product.amount),
        montant: Number(product.totalPrice) + cur,
        puV: product.price + cur,
        personnage: product.character,
        payment: newOrder.paymentMethod,
        etatCommande: newOrder.status,
        platform: "iBendouma",
        userInfo: `
          ${newOrder.billing.firstname} ${newOrder.billing.lastname}
          adresse: ${newOrder.billing.address}
          email: ${newOrder.billing.email}
          phone: ${newOrder.billing.phone}`,

        email: newOrder.billing.email,
      };
      // La vente ici correspond a l'achat sur le site
      await addOrderVentesToSheet(orderSheet);
    }

    if (newOrder) {
      try {
        await resend.emails.send({
          from: "Ibendouma Support <support@ibendouma.com>",
          to: [newOrder.billing.email],
          subject: object,
          react: OrderConfirmationTemplate({
            orderNum: newOrder.orderNum,
            firstname: newOrder.billing.firstname,
            lastname: newOrder.billing.lastname,
            cur: newOrder.cur,
            totalPrice: newOrder.totalPrice,
            status: newOrder.status,
            paymentMethod: newOrder.paymentMethod,
            dateCreated: newOrder.createdAt,
            products: newOrder.products,
          }),
        });

        await resend.emails.send({
          from: "Ibendouma Notification <noreply@ibendouma.com>",
          to: ["bendoumailyass@gmail.com"],
          subject: "Notification de commande de vente de ibendouma",
          react: NotifyIlyasstemplate({
            type: "Commande de vente vers google sheet",
          }),
        });
      } catch (error: any) {
        console.log(error);
      } finally {
        return NextResponse.json(newOrder, { status: 200 });
      }
    }
    return NextResponse.json(newOrder, { status: 200 });

    // console.log(data, object);
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function GET() {
  try {
    const { OrderModelIben } = await ibenModels;
    const orders = await OrderModelIben.find();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { OrderModelIben } = await ibenModels;

    await OrderModelIben.deleteMany();
    return NextResponse.json(
      { message: "Orders deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting orders" },
      { status: 500 }
    );
  }
}
