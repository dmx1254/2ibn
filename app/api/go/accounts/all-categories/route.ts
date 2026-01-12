import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { AccountModel } = await goapiModels;

    const categories = await AccountModel.find().select("category -_id").lean();
    const uniquesCategories = categories.reduce(
      (acc: { [key: string]: number }, c: { category: string }) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      },
      {}
    );
    const newCategories = Object.entries(uniquesCategories).map(
      ([category, count]) => ({
        category,
        count,
      })
    );
    return NextResponse.json(newCategories, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
