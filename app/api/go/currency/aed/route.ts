import { NextResponse } from "next/server";
import { goapiModels } from "@/lib/models/ibytrade-models";

export async function POST(req: Request) {
  const data = await req.json();
  const { currency } = data;
  try {
    const { AedModel } = await goapiModels;
    const aed = await AedModel.find();
    return NextResponse.json(aed, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
