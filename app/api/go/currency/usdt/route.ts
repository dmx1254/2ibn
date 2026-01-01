import { NextResponse } from "next/server";

import { goapiModels } from "@/lib/models/ibytrade-models";

export async function GET() {
  try {
    const { UsdtModel } = await goapiModels;
    const usdt = await UsdtModel.find();
    return NextResponse.json(usdt, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
