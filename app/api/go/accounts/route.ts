import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { AccountModel } = await goapiModels;
    const  data  = await req.json();

    // console.log(data);

    if (!data) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }

    try {
      const account = await AccountModel.create(data);
      return NextResponse.json(account, { status: 200 });
    } catch (error) {
      return NextResponse.json(error, { status: 500 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { AccountModel } = await goapiModels;
    const { searchParams } = new URL(request.url);
    const licence = searchParams.get("licence");

    const query: Record<string, unknown> = {};
    if (licence) {
      // Convertir le slug en licence (remplacer les tirets par des espaces et capitaliser)
      const licenceName = licence
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      query.licence = { $regex: new RegExp(licenceName, "i") };
    }

    const accounts = await AccountModel.find(query);
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
