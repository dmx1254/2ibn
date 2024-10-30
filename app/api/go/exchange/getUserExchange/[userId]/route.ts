import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { ExchangeModel } = await goapiModels;
  try {
    const { userId } = params;
    // console.log("userId: " + userId);
    const exchanges = await ExchangeModel.find({ userId: userId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(exchanges, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
