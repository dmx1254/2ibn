import { NextResponse } from "next/server";

// import { ServerModel } from "@/lib/models/ibytrade-models";
// import { connectDB } from "@/lib/db";
import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextApiResponse } from "next";

export async function GET( res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const { ServerModel } = await goapiModels;
    const servers = await ServerModel.find();
    return NextResponse.json(servers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
