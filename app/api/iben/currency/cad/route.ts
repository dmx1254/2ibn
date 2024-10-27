import { NextResponse } from "next/server";

// import { CadModelIben } from "@/lib/models/ibendouma-models";
// import { connectDB } from "@/lib/db";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function GET() {
  try {
    // await connectDB();
    const { CadModelIben } = await ibenModels;

    const cad = await CadModelIben.find();
    return NextResponse.json(cad, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
