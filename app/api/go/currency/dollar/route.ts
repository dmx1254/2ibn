import { NextResponse } from "next/server";
import { goapiModels } from "@/lib/models/ibytrade-models";

export async function POST(req: Request) {
  try {
    const { DollarModel } = await goapiModels;
    const dollar = await DollarModel.find();
    return NextResponse.json(dollar, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
