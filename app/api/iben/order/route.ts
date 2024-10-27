import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { OrderModelIben } = await ibenModels;
    const data = await request.json();
    const newOrder = await OrderModelIben.create(data);
    return NextResponse.json(newOrder, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
