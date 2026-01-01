import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { PromotionModel } = await ibenModels;
    const promotion = await PromotionModel.find({}).limit(1).lean();

    let promotionValue: number = 2;
    if (promotion[0].message && promotion[0].promotion) {
      const match = promotion[0].message.match(/[\d.,]+/);
      if (match) {
        promotionValue = parseFloat(match[0]);
      }
    }
    return NextResponse.json({ promotion: promotionValue }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
