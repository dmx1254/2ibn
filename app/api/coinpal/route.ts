import { NextResponse } from "next/server";
import coinpal from "coinpal-sdk";
import { returnFormatedPaypalCurrency } from "@/lib/utils";
import { ibenModels } from "@/lib/models/ibendouma-models";

coinpal
  .setMchId(process.env.COINPAL_MERCHANT_NUM!)
  .setApiKey(process.env.COINPAL_API_KEY!);

export async function POST(req: Request) {
  const { data: order, object } = await req.json();

  const { OrderModelIben, GameModel } = await ibenModels;
  // console.log(order);

  const type = order.type;

  try {
    const paymentInfo = {
      version: "2",
      requestId: order.orderNum,
      merchantNo: process.env.COINPAL_MERCHANT_NUM!,
      orderNo: order.orderNum,
      orderCurrencyType: "fiat",
      orderCurrency: returnFormatedPaypalCurrency(order.cur),
      orderAmount: Number(order.totalPrice),
      accessToken: process.env.COINPAL_ACCESS_TOKEN!,
      notifyURL: `${process.env.BASE_URL}/api/coinpal/webhook/success`,
      redirectURL: `${process.env.BASE_URL}/order-success?orderId=${order.orderNum}&type=${type}`,
      successUrl: `${process.env.BASE_URL}/order-success?orderId=${order.orderNum}&type=${type}`,
    };

    const result = await coinpal.createPayment(paymentInfo);

    //   console.log(result);

    if (result) {
      if (type && type === "game") {
        await GameModel.create(order);
      } else {
        await OrderModelIben.create(order);
      }
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
