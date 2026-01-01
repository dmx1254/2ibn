import { NextResponse } from "next/server";

import { goapiModels } from "@/lib/models/ibytrade-models";

export async function GET() {
  try {
    const { MadModel } = await goapiModels;
    const mad = await MadModel.find();
    return NextResponse.json(mad, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}