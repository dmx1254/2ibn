import { NextResponse } from "next/server";

import { ibenModels } from "@/lib/models/ibendouma-models";

export async function POST(req: Request) {
  const data = await req.json();
  const { currency } = data;
  try {
    const { DollarModelIben } = await ibenModels;
    const dollar = await DollarModelIben.find();
    return NextResponse.json(dollar, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

// export async function POST(req: Request) {
//   try {
//     const { DollarModelIben } = await ibenModels;
//     const data = await req.json();

//     const dollar = await DollarModelIben.find();
//     const updatedDollar = await DollarModelIben.findByIdAndUpdate(
//       dollar[0]._id,
//       {
//         $set: {
//           dollar: Number(data.dollar),
//         },
//       }
//     );
//     return NextResponse.json(updatedDollar, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(error, { status: 500 });
//   }
// }
