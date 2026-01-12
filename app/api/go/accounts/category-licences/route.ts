import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { AccountModel } = await goapiModels;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { error: "Category parameter is required" },
        { status: 400 }
      );
    }

    const licences = await AccountModel.find({
      category: category,
    })
      .select("licence -_id")
      .lean();

    const uniquesLicence = licences.reduce(
      (acc: { [key: string]: number }, l: { licence: string }) => {
        acc[l.licence] = (acc[l.licence] || 0) + 1;
        return acc;
      },
      {}
    );

    const newLicences = Object.entries(uniquesLicence).map(
      ([licence, count]) => ({
        licence,
        count,
      })
    );

    return NextResponse.json(newLicences, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
