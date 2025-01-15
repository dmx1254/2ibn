import { OrderConfirmationTemplate } from "@/app/[locale]/components/orderConfirm-template";
import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

export async function POST(request: Request) {
  try {
    const { OrderModelIben } = await ibenModels;
    const { data, object } = await request.json();
    const newOrder = await OrderModelIben.create(data);

    if (newOrder) {
      try {
        const { data, error } = await resend.emails.send({
          from: "Ibendouma Support <support@ibendouma.com>",
          to: [newOrder.billing.email],
          subject: object,
          react: OrderConfirmationTemplate({
            orderNum: newOrder.orderNum,
            firstname: newOrder.billing.firstname,
            lastname: newOrder.billing.lastname,
            cur: newOrder.cur,
            totalPrice: newOrder.totalPrice,
            dateCreated: newOrder.createdAt,
            products: newOrder.products,
          }),
        });
      } catch (error: any) {
        console.log(error);
      } finally {
        return NextResponse.json(newOrder, { status: 200 });
      }
    }

    // console.log(data, object);
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
