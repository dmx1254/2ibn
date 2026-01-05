import { NextResponse } from "next/server";

import { goapiModels } from "@/lib/models/ibytrade-models";

export async function POST(req: Request) {
  const data = await req.json();
  const { currency } = data;
  try {
    const { SkrillSepaModel } = await goapiModels;
    const skrillsepa = await SkrillSepaModel.find();
    return NextResponse.json(skrillsepa, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
