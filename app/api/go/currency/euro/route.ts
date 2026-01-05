import { NextResponse } from "next/server";

import { goapiModels } from "@/lib/models/ibytrade-models";

export async function POST(req: Request) {
  const data = await req.json();
  const { currency } = data;
  try {
    const { EuroModel } = await goapiModels;
    const euro = await EuroModel.find();
    return NextResponse.json(euro, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
