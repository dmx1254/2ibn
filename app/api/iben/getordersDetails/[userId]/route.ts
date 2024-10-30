import { ibenModels } from "@/lib/models/ibendouma-models";
import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { OrderModelIben } = await ibenModels;
  const { ExchangeModel, BuyModel } = await goapiModels;

  try {
    const { userId } = params;
    // console.log("userId: " + userId);
    const ordersBuysLength = await OrderModelIben.countDocuments({
      userId: userId,
    });
    const ordersSellLength = await BuyModel.countDocuments({
      userId: userId,
    });
    const exchangeLength = await ExchangeModel.countDocuments({
      userId: userId,
    });
    return NextResponse.json(
      {
        ordersBuysLength: ordersBuysLength,
        ordersSellLength: ordersSellLength,
        exchangeLength: exchangeLength,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
