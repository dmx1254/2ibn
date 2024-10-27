import { NextResponse } from "next/server";

// import { EuroModel } from "@/lib/models/ibytrade-models";
// import { connectDB } from "@/lib/db";
import { goapiModels } from "@/lib/models/ibytrade-models";

export async function GET() {
  try {
    const { EuroModel } = await goapiModels;
    const euro = await EuroModel.find();
    return NextResponse.json(euro, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
