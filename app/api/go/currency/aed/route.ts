import { NextResponse } from "next/server";
import { goapiModels } from "@/lib/models/ibytrade-models";

export async function POST(req: Request) {
  try {
    const { AedModel } = await goapiModels;
    const aed = await AedModel.find();
    return NextResponse.json(aed, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
