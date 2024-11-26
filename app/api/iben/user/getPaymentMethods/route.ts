import { NextResponse } from "next/server";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function POST(req: Request) {
  const { UserPaymentModel } = await ibenModels;
  try {
    const { userId } = await req.json();
    const response = await UserPaymentModel.find({ userId });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
