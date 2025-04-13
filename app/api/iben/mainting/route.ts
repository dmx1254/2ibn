import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

export async function PUT() {
  try {
    const { MaintingModel } = await ibenModels;

    const games = await MaintingModel.find({}).limit(1).lean();

    const mainting = games[0].mainting;

    return NextResponse.json(mainting, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}

// export async function POST() {
//   try {
//     const { OrderModelIben } = await ibenModels;

//     await OrderModelIben.deleteMany({});

//     return NextResponse.json(
//       { message: "successfully deleted all orders" },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(error, { status: 500 });
//   }
// }
