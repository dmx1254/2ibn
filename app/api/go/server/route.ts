import { NextResponse } from "next/server";

// import { ServerModel } from "@/lib/models/ibytrade-models";
// import { connectDB } from "@/lib/db";
import { goapiModels } from "@/lib/models/ibytrade-models";

export async function GET() {
  try {
    const { ServerModel } = await goapiModels;
    const servers = await ServerModel.find();
    return NextResponse.json(servers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
