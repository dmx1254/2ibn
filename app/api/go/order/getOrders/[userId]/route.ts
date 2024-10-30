import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { BuyModel } = await goapiModels;
  try {
    const { userId } = params;
    // console.log("userId: " + userId);
    const orders = await BuyModel.find({ userId: userId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
