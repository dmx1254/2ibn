import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { OrderAccountModel } = await goapiModels;
  try {
    const { userId } = params;
    const orders = await OrderAccountModel.find({ userId: userId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

