import { ibenModels } from "@/lib/models/ibendouma-models";
import { parsedDeviseNowPayment } from "@/lib/utils";
import axios from "axios";
import { NextResponse } from "next/server";

const getAcceToken = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await axios.post(
      `${process.env.NOWPAYMENT_BASEURL}v1/auth`,
      {
        email: process.env.NOWPAYMENT_EMAIL,
        password: process.env.NOWPAYMENT_PASSWORD,
      },
      config
    );

    return response.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

export async function GET(req: Request) {
  //   try {
  //     const url = new URL(req.url);
  //     console.log(url);

  //     const data = await getAcceToken();
  //     return NextResponse.json(data, { status: 200 });
  //   } catch (error) {
  //     console.log(error);
  //     return NextResponse.json(error, { status: 500 });

  try {
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", process.env.NOWPAYMENT_API_KEY!);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      price_amount: 1000,
      price_currency: "usd",
      order_id: "RGDBP-21314",
      order_description: "Apple Macbook Pro 2019 x 1",
      ipn_callback_url: "https://nowpayments.io",
      success_url: "https://nowpayments.io",
      cancel_url: "https://nowpayments.io",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      "https://api.nowpayments.io/v1/invoice",
      requestOptions as any
    );
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(req: Request) {
  //   try {
  //     const url = new URL(req.url);
  //     console.log(url);

  //     const data = await getAcceToken();
  //     return NextResponse.json(data, { status: 200 });
  //   } catch (error) {
  //     console.log(error);
  //     return NextResponse.json(error, { status: 500 });
  const { OrderModelIben } = await ibenModels;

  try {
    const { data: order, object } = await req.json();
    // console.log(order);
    const type = order.type;
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", process.env.NOWPAYMENT_API_KEY!);
    myHeaders.append("Content-Type", "application/json");

    const price = Number(order.totalPrice);

    const raw = JSON.stringify({
      price_amount: price,
      price_currency: parsedDeviseNowPayment(order.cur),
      order_id: `${order.orderNum}_${type}`,
      order_description: "Service gaming",
      ipn_callback_url: `${process.env.BASE_URL}/api/nowpayment/webhook/success`,
      success_url: `${process.env.BASE_URL}/order-success?orderId=${order.orderNum}&type=${type}`,
      cancel_url: `${process.env.BASE_URL}/checkout?orderId=${order.orderNum}&type=${type}`,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      `${process.env.NOWPAYMENT_BASEURL}v1/invoice`,
      requestOptions as any
    );
    const data = await response.json();
    await OrderModelIben.create(order);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
