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

    let processed = false;

    if (data.columnLetter === "A" && mainting[0]) {
      const isUpadtedBool = data.rowData.maintenance ? true : false;
      await MaintingModel.findByIdAndUpdate(
        mainting[0]._id,
        { message: data.rowData.maintenance, mainting: isUpadtedBool },
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
    } else if (data.columnLetter === "A") {
      const isUpadtedBool = data.rowData.maintenance ? true : false;
      await MaintingModel.create({
        message: data.rowData.maintenance,
        mainting: isUpadtedBool,
      });
      // Mettre à jour les autres modèles existants pour mettre leurs booléens à false
      if (promotion[0]) {
        await PromotionModel.findByIdAndUpdate(
          promotion[0]._id,
          { promotion: false },
          { new: true }
        );
      }
      if (update[0]) {
        await UpdateModel.findByIdAndUpdate(
          update[0]._id,
          { update: false },
          { new: true }
        );
      }
      processed = true;
    }

    if (data.columnLetter === "B" && promotion[0]) {
      const isUpadtedBool = data.rowData.promotion ? true : false;
      await PromotionModel.findByIdAndUpdate(
        promotion[0]._id,
        { message: data.rowData.promotion, promotion: isUpadtedBool },
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
    } else if (data.columnLetter === "B") {
      const isUpadtedBool = data.rowData.promotion ? true : false;
      await PromotionModel.create({
        message: data.rowData.promotion,
        promotion: isUpadtedBool,
      });
      // Mettre à jour les autres modèles existants pour mettre leurs booléens à false
      if (mainting[0]) {
        await MaintingModel.findByIdAndUpdate(
          mainting[0]._id,
          { mainting: false },
          { new: true }
        );
      }
      if (update[0]) {
        await UpdateModel.findByIdAndUpdate(
          update[0]._id,
          { update: false },
          { new: true }
        );
      }
      processed = true;
    }

    if (data.columnLetter === "C" && update[0]) {
      const isUpadtedBool = data.rowData.update ? true : false;
      await UpdateModel.findByIdAndUpdate(
        update[0]._id,
        { message: data.rowData.update, update: isUpadtedBool },
        { new: true }
      );
      await MaintingModel.findByIdAndUpdate(
        mainting[0]._id,
        { mainting: false },
        { new: true }
      );
      await PromotionModel.findByIdAndUpdate(
        promotion[0]._id,
        { promotion: false },
        { new: true }
      );
      processed = true;
    } else if (data.columnLetter === "C") {
      const isUpadtedBool = data.rowData.update ? true : false;
      await UpdateModel.create({
        message: data.rowData.update,
        update: isUpadtedBool,
      });
      // Mettre à jour les autres modèles existants pour mettre leurs booléens à false
      if (mainting[0]) {
        await MaintingModel.findByIdAndUpdate(
          mainting[0]._id,
          { mainting: false },
          { new: true }
        );
      }
      if (promotion[0]) {
        await PromotionModel.findByIdAndUpdate(
          promotion[0]._id,
          { promotion: false },
          { new: true }
        );
      }
      processed = true;
    }

    // Default response if no conditions were met
    if (!processed) {
      return NextResponse.json(
        { message: "No valid column letter provided or no data to process" },
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

export async function OPTIONS() {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type"); // Retiré Authorization

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}
