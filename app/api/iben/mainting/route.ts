import { NextResponse } from "next/server";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function GET() {
  try {
    const { MaintingModel, PromotionModel, UpdateModel } = await ibenModels;

    const mainting = await MaintingModel.find({}).limit(1).lean();
    const promotion = await PromotionModel.find({}).limit(1).lean();
    const update = await UpdateModel.find({}).limit(1).lean();

    const maintingData = {
      mainting: mainting[0].mainting,
      message: mainting[0].message,
    };
    const promotionData = {
      promotion: promotion[0].promotion,
      message: promotion[0].message,
    };
    const updateData = { update: update[0].update, message: update[0].message };

    return NextResponse.json(
      { mainting: maintingData, promotion: promotionData, update: updateData },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { MaintingModel, PromotionModel, UpdateModel } = await ibenModels;
    const mainting = await MaintingModel.find({}).limit(1).lean();
    const promotion = await PromotionModel.find({}).limit(1).lean();
    const update = await UpdateModel.find({}).limit(1).lean();
    const { message, type } = await req.json();

    if (type === "mainting" && mainting[0]) {
      await MaintingModel.findByIdAndUpdate(
        mainting[0]._id,
        { message, mainting: true },
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
    } else {
      await MaintingModel.create({ message });
    }

    if (type === "promotion" && promotion[0]) {
      await PromotionModel.findByIdAndUpdate(
        promotion[0]._id,
        { message },
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
    } else {
      await PromotionModel.create({ message });
    }

    if (type === "update" && update[0]) {
      await UpdateModel.findByIdAndUpdate(
        update[0]._id,
        { message },
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
    } else {
      await UpdateModel.create({ message });
    }

    return NextResponse.json(
      { message: "Message updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
