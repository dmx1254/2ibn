import { NextResponse } from "next/server";

// import { DollarModelIben } from "@/lib/models/ibendouma-models";
import { connectDB } from "@/lib/db";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function GET() {
  try {
    const { DollarModelIben } = await ibenModels;
    const dollar = await DollarModelIben.find();
    return NextResponse.json(dollar, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
