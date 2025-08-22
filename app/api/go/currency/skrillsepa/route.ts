import { NextResponse } from "next/server";

import { goapiModels } from "@/lib/models/ibytrade-models";

export async function POST(req: Request) {
  try {
    const { SkrillSepaModel } = await goapiModels;
    const skrillsepa = await SkrillSepaModel.find();
    return NextResponse.json(skrillsepa, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
