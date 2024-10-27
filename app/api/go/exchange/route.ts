import { NextResponse } from "next/server";

// import { ExchangeModel } from "@/lib/models/ibytrade-models";
// import { connectDB } from "@/lib/db";
import { goapiModels } from "@/lib/models/ibytrade-models";

export async function GET() {
  try {
    const { ExchangeModel } = await goapiModels;
    const exchanges = await ExchangeModel.find();
    return NextResponse.json(exchanges, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { ExchangeModel } = await goapiModels;
    const data = await request.json();
    const newExchange = await ExchangeModel.create(data);
    return NextResponse.json(newExchange, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
