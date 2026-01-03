import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { AccountModel } = await goapiModels;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const accounts = await AccountModel.find({
      $or: [
        { licence: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
