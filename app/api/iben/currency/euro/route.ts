import { NextResponse } from "next/server";

// import { EuroModelIben } from "@/lib/models/ibendouma-models";
// import { connectDB } from "@/lib/db";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function GET() {
  try {
    const { EuroModelIben } = await ibenModels;
    const euro = await EuroModelIben.find();
    return NextResponse.json(euro, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
