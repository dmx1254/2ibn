import { NextResponse } from "next/server";

import { goapiModels } from "@/lib/models/ibytrade-models";

export async function POST(req: Request) {
  try {
    const { UsdtModel } = await goapiModels;
    const usdt = await UsdtModel.find();
    return NextResponse.json(usdt, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
