import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  try {
    const { MaintingModel, PromotionModel, UpdateModel } = await ibenModels;
    const mainting = await MaintingModel.find({}).limit(1).lean();
    const promotion = await PromotionModel.find({}).limit(1).lean();
    const update = await UpdateModel.find({}).limit(1).lean();
    const data = await req.json();
    // console.log(data);
    // return;

    let processed = false;

    if (data.row === 5 && data.column === 2 && mainting[0]) {
      const isUpadtedBool = data.rowData.row2;
      await MaintingModel.findByIdAndUpdate(
        mainting[0]._id,
        { message: data.rowData.row1, mainting: isUpadtedBool },
        { new: true }
      );
      await PromotionModel.findByIdAndUpdate(
        promotion[0]._id,
        { promotion: false },
        { new: true }
      );
      await UpdateModel.findByIdAndUpdate(
        update[0]._id,
        { update: false },
        { new: true }
      );
      processed = true;
    }

    if (data.row === 8 && data.column === 2 && promotion[0]) {
      const isUpadtedBool = data.rowData.row2;
      await PromotionModel.findByIdAndUpdate(
        promotion[0]._id,
        { message: data.rowData.row1, promotion: isUpadtedBool },
        { new: true }
      );
      await MaintingModel.findByIdAndUpdate(
        mainting[0]._id,
        { mainting: false },
        { new: true }
      );
      await UpdateModel.findByIdAndUpdate(
        update[0]._id,
        { update: false },
        { new: true }
      );
      processed = true;
    }

    // Default response if no conditions were met
    if (!processed) {
      return NextResponse.json(
        { message: "No valid row and column provided or no data to process" },
        { status: 400, headers }
      );
    }

    return NextResponse.json(
      { message: "Webhook received successfully" },
      { headers }
    );
  } catch (error) {
    console.error("Erreur webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500, headers }
    );
  }
}

export async function GET() {
  try {
    const { MaintingModel, PromotionModel, UpdateModel } = await ibenModels;
    const mainting = await MaintingModel.find({}).limit(1).lean();
    const promotion = await PromotionModel.find({}).limit(1).lean();
    const update = await UpdateModel.find({}).limit(1).lean();
    return NextResponse.json({ mainting, promotion, update }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
