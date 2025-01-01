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
      const { data, error } = await resend.emails.send({
        from: "ibendouma Support <support@2ibn.com>",
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
      if (error) {
        return NextResponse.json(error, { status: 500 });
      }
    }

    // console.log(data, object);
    return NextResponse.json(newOrder, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
