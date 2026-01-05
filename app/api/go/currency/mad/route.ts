import { NextResponse } from "next/server";

import { goapiModels } from "@/lib/models/ibytrade-models";

export async function POST(req: Request) {
  const data = await req.json();
  const { currency } = data;
  try {
    const { MadModel } = await goapiModels;
    const mad = await MadModel.find();
    return NextResponse.json(mad, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

// export async function POST(req: Request) {
//   try {
//     const { MadModel } = await goapiModels;
//     const data = await req.json();
//     const maddata = await MadModel.find();
//     await MadModel.findByIdAndUpdate(maddata[0]._id, { $set: { mad: data.mad } }, { new: true });
//     return NextResponse.json({ message: "Mad updated successfully" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(error, { status: 500 });
//   }
// }