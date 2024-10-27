import { NextResponse } from "next/server";
// import { DollarModel} from "@/lib/models/ibytrade-models";
// import { connectDB } from "@/lib/db";
import { goapiModels } from "@/lib/models/ibytrade-models";

export async function GET() {
  try {
    const { DollarModel } = await goapiModels;
    const dollar = await DollarModel.find();
    return NextResponse.json(dollar, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
