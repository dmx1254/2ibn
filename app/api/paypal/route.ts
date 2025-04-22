import { ibenModels } from "@/lib/models/ibendouma-models";
import { returnFormatedPaypalCurrency } from "@/lib/utils";
import axios from "axios";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Configuration PayPal
const isProduction = process.env.NODE_ENV === "production";

const PAYPAL_CONFIG = {
  clientId: isProduction
    ? process.env.PAYPAL_LIVE_CLIENT_ID
    : process.env.PAYPAL_SANDBOX_CLIENT_ID,
  clientSecret: isProduction
    ? process.env.PAYPAL_LIVE_CLIENT_SECRET
    : process.env.PAYPAL_SANDBOX_CLIENT_SECRET,
  baseUrl: isProduction
    ? process.env.PAYPAL_LIVE_BASE_URL
    : process.env.PAYPAL_SANDBOX_BASE_URL,
};

// const PAYPAL_CONFIG = {
//   clientId: process.env.PAYPAL_LIVE_CLIENT_ID,
//   clientSecret: process.env.PAYPAL_LIVE_CLIENT_SECRET,
//   baseUrl: process.env.PAYPAL_LIVE_BASE_URL,
// };

// console.log(PAYPAL_CONFIG);

const getAcceToken = async () => {
  try {
    const auth = Buffer.from(
      PAYPAL_CONFIG.clientId + ":" + PAYPAL_CONFIG.clientSecret
    ).toString("base64");
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
    };
    const data = "grant_type=client_credentials";

    const response = await axios.post(
      `${PAYPAL_CONFIG.baseUrl}/v1/oauth2/token`,
      data,
      config
    );

    return response.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

// Vérification de la configuration
if (
  !PAYPAL_CONFIG.clientId ||
  !PAYPAL_CONFIG.clientSecret ||
  !PAYPAL_CONFIG.baseUrl
) {
  throw new Error("Configuration PayPal manquante"); 
}

export async function POST(req: NextRequest) {
  const { data: orderData, object } = await req.json();
  // console.log(orderData, object);
  const accessToken = await getAcceToken();

  const type = orderData.type;
  // console.log(accessToken);

  const { OrderModelIben, GameModel } = await ibenModels;

  try {
    const totalPrice = orderData.totalPrice;
    const currency = returnFormatedPaypalCurrency(orderData.cur);

    const productName =
      orderData.type === "game" ? orderData.name : "Dofus Items";
    const description =
      orderData.type === "game"
        ? `Service ${orderData.name}`
        : "Produits dofus";

    const data = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            value: totalPrice,
            currency_code: currency,
            breakdown: {
              item_total: {
                value: totalPrice,
                currency_code: currency,
              },
            },
          },
          items: [
            {
              name: productName,
              description,
              unit_amount: { currency_code: currency, value: totalPrice },
              quantity: "1",
            },
          ],
        },
      ],
      application_context: {
        return_url: `${process.env.BASE_URL}/order-success?orderId=${orderData.orderNum}&type=${type}`,
        cancel_url: `${process.env.BASE_URL}/order-failled?orderId=${orderData.orderNum}&type=${type}`,
      },
    };

    const createOrder = await axios.post(
      `${PAYPAL_CONFIG.baseUrl}/v2/checkout/orders`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const orderIdPaid = createOrder.data.id;
    const newOrder = {
      ...orderData,
      orderIdPaid: orderIdPaid,
    };

    if (type && type === "game") {
      await GameModel.create(newOrder);
    } else {
      await OrderModelIben.create(newOrder);
    }

    const approveLink = createOrder.data.links.find(
      (link: { rel: string; href: string }) => link.rel === "approve"
    );

    if (approveLink) {
      return NextResponse.json(
        {
          redirectUrl: approveLink.href,
        },
        { status: 200 }
      );
    }

    // return NextResponse.json(createOrder.data, { status: 200 });
    // console.log("----------------createOrder----------------");
    // console.log(createOrder.data);
  } catch (error) {
    NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la création de la commande PayPal",
        error: error,
      },
      { status: 500 }
    );

    console.log(error);
  }
}
