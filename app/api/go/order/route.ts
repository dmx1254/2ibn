import { connectDB } from "@/lib/db";
import { goapiModels } from "@/lib/models/ibytrade-models";
// import { BuyModel } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { BuyModel } = await goapiModels;
    const data = await request.json();
    const orderbuy = await BuyModel.create(data);
    return NextResponse.json(orderbuy, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
