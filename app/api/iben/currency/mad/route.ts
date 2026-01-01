import { NextResponse } from "next/server";

// import { MadModelIben } from "@/lib/models/ibendouma-models";
// import { connectDB } from "@/lib/db";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function GET() {
  try {
    const { MadModelIben } = await ibenModels;
    const mad = await MadModelIben.find();
    return NextResponse.json(mad, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
