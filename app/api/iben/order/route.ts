import { NewOrderConfirmationTemplate } from "@/app/[locale]/components/neworder-template";
import { OrderConfirmationTemplate } from "@/app/[locale]/components/orderConfirm-template";
import { addOrderVenteToSheet } from "@/lib/orderSheets-exchange";
import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

export async function POST(request: Request) {
  try {
    const { OrderModelIben, UserIbenModel } = await ibenModels;

    const { data, object } = await request.json();
    const user = await UserIbenModel.findById(data.userId);

    // console.log(data);

    const newOrder = await OrderModelIben.create(data);

    // console.log(newOrder);
    // console.log(user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    for (const product of newOrder.products) {
      const orderSheet = {
        code: "#" + newOrder.orderNum,
        serveur: product.server,
        total:
          product.price +
          "" +
          newOrder.cur +
          "/M" +
          "*" +
          product.amount +
          "M" +
          "=" +
          newOrder.totalPrice +
          "" +
          newOrder.cur,

        InfoPay: newOrder.paymentMethod,
        personnage: product.character,
        livraisondetails:
          newOrder.paymentMethod +
          " - email: " +
          user.email +
          " - phone: " +
          user.phone,
        etatCommande: newOrder.status,
        idCommande: newOrder._id.toString(),
      };
      await addOrderVenteToSheet(orderSheet);
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
          to: ["support@ibendouma.com"],
          subject: "Notification de commande de ibendouma",
          react: NewOrderConfirmationTemplate({
            orderNum: newOrder.orderNum,
            dateCreated: new Date(),
            type: "Commande d'achat",
            billing: {
              firstname: newOrder.billing.firstname,
              lastname: newOrder.billing.lastname,
              email: newOrder.billing.email || user?.email,
              phone: newOrder.billing.phone || user?.phone,
            },
            products: newOrder.products,
            totalPrice: newOrder.totalPrice,
            cur: newOrder.cur,
            buyDetails: {
              status: newOrder.status,
              paymentMethod: newOrder.paymentMethod,
            },
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
