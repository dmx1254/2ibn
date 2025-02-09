import { NextResponse } from "next/server";

// import { ExchangeModel } from "@/lib/models/ibytrade-models";
// import { connectDB } from "@/lib/db";
import { goapiModels } from "@/lib/models/ibytrade-models";

export async function POST(req: Request) {
  try {
    const { RateModel } = await goapiModels;
    const rate = await RateModel.find();
    return NextResponse.json(rate, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
