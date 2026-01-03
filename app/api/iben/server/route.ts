import { NextResponse } from "next/server";

// import { ServerModelIben } from "@/lib/models/ibendouma-models";
// import { connectDB } from "@/lib/db";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function GET() {
  try {
    const { ServerModelIben } = await ibenModels;
    const servers = await ServerModelIben.find();
    // console.log(servers);
    return NextResponse.json(servers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { ServerModelIben } = await ibenModels;
    const data = await req.json();
    const server = await ServerModelIben.findOneAndUpdate({ serverName: data.serverName }, { $set: {serverCategory: "dofus-kamas"} }, { new: true });
    return NextResponse.json(server, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
